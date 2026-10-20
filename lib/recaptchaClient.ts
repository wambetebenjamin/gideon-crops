"use client";

type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
  render: (
    container: HTMLElement,
    options: { sitekey: string; callback: (token: string) => void; theme?: "light" | "dark" },
  ) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SCRIPT_ID = "gc-recaptcha-v3";

export function recaptchaSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || undefined;
}

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("reCAPTCHA could not load"));
    document.head.appendChild(script);
  });
}

/**
 * Invisible reCAPTCHA v3. When no site key is configured the form still
 * works and the server decides how to treat a missing token.
 */
export async function getRecaptchaToken(action: string): Promise<string | undefined> {
  const siteKey = recaptchaSiteKey();
  if (!siteKey) return undefined;

  await loadScript(`https://www.google.com/recaptcha/api.js?render=${siteKey}`, SCRIPT_ID);
  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) return undefined;

  return new Promise<string>((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(siteKey, { action })
        .then((token) => resolve(token))
        .catch(() => resolve(""));
    });
  });
}

/** Visible reCAPTCHA v2, only requested when a v3 score comes back below 0.5. */
export async function renderRecaptchaV2(container: HTMLElement): Promise<string> {
  const siteKey = recaptchaSiteKey();
  if (!siteKey) return "";
  await loadScript("https://www.google.com/recaptcha/api.js?render=explicit", "gc-recaptcha-v2");
  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) return "";

  return new Promise<string>((resolve) => {
    grecaptcha.ready(() => {
      container.innerHTML = "";
      grecaptcha.render(container, {
        sitekey: siteKey,
        theme: "light",
        callback: (token: string) => resolve(token),
      });
    });
  });
}
