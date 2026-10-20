import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ShieldCheck, Sprout } from "lucide-react";
import SignInForm from "@/components/forms/SignInForm";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to save scan reports and track farm health over time. Scanning a crop never needs an account.",
  robots: { index: false },
};

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export default function SignInPage() {
  return (
    <>
      <Breadcrumbs title="Sign in" image="/images/farmer-portrait-maize.jpg" short />
      <section className="section-padding-100-70">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-6">
          <div className="section-heading text-center">
            <h2>Welcome back</h2>
            <p>Sign in to save reports and follow farms across the season.</p>
          </div>
          <Suspense fallback={<div className="gc-alert gc-alert-info">Loading the sign in form.</div>}>
            <SignInForm googleEnabled={googleEnabled} />
          </Suspense>
          <div className="row mt-30">
            <div className="col-12 col-sm-6 mb-20">
              <div className="d-flex align-items-start" style={{ gap: 10 }}>
                <Sprout size={20} color="#70c745" aria-hidden="true" style={{ flex: "0 0 auto", marginTop: 2 }} />
                <p style={{ fontSize: 14, marginBottom: 0 }}>
                  Farmers can still <Link href="/scan" style={{ color: "#70c745" }}>scan a crop</Link> without signing
                  in.
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6 mb-20">
              <div className="d-flex align-items-start" style={{ gap: 10 }}>
                <ShieldCheck size={20} color="#70c745" aria-hidden="true" style={{ flex: "0 0 auto", marginTop: 2 }} />
                <p style={{ fontSize: 14, marginBottom: 0 }}>
                  Officer access is verified before report saving is enabled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </section>
    </>
  );
}
