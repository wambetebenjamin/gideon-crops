import type { Metadata } from "next";
import SignUpForm from "@/components/forms/SignUpForm";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a Gideon Crops account. Farmers get read only access, extension officers can request verification to save scan reports.",
  robots: { index: false },
};

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export default function SignUpPage() {
  return (
    <>
      <Breadcrumbs title="Create an account" image="/images/crop-beans.jpg" short />
      <section className="section-padding-100-70">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">
          <div className="section-heading text-center">
            <h2>Join Gideon Crops</h2>
            <p>The default role is farmer. Officer verification unlocks saved reports and PDF export.</p>
          </div>
          <SignUpForm googleEnabled={googleEnabled} />
        </div>
      </div>
    </div>
      </section>
    </>
  );
}
