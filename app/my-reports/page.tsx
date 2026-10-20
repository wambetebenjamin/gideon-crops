import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import Breadcrumbs from "@/components/Breadcrumbs";
import ReportsBrowser from "@/components/reports/ReportsBrowser";
import { listReports } from "@/lib/store";

export const metadata: Metadata = {
  title: "My reports",
  description: "Saved scan reports for verified extension officers, with crop and date filters and PDF download.",
  robots: { index: false },
};

export default async function MyReportsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/my-reports");
  }

  const isOfficer = session.user.role === "officer";
  const reports = isOfficer ? await listReports(session.user.email as string) : [];

  return (
    <>
      <Breadcrumbs title="My reports" image="/images/farmer-harvested-maize.jpg" short />
      <section className="section-padding-100-70">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="section-heading">
                <h2>Scan reports</h2>
                <p>
                  {isOfficer
                    ? "Every scan you saved, with the diagnosis, the symptoms you ticked and the GPS location when you shared it."
                    : "Saved reports are available to verified extension officers. Your account is a farmer account."}
                </p>
              </div>
            </div>
          </div>

          {!isOfficer ? (
            <div className="gc-alert gc-alert-info">
              <strong>Farmer account.</strong> You can scan any crop and read every diagnosis without saving. To save
              reports, attach GPS and download PDFs,{" "}
              <Link href="/contact" style={{ color: "#70c745", fontWeight: 600 }}>
                request extension officer verification
              </Link>
              .
            </div>
          ) : null}

          <ReportsBrowser initialReports={reports} isOfficer={isOfficer} />
        </div>
      </section>
    </>
  );
}
