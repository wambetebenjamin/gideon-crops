"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, LogIn } from "lucide-react";
import { getRecaptchaToken } from "@/lib/recaptchaClient";

export default function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/my-reports";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      // Invisible reCAPTCHA v3 runs before the credentials are sent.
      await getRecaptchaToken("signin");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setError("That email and password did not match. Check the details and try again.");
        setBusy(false);
        return;
      }
      router.push(result?.url || callbackUrl);
      router.refresh();
    } catch {
      setError("Sign in could not be completed. Try again in a moment.");
      setBusy(false);
    }
  };

  return (
    <div className="gc-auth-card">
      <h3 style={{ fontSize: 26 }}>Sign in</h3>
      <p className="gc-form-note mb-30">
        Officers and farmers use the same sign in. Only verified extension officers can save scan reports.
      </p>

      {error ? (
        <div className="gc-alert gc-alert-error" role="alert">
          {error}
        </div>
      ) : null}

      <form onSubmit={submit} noValidate>
        <div className="gc-field mb-20">
          <label className="gc-label" htmlFor="gc-signin-email">
            Email
          </label>
          <input
            id="gc-signin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="gc-field mb-20">
          <label className="gc-label" htmlFor="gc-signin-password">
            Password
          </label>
          <input
            id="gc-signin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn alazea-btn d-inline-flex align-items-center w-100 justify-content-center" disabled={busy} style={{ gap: 8 }}>
          {busy ? <Loader2 size={16} className="gc-spin" aria-hidden="true" /> : <LogIn size={16} aria-hidden="true" />}
          {busy ? "Signing in" : "Sign in"}
        </button>
      </form>

      {googleEnabled ? (
        <>
          <div className="gc-divider">or</div>
          <button type="button" className="gc-google-btn" onClick={() => signIn("google", { callbackUrl })}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-2.8-.4-4.1H24v8.3h12.5c-.3 2.1-1.6 5.2-4.6 7.3l7.5 5.8c4.4-4.1 6.7-10.1 6.7-17.3z" />
              <path fill="#FBBC05" d="M10.4 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.8-6.1z" />
              <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.4-5.6l-7.5-5.8c-2 1.4-4.7 2.4-7.9 2.4-6.4 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
            Continue with Google
          </button>
        </>
      ) : null}

      <p className="gc-form-note mt-30 mb-0">
        New to Gideon Crops? <Link href="/auth/signup" style={{ color: "#70c745", fontWeight: 600 }}>Create an account</Link>. The
        scanner works without one.
      </p>
      <p className="gc-form-note mt-10 mb-0">
        Google sign in creates a farmer account by default. Request officer access from the contact page once you are
        signed in.
      </p>
    </div>
  );
}
