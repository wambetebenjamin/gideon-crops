import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRecaptcha } from "@/lib/recaptcha";

const schema = z.object({
  token: z.string().min(1),
  action: z.string().max(60).optional(),
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
    return NextResponse.json({ ok: false, error: "A reCAPTCHA token is required." }, { status: 422 });
  }

  const result = await verifyRecaptcha(parsed.data.token, request.headers.get("x-forwarded-for") ?? undefined);

  return NextResponse.json(
    {
      ok: result.success,
      score: result.score,
      requiresV2: result.requiresV2,
      skipped: result.skipped,
      errors: result.errorCodes ?? [],
    },
    { status: result.success ? 200 : 400 },
  );
}
