import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Gideon Crops handles camera images, scan data, GPS coordinates and account information under the Kenya Data Protection Act, 2019.",
  alternates: { canonical: "/legal/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumbs title="Privacy policy" trail={[{ href: "/legal/privacy-policy", label: "Legal" }]} image="/images/ox-plough-field.jpg" short />
      <section className="section-padding-100-70">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-9">
              <p className="gc-form-note">Last updated: 20 October 2026</p>
              <div className="gc-prose">
                <p>
                  Gideon Crops is a crop health tool for farmers in Kenya and East Africa. This policy explains what
                  we collect, why we collect it and the choices you have. It is written to align with the Kenya Data
                  Protection Act, 2019, and with the General Data Protection Regulation where it applies to visitors
                  from outside Kenya.
                </p>

                <h2>The short version</h2>
                <ul>
                  <li>Leaf photos are processed on your phone and are never uploaded to us.</li>
                  <li>No scan needs an account, and no scan needs an internet connection once the page is saved.</li>
                  <li>Reports are only saved when a signed in extension officer chooses to save one.</li>
                  <li>GPS coordinates are only captured after you say yes to a clear prompt.</li>
                  <li>We do not sell personal data and we do not run advertising trackers.</li>
                </ul>

                <h2>1. Who is responsible</h2>
                <p>
                  Gideon Crops is the data controller for the information described in this policy. You can reach the
                  team at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or on WhatsApp at {SITE.phoneDisplay}.
                </p>

                <h2>2. Camera and leaf images</h2>
                <p>
                  The scanner asks for camera permission using the browser MediaDevices API. The live video stream,
                  the captured frame and the resulting image data stay in your browser. The frame is drawn to a canvas
                  so the app can check that the photo is bright enough and mostly leaf. That check happens on your
                  device. No image, frame or image data is transmitted to Gideon Crops or to any third party, and no
                  external AI service is called.
                </p>
                <p>
                  You can refuse camera permission and still use the scanner by choosing a photo from your phone. That
                  photo is also processed only on your device.
                </p>

                <h2>3. Symptom selections and diagnoses</h2>
                <p>
                  The symptoms you tick and the crop you select are used to match against a symptom database that ships
                  with the app. For a basic scan this happens entirely on your device. If you are signed in as a
                  verified extension officer and you choose Save report, the following is sent to us and stored on your
                  account: crop, selected symptoms, the diagnosis returned, the interface language, the date and time,
                  your optional field notes, and the GPS coordinates only if you allowed them.
                </p>

                <h2>4. Location data</h2>
                <p>
                  Location is never requested when you open the scanner or the site. If an officer chooses to attach a
                  location to a saved report, an in-app prompt explains why the coordinates are useful before the
                  browser Geolocation API is called. Declining has no effect on the scan or the diagnosis. Coordinates
                  are stored with that report only and can be seen in the officer&apos;s report list and in the PDF the
                  officer downloads.
                </p>

                <h2>5. Account data</h2>
                <p>If you create an account we store your name, email address, a salted password hash and your role.</p>
                <ul>
                  <li>Farmer accounts are read only and cannot save reports.</li>
                  <li>Extension officer accounts are verified by our team before saving is enabled.</li>
                  <li>
                    If you sign in with Google, we receive your name and email address from Google. We do not receive
                    your Google password.
                  </li>
                </ul>

                <h2>6. Cookies and local storage</h2>
                <p>
                  We use a small amount of local storage to remember your cookie choices under the key{" "}
                  <code>gideon_crops_consent</code>, your language preference and the last crop you scanned. Necessary
                  storage keeps the app working offline. Functional, analytics and marketing storage are optional and
                  only switched on with your consent. See the{" "}
                  <Link href="/legal/cookie-policy">cookie policy</Link> for the full list.
                </p>

                <h2>7. Contact forms and reCAPTCHA</h2>
                <p>
                  The contact and account request forms ask for your name, email, optional phone number, role, county
                  and message. We use that only to reply. The forms are protected by Google reCAPTCHA v3, which
                  processes technical signals to score whether a request looks automated. Google&apos;s use of that data
                  is governed by the Google Privacy Policy and Terms of Service.
                </p>

                <h2>8. Service providers</h2>
                <ul>
                  <li>Vercel, for hosting and for the storage of saved officer reports.</li>
                  <li>Google reCAPTCHA, for form protection.</li>
                  <li>Our email provider, for delivering messages sent through the contact form.</li>
                </ul>
                <p>
                  These providers process data on our instructions. Where a provider stores data outside Kenya we rely
                  on the safeguards described in section 48 of the Kenya Data Protection Act, 2019.
                </p>

                <h2>9. How long we keep data</h2>
                <ul>
                  <li>Saved scan reports: kept while your officer account is active, and deleted within 90 days of account closure.</li>
                  <li>Contact messages: kept for 24 months for follow up.</li>
                  <li>Consent records: kept for as long as the consent is relied on, plus 12 months.</li>
                </ul>

                <h2>10. Your rights</h2>
                <p>
                  Under the Kenya Data Protection Act, 2019 you can ask for a copy of your data, ask us to correct it,
                  ask us to delete it, object to processing, and withdraw consent for optional storage at any time. Send
                  a request to <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we will respond within 30 days. If
                  you are not satisfied you can complain to the Office of the Data Protection Commissioner in Kenya.
                </p>

                <h2>11. Children</h2>
                <p>
                  The tool is intended for farmers and agricultural workers. It is not directed at children, and we do
                  not knowingly collect personal data from anyone under 18.
                </p>

                <h2>12. Changes</h2>
                <p>
                  If this policy changes materially we will update the date at the top and, where the change affects
                  consent, ask you again through the cookie banner.
                </p>

                <h2>13. Contact</h2>
                <p>
                  Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or WhatsApp {SITE.phoneDisplay}. Postal
                  enquiries can be addressed to the Gideon Crops data protection contact, Nairobi, Kenya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
