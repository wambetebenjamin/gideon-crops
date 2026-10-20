"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, UserPlus } from "lucide-react";
import { getRecaptchaToken, renderRecaptchaV2 } from "@/lib/recaptchaClient";

type FieldErrors = Record<string, string>;

export default function SignUpForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "", role: "farmer" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [requiresV2, setRequiresV2] = useState(false);
  const v2Ref = useRef<HTMLDivElement | null>(null);
  const v2TokenRef = useRef<string>("");

  useEffect(() => {
    if (!requiresV2 || !v2Ref.current) return;
    void renderRecaptchaV2(v2Ref.current).then((token) => {
      v2TokenRef.current = token;
    });
  }, [requiresV2]);

  const update = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage("");

    if (values.password !== values.confirm) {
      setErrors({ confirm: "The two passwords do not match" });
      setBusy(false);
      return;
    }

    try {
      const token = requiresV2 && v2TokenRef.current ? v2TokenRef.current : await getRecaptchaToken("signup");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          requestedRole: values.role,
          token,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
        requiresV2?: boolean;
      };

      if (data.requiresV2) {
        setRequiresV2(true);
        setMessage("Please complete the quick check below, then create the account again.");
        setBusy(false);
        return;
      }

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        throw new Error(data.error || "The account could not be created.");
      }

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setMessage("Account created. Please sign in with your new password.");
        router.push("/auth/signin");
        return;
      }

      router.push(values.role === "officer" ? "/contact" : "/scan");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The account could not be created.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="gc-auth-card">
      <h3 style={{ fontSize: 26 }}>Create an account</h3>
      <p className="gc-form-note mb-30">
        Farmer accounts are read only. Extension officer accounts are verified by the Gideon Crops team before report
        saving is switched on. A scan never needs an account.
      </p>

      {message ? (
        <div className="gc-alert gc-alert-error" role="alert">
          {message}
        </div>
      ) : null}

      <form onSubmit={submit} noValidate>
        <div className="gc-field mb-20">
          <label className="gc-label" htmlFor="gc-signup-name">
            Full name
          </label>
          <input id="gc-signup-name" type="text" value={values.name} onChange={(e) => update("name", e.target.value)} required />
          {errors.name ? <span className="gc-field-error">{errors.name}</span> : null}
        </div>

        <div className="gc-field mb-20">
          <label className="gc-label" htmlFor="gc-signup-email">
            Email
          </label>
          <input
            id="gc-signup-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
          {errors.email ? <span className="gc-field-error">{errors.email}</span> : null}
        </div>

        <div className="row">
          <div className="col-12 col-sm-6">
            <div className="gc-field mb-20">
              <label className="gc-label" htmlFor="gc-signup-password">
                Password
              </label>
              <input
                id="gc-signup-password"
                type="password"
                autoComplete="new-password"
                value={values.password}
                onChange={(e) => update("password", e.target.value)}
                required
                minLength={8}
              />
              {errors.password ? <span className="gc-field-error">{errors.password}</span> : null}
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="gc-field mb-20">
              <label className="gc-label" htmlFor="gc-signup-confirm">
                Confirm password
              </label>
              <input
                id="gc-signup-confirm"
                type="password"
                autoComplete="new-password"
                value={values.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                required
              />
              {errors.confirm ? <span className="gc-field-error">{errors.confirm}</span> : null}
            </div>
          </div>
        </div>

        <div className="gc-field mb-20">
          <label className="gc-label" htmlFor="gc-signup-role">
            I am joining as
          </label>
          <select id="gc-signup-role" value={values.role} onChange={(e) => update("role", e.target.value)}>
            <option value="farmer">Farmer, read only</option>
            <option value="officer">Extension officer, request verification</option>
          </select>
          <span className="gc-form-note">
            Choosing extension officer sends a verification request. Your account starts as a farmer until the team
            confirms it.
          </span>
        </div>

        {requiresV2 ? <div ref={v2Ref} className="mb-20" /> : null}

        <button type="submit" className="btn alazea-btn d-inline-flex align-items-center w-100 justify-content-center" disabled={busy} style={{ gap: 8 }}>
          {busy ? <Loader2 size={16} className="gc-spin" aria-hidden="true" /> : <UserPlus size={16} aria-hidden="true" />}
          {busy ? "Creating account" : "Create account"}
        </button>
      </form>

      {googleEnabled ? (
        <>
          <div className="gc-divider">or</div>
          <button type="button" className="gc-google-btn" onClick={() => signIn("google", { callbackUrl: "/scan" })}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-2.8-.4-4.1H24v8.3h12.5c-.3 2.1-1.6 5.2-4.6 7.3l7.5 5.8c4.4-4.1 6.7-10.1 6.7-17.3z" />
              <path fill="#FBBC05" d="M10.4 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.8-6.1z" />
              <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.4-5.6l-7.5-5.8c-2 1.4-4.7 2.4-7.9 2.4-6.4 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
            Sign up with Google
          </button>
        </>
      ) : null}

      <p className="gc-form-note mt-30 mb-0">
        Already have an account? <Link href="/auth/signin" style={{ color: "#70c745", fontWeight: 600 }}>Sign in</Link>.
      </p>
    </div>
  );
}
