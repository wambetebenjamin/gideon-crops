export type RecaptchaVerification = {
  success: boolean;
  score: number | null;
  requiresV2: boolean;
  skipped: boolean;
  errorCodes?: string[];
};

/**
 * Server side reCAPTCHA v3 verification. The secret key is only ever read on
 * the server. When a score below 0.5 comes back the client is told to complete
 * a visible reCAPTCHA v2 challenge before the form is accepted.
 */
export async function verifyRecaptcha(
  token: string | undefined,
  remoteIp?: string,
): Promise<RecaptchaVerification> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    // The key is not configured in this environment. Forms stay usable in
    // development and on preview builds, and the call is clearly reported.
    return { success: true, score: null, requiresV2: false, skipped: true };
  }

  if (!token) {
    return { success: false, score: null, requiresV2: false, skipped: false, errorCodes: ["missing-input-response"] };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      cache: "no-store",
    });
    const result = (await response.json()) as {
      success: boolean;
      score?: number;
      "error-codes"?: string[];
    };

    if (!result.success) {
      return {
        success: false,
        score: null,
        requiresV2: false,
        skipped: false,
        errorCodes: result["error-codes"] ?? [],
      };
    }

    const score = typeof result.score === "number" ? result.score : null;
    const requiresV2 = score !== null && score < 0.5;

    return {
      success: !requiresV2,
      score,
      requiresV2,
      skipped: false,
      errorCodes: requiresV2 ? ["low-score"] : [],
    };
  } catch (error) {
    console.error("[gideon] reCAPTCHA verification failed", error);
    return { success: false, score: null, requiresV2: false, skipped: false, errorCodes: ["verification-unreachable"] };
  }
}
