import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRecaptcha } from "@/lib/recaptcha";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal("")),
  role: z.enum(["farmer", "officer", "other"]).default("farmer"),
  subject: z.string().min(3).max(140),
  county: z.string().max(80).optional().or(z.literal("")),
  message: z.string().min(20).max(4000),
  mode: z.enum(["general", "officer"]).default("general"),
  token: z.string().optional(),
});

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 422 });
  }

  const captcha = await verifyRecaptcha(parsed.data.token, request.headers.get("x-forwarded-for") ?? undefined);
  if (captcha.requiresV2) {
    return NextResponse.json(
      { ok: false, requiresV2: true, error: "Please complete the quick check before sending." },
      { status: 200 },
    );
  }
  if (!captcha.success && !captcha.skipped) {
    return NextResponse.json(
      { ok: false, error: "The reCAPTCHA check failed. Reload the page and try again." },
      { status: 400 },
    );
  }

  const { name, email, phone, role, subject, county, message, mode } = parsed.data;
  const to = process.env.SMTP_FROM || "hello@gideoncrops.co.ke";
  const html = `
    <h2>${mode === "officer" ? "Extension officer account request" : "New Gideon Crops message"}</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || "not given")}</p>
    <p><strong>Role:</strong> ${escapeHtml(role)}</p>
    <p><strong>County or region:</strong> ${escapeHtml(county || "not given")}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <hr />
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    <hr />
    <p style="color:#707070;font-size:12px">Sent from the Gideon Crops contact form. reCAPTCHA score: ${
      captcha.score ?? "not configured"
    }</p>
  `;

  const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  if (!smtpConfigured) {
    // The message is accepted but the SMTP relay is not configured in this
    // environment. It is logged so nothing is silently lost during setup.
    console.info("[gideon] contact message (SMTP not configured)", { name, email, subject, mode });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });

    await transporter.sendMail({
      from: to,
      to,
      replyTo: email,
      subject: `[Gideon Crops] ${subject}`,
      html,
      text: `${name} (${email}, ${phone || "no phone"})\nRole: ${role}\nCounty: ${county || "not given"}\n\n${message}`,
    });

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[gideon] contact email failed", error);
    return NextResponse.json(
      { ok: false, error: "The message could not be delivered right now. Please use WhatsApp in the meantime." },
      { status: 502 },
    );
  }
}
