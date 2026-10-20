import Link from "next/link";
import type { Metadata } from "next";
import { Leaf } from "lucide-react";
import { SITE, whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="breadcrumb-area">
      <div
        className="top-breadcrumb-area bg-img bg-overlay d-flex align-items-center justify-content-center"
        style={{ backgroundImage: "url(/images/maize-field-farmers.jpg)" }}
      >
        <h1 className="gc-breadcrumb-title">Page not found</h1>
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center section-padding-100">
            <span className="d-inline-flex align-items-center justify-content-center mb-30" style={{ width: 96, height: 96, borderRadius: "50%", backgroundColor: "#f2f4f5" }}>
              <Leaf size={46} color="#70c745" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h2 style={{ fontSize: 30, textTransform: "uppercase", marginBottom: 14 }}>This crop page was not found</h2>
            <p className="mb-30" style={{ maxWidth: 520, margin: "0 auto 30px" }}>
              The page you followed does not exist, or the link has changed. The scanner and the crop library are
              still a tap away.
            </p>
            <div className="d-flex flex-wrap justify-content-center" style={{ gap: 12 }}>
              <Link href="/" className="btn alazea-btn">
                Back to Home
              </Link>
              <Link href="/scan" className="btn alazea-btn">
                Scan a crop
              </Link>
              <Link href="/crops" className="btn alazea-btn">
                Crop library
              </Link>
            </div>
            <p className="mt-30 mb-0">
              Need help now?{" "}
              <a href={whatsappLink(WHATSAPP_MESSAGES.general)} style={{ color: "#70c745" }}>
                WhatsApp {SITE.phoneDisplay}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
