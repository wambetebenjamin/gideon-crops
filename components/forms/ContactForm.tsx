"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { z } from "zod";
import { getRecaptchaToken, recaptchaSiteKey, renderRecaptchaV2 } from "@/lib/recaptchaClient";

const schema = z.object({
  name: z.string().min(2, "Tell us your name"),
  email: z.string().email("Use a valid email address"),
  phone: z.string().optional(),
  role: z.enum(["farmer", "officer", "other"]),
  subject: z.string().min(3, "Add a short subject"),
  county: z.string().optional(),
  message: z.string().min(20, "Give us a little more detail, at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  email: "",
  phone: "",
  role: "farmer",
  subject: "",
  county: "",
  message: "",
};

type Mode = "general" | "officer";

export default function ContactForm() {
  const [mode, setMode] = useState<Mode>("general");
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [requiresV2, setRequiresV2] = useState(false);
  const v2Ref = useRef<HTMLDivElement | null>(null);
  const v2TokenRef = useRef<string>("");

  useEffect(() => {
    if (!requiresV2 || !v2Ref.current) return;
    void renderRecaptchaV2(v2Ref.current).then((token) => {
      v2TokenRef.current = token;
    });
  }, [requiresV2]);

  const update = (key: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload: FormValues = {
      ...values,
      subject: mode === "officer" ? `Extension officer account request: ${values.county || "Kenya"}` : values.subject,
      role: mode === "officer" ? "officer" : values.role,
    };

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("sending");
    setMessage("");

    try {
      const token = requiresV2 && v2TokenRef.current ? v2TokenRef.current : await getRecaptchaToken(mode === "officer" ? "officer_request" : "contact");
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, mode, token }),
      });
      const data = (await response.json()) as { ok?: boolean; requiresV2?: boolean; error?: string };

      if (data.requiresV2) {
        setRequiresV2(true);
        setStatus("idle");
        setMessage("Please complete the quick check below, then send again.");
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "The message could not be sent.");
      }

      setStatus("sent");
      setMessage(
        mode === "officer"
          ? "Thank you. Your officer request is with the team, we verify requests within two working days."
          : "Thank you. Your message has reached the Gideon Crops team.",
      );
      setValues(EMPTY);
      setRequiresV2(false);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The message could not be sent.");
    }
  };

  return (
    <div className="gc-auth-card">
      <div className="d-flex flex-wrap mb-30" style={{ gap: 10 }}>
        <button
          type="button"
          className={`btn alazea-btn${mode === "general" ? "" : " gc-manage-btn"}`}
          onClick={() => setMode("general")}
          aria-pressed={mode === "general"}
        >
          Send a message
        </button>
        <button
          type="button"
          className={`btn alazea-btn${mode === "officer" ? "" : " gc-manage-btn"}`}
          onClick={() => setMode("officer")}
          aria-pressed={mode === "officer"}
        >
          Request an officer account
        </button>
      </div>

      <h3 style={{ fontSize: 24 }}>{mode === "officer" ? "Extension officer account" : "Talk to us"}</h3>
      <p className="gc-form-note mb-30">
        {mode === "officer"
          ? "Tell us where you work and how many farmers you support. Officer accounts can save scan reports, attach GPS and download PDFs."
          : "Questions about a diagnosis, a partnership, or a farm visit. We reply within one working day."}
      </p>

      {status === "sent" ? (
        <div className="gc-alert gc-alert-success" role="status">
          {message}
        </div>
      ) : null}
      {status === "error" ? (
        <div className="gc-alert gc-alert-error" role="alert">
          {message}
        </div>
      ) : null}
      {status === "idle" && message ? (
        <div className="gc-alert gc-alert-info" role="status">
          {message}
        </div>
      ) : null}

      <form onSubmit={submit} noValidate>
        <div className="row">
          <div className="col-12 col-sm-6">
            <div className="gc-field mb-20">
              <label className="gc-label" htmlFor="gc-name">
                Your name
              </label>
              <input id="gc-name" type="text" value={values.name} onChange={(e) => update("name", e.target.value)} required />
              {errors.name ? <span className="gc-field-error">{errors.name}</span> : null}
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="gc-field mb-20">
              <label className="gc-label" htmlFor="gc-email">
                Email
              </label>
              <input id="gc-email" type="email" value={values.email} onChange={(e) => update("email", e.target.value)} required />
              {errors.email ? <span className="gc-field-error">{errors.email}</span> : null}
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="gc-field mb-20">
              <label className="gc-label" htmlFor="gc-phone">
                Phone or WhatsApp (optional)
              </label>
              <input id="gc-phone" type="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+254..." />
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="gc-field mb-20">
              <label className="gc-label" htmlFor="gc-county">
                {mode === "officer" ? "County or region you serve" : "County (optional)"}
              </label>
              <input id="gc-county" type="text" value={values.county} onChange={(e) => update("county", e.target.value)} placeholder="e.g. Kakamega" />
            </div>
          </div>

          {mode === "general" ? (
            <>
              <div className="col-12 col-sm-6">
                <div className="gc-field mb-20">
                  <label className="gc-label" htmlFor="gc-role">
                    I am a
                  </label>
                  <select id="gc-role" value={values.role} onChange={(e) => update("role", e.target.value)}>
                    <option value="farmer">Farmer</option>
                    <option value="officer">Extension officer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="gc-field mb-20">
                  <label className="gc-label" htmlFor="gc-subject">
                    Subject
                  </label>
                  <input id="gc-subject" type="text" value={values.subject} onChange={(e) => update("subject", e.target.value)} required />
                  {errors.subject ? <span className="gc-field-error">{errors.subject}</span> : null}
                </div>
              </div>
            </>
          ) : (
            <div className="col-12">
              <div className="gc-alert gc-alert-info">
                Include your organisation or county extension office in the message so we can verify the request.
                Farmer accounts stay read only until an officer request is approved.
              </div>
            </div>
          )}

          <div className="col-12">
            <div className="gc-field mb-20">
              <label className="gc-label" htmlFor="gc-message">
                Message
              </label>
              <textarea
                id="gc-message"
                rows={6}
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder={
                  mode === "officer"
                    ? "Where you work, the crops you advise on, how many farmers you support"
                    : "How can we help"
                }
                required
              />
              {errors.message ? <span className="gc-field-error">{errors.message}</span> : null}
            </div>
          </div>
        </div>

        {requiresV2 ? <div ref={v2Ref} className="mb-20" /> : null}

        <div className="d-flex flex-wrap align-items-center" style={{ gap: 14 }}>
          <button type="submit" className="btn alazea-btn d-inline-flex align-items-center" disabled={status === "sending"} style={{ gap: 8 }}>
            {status === "sending" ? <Loader2 size={16} className="gc-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
            {status === "sending" ? "Sending" : mode === "officer" ? "Send request" : "Send message"}
          </button>
          <span className="gc-form-note">
            {recaptchaSiteKey()
              ? "Protected by reCAPTCHA v3. We never share your details."
              : "reCAPTCHA is not configured in this environment, the form is still validated on the server."}
          </span>
        </div>
      </form>
    </div>
  );
}
