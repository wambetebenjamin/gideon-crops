"use client";

import "./globals.css";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div className="container section-padding-100">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-7 text-center">
              <img src="/img/core-img/leaf.png" alt="" width={56} height={56} style={{ margin: "0 auto 24px" }} />
              <h1 style={{ fontSize: 30, textTransform: "uppercase", marginBottom: 14 }}>Something went wrong</h1>
              <p style={{ marginBottom: 10 }}>
                The page could not finish loading. Nothing you scanned was sent anywhere, the photos stay on your
                phone.
              </p>
              <p style={{ marginBottom: 30 }}>
                WhatsApp us on <a href="https://wa.me/254112272061" style={{ color: "#70c745" }}>+254112272061</a> if
                this keeps happening.
              </p>
              <button type="button" className="btn alazea-btn" onClick={reset}>
                Try Again
              </button>
              {error.digest ? (
                <p className="gc-form-note mt-20 mb-0">Reference: {error.digest}</p>
              ) : null}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
