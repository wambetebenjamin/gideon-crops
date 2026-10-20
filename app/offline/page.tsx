import Link from "next/link";
import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "You are offline",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <>
      <Breadcrumbs title="You are offline" image="/images/ox-plough-field.jpg" short />
    <div className="container section-padding-100">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7 text-center">
          <span
            className="d-inline-flex align-items-center justify-content-center mb-30"
            style={{ width: 96, height: 96, borderRadius: "50%", backgroundColor: "#f2f4f5" }}
          >
            <WifiOff size={44} color="#70c745" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h2 style={{ fontSize: 30, textTransform: "uppercase", marginBottom: 14 }}>You are offline</h2>
          <p style={{ maxWidth: 520, margin: "0 auto 30px" }}>
            This page has not been saved on your phone yet. The scanner, the symptom checklist and the diagnosis
            advice already work without internet, so you can go straight back to scanning.
          </p>
          <Link href="/scan" className="btn alazea-btn">
            Open the scanner
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
