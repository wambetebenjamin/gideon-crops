import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "The cookies and local storage entries Gideon Crops uses, what each one does and how to change your choices under the Kenya Data Protection Act, 2019.",
  alternates: { canonical: "/legal/cookie-policy" },
};

const STORAGE = [
  {
    name: "gideon_crops_consent",
    type: "Local storage",
    category: "Necessary",
    purpose: "Remembers which storage categories you allowed, so we do not ask on every page.",
    duration: "Until cleared or changed",
  },
  {
    name: "__Host-authjs.csrf-token / authjs.session-token",
    type: "Cookie",
    category: "Necessary",
    purpose: "Keeps an extension officer signed in and protects the sign in form against cross site requests.",
    duration: "Session, or 30 days if you stay signed in",
  },
  {
    name: "gideon_language",
    type: "Local storage",
    category: "Functional",
    purpose: "Remembers whether you chose English or Kiswahili for diagnoses.",
    duration: "Until cleared",
  },
  {
    name: "gideon_last_crop",
    type: "Local storage",
    category: "Functional",
    purpose: "Remembers the last crop you scanned so the checklist opens on the right crop.",
    duration: "Until cleared",
  },
  {
    name: "gideon_preloader_shown",
    type: "Session storage",
    category: "Necessary",
    purpose: "Stops the loading screen repeating on every page while you move around the app.",
    duration: "Until you close the tab",
  },
  {
    name: "_vercel/insights, va_*",
    type: "Cookie",
    category: "Analytics",
    purpose: "Anonymous page view counts from Vercel Analytics, used to see which crop guides farmers read.",
    duration: "Up to 12 months",
  },
  {
    name: "gideon_campaign_*",
    type: "Local storage",
    category: "Marketing",
    purpose: "Would measure outreach campaigns if Gideon Crops runs farmer advertising. Not set today.",
    duration: "Up to 90 days",
  },
  {
    name: "_GRECAPTCHA",
    type: "Cookie",
    category: "Necessary",
    purpose: "Set by Google reCAPTCHA to protect the contact and sign up forms from automated abuse.",
    duration: "Up to 6 months",
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <Breadcrumbs title="Cookie policy" trail={[{ href: "/legal/cookie-policy", label: "Legal" }]} image="/images/crop-potato.jpg" short />
      <section className="section-padding-100-70">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-9">
              <p className="gc-form-note">Last updated: 20 October 2026</p>
              <div className="gc-prose">
                <p>
                  A cookie is a small file a site stores in your browser. Local storage and session storage work in a
                  similar way and are used here too. We keep this list short because a farming tool does not need much.
                  This policy is written for the Kenya Data Protection Act, 2019, which requires clear information and a
                  real choice before non essential storage is set.
                </p>

                <h2>Your choice</h2>
                <p>
                  When you first arrive a banner at the bottom of the screen asks whether you accept all categories,
                  or whether you want to manage them. Necessary storage is always on because the app cannot run without
                  it. Functional, analytics and marketing storage stay off until you switch them on.
                </p>
                <CookiePreferencesButton />

                <h2>What we store</h2>
                <div className="table-responsive">
                  <table className="table" style={{ marginTop: 24 }}>
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Category</th>
                        <th scope="col">Purpose</th>
                        <th scope="col">Lasts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STORAGE.map((item) => (
                        <tr key={item.name}>
                          <td style={{ fontSize: 14, color: "#303030" }}>{item.name}</td>
                          <td style={{ fontSize: 14 }}>{item.type}</td>
                          <td style={{ fontSize: 14 }}>{item.category}</td>
                          <td style={{ fontSize: 14 }}>{item.purpose}</td>
                          <td style={{ fontSize: 14 }}>{item.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h2>What we do not store</h2>
                <ul>
                  <li>We never store the leaf photos you capture. They stay in your browser.</li>
                  <li>We do not use advertising cookies or cross site tracking pixels.</li>
                  <li>We do not set any storage for GPS coordinates. Coordinates only travel with a report you explicitly save.</li>
                </ul>

                <h2>Changing your mind</h2>
                <p>
                  Use the button above to reopen your preferences. Choosing &ldquo;Necessary only&rdquo; clears the
                  optional flags immediately. You can also clear site data in your browser settings, which removes every
                  entry in the table and brings the banner back on your next visit.
                </p>

                <h2>Do not track</h2>
                <p>
                  We do not currently respond to browser Do Not Track signals because we do not run third party
                  advertising. Analytics only loads when you allow the analytics category.
                </p>

                <h2>More information</h2>
                <p>
                  The <Link href="/legal/privacy-policy">privacy policy</Link> explains the wider picture, including
                  account data and officer reports. Questions can go to{" "}
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
