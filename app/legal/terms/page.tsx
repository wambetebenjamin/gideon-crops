import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The terms that apply when you use the Gideon Crops crop disease detector, including the limits of the advice it gives.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs title="Terms of use" trail={[{ href: "/legal/terms", label: "Legal" }]} image="/images/crop-wheat.jpg" short />
      <section className="section-padding-100-70">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-9">
              <p className="gc-form-note">Last updated: 20 October 2026</p>
              <div className="gc-prose">
                <h2>1. Agreement</h2>
                <p>
                  By using Gideon Crops you agree to these terms. If you do not agree, please do not use the tool. The
                  service is operated from Kenya and is intended for farmers, farm workers and extension officers in
                  Kenya and East Africa.
                </p>

                <h2>2. What the tool does</h2>
                <p>
                  Gideon Crops captures a photo of a leaf on your device, asks you to tick the symptoms you can see and
                  matches those observations against a local symptom database. It then shows the most likely causes with
                  treatment and prevention advice in English and Kiswahili.
                </p>

                <h2>3. Agricultural advice disclaimer</h2>
                <p>
                  The diagnoses are a decision aid. They are not a laboratory test, a veterinary or agronomic
                  certification, or a guarantee of outcome. Several very different problems can produce the same
                  visible symptom. You are responsible for confirming a diagnosis and for every decision you make about
                  a crop, including the choice and rate of any pesticide or fertiliser.
                </p>
                <ul>
                  <li>Always read and follow the product label, including the pre-harvest interval.</li>
                  <li>Never apply a product that is not registered for the crop you are treating.</li>
                  <li>Speak to your county extension officer before treating a problem that is spreading quickly.</li>
                </ul>

                <h2>4. Accounts and roles</h2>
                <p>
                  Scanning a crop does not require an account. Accounts exist so extension officers can save reports,
                  attach GPS coordinates and download PDFs. Farmer accounts are read only. Officer access is granted
                  after verification and can be withdrawn if the account is misused. You are responsible for keeping
                  your password safe and for activity under your account.
                </p>

                <h2>5. Acceptable use</h2>
                <ul>
                  <li>Do not attempt to break, overload or probe the service or its APIs.</li>
                  <li>Do not upload unlawful, harmful or deliberately misleading content.</li>
                  <li>Do not resell access to the service or present its output as a certified laboratory result.</li>
                  <li>Do not scrape the symptom database for a competing commercial product without written permission.</li>
                </ul>

                <h2>6. Availability</h2>
                <p>
                  The scanner is designed to work offline once the page and the database have been saved on your
                  device. Online features such as saving reports, contacting us or downloading PDFs need a connection.
                  We may change, suspend or withdraw features, and we do not promise uninterrupted availability.
                </p>

                <h2>7. Intellectual property</h2>
                <p>
                  The Gideon Crops name, the interface, the symptom database text and the advice wording belong to
                  Gideon Crops. You may use the output for your own farm and share a report with your extension officer.
                  You may not republish the database as your own.
                </p>

                <h2>8. Third party services</h2>
                <p>
                  The site links to WhatsApp and uses Google reCAPTCHA on forms. Your use of those services is governed
                  by their own terms. Photographs used on the site are licensed from Pexels.
                </p>

                <h2>9. Limitation of liability</h2>
                <p>
                  To the extent permitted by Kenyan law, Gideon Crops is not liable for crop loss, lost income or any
                  indirect loss arising from use of the tool or from reliance on a diagnosis. Nothing in these terms
                  limits liability that cannot be limited by law.
                </p>

                <h2>10. Privacy</h2>
                <p>
                  Our handling of personal data is described in the{" "}
                  <Link href="/legal/privacy-policy">privacy policy</Link> and the{" "}
                  <Link href="/legal/cookie-policy">cookie policy</Link>.
                </p>

                <h2>11. Changes to these terms</h2>
                <p>
                  We may update these terms. The date at the top shows the current version. Continuing to use the tool
                  after an update means you accept the updated terms.
                </p>

                <h2>12. Governing law and contact</h2>
                <p>
                  These terms are governed by the laws of Kenya. Questions can be sent to{" "}
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or WhatsApp {SITE.phoneDisplay}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
