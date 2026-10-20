"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Leaf, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[gideon] unexpected error", error);
  }, [error]);

  return (
    <div className="breadcrumb-area">
      <div
        className="top-breadcrumb-area bg-img bg-overlay d-flex align-items-center justify-content-center"
        style={{ backgroundImage: "url(/images/farmer-portrait-maize.jpg)" }}
      >
        <h1 className="gc-breadcrumb-title">Something went wrong</h1>
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center section-padding-100">
            <span
              className="d-inline-flex align-items-center justify-content-center mb-30"
              style={{ width: 96, height: 96, borderRadius: "50%", backgroundColor: "#f2f4f5" }}
            >
              <Leaf size={46} color="#70c745" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h2 style={{ fontSize: 30, textTransform: "uppercase", marginBottom: 14 }}>We could not load this page</h2>
            <p style={{ maxWidth: 560, margin: "0 auto 30px" }}>
              A problem stopped this page from opening. Try again, and if it keeps happening reach us on WhatsApp at{" "}
              <a href="https://wa.me/254112272061" style={{ color: "#70c745" }}>
                +254112272061
              </a>
              .
            </p>
            <div className="d-flex flex-wrap justify-content-center" style={{ gap: 12 }}>
              <button type="button" className="btn alazea-btn d-inline-flex align-items-center" onClick={reset} style={{ gap: 10 }}>
                <RefreshCw size={17} aria-hidden="true" /> Try Again
              </button>
              <Link href="/" className="btn alazea-btn">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
