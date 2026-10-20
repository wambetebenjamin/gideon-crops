import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/password";
import { getUser, saveUser } from "@/lib/store";
import { verifyRecaptcha } from "@/lib/recaptcha";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  requestedRole: z.enum(["farmer", "officer"]).default("farmer"),
  token: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    });
    return NextResponse.json({ ok: false, error: "Please check the form.", fieldErrors }, { status: 422 });
  }

  const captcha = await verifyRecaptcha(parsed.data.token, request.headers.get("x-forwarded-for") ?? undefined);
  if (!captcha.success) {
    return NextResponse.json(
      { ok: false, error: "The reCAPTCHA check failed. Reload the page and try again.", requiresV2: captcha.requiresV2 },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await getUser(email);
  if (existing) {
    return NextResponse.json({ ok: false, error: "That email already has an account. Sign in instead." }, { status: 409 });
  }

  // A new account is a farmer account. Officer access is granted by an
  // administrator after verification, the request is recorded here.
  await saveUser({
    email,
    name: parsed.data.name.trim(),
    role: "farmer",
    passwordHash: hashPassword(parsed.data.password),
    provider: "credentials",
    createdAt: new Date().toISOString(),
    extensionRequested: parsed.data.requestedRole === "officer",
  });

  return NextResponse.json({ ok: true, role: "farmer", officerRequested: parsed.data.requestedRole === "officer" });
}
