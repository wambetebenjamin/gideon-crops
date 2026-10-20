import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, BookOpenCheck, Handshake, Leaf, Mail, MapPin } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TOTAL_CONDITIONS } from "@/lib/symptoms";
import { SITE, whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Gideon Crops",
  description:
    "Why Gideon Crops exists, how the local symptom database was built with Kenyan crop protection researchers, how accurate the advice is and how to reach the team.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs title="About us" image="/images/ox-plough-field.jpg" short />
      <section className="section-padding-100-70">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-12 col-lg-7">
              <div className="section-heading">
                <h2>Our mission</h2>
                <p>Give every smallholder in East Africa a field officer in their pocket.</p>
              </div>
              <p>
                A maize plant with streak virus looks sick today and is useless in three weeks. A tomato plot with
                blight can be gone in seven days. Most farmers in Kenya lose that race because the answer arrives after
                the damage, when the extension officer reaches the village or when there is enough airtime to search.
              </p>
              <p>
                Gideon Crops exists to close that gap. We put a short, honest decision tool on the phone the farmer
                already owns. It does not promise a laboratory result. It asks the farmer what they can see, matches
                those observations against a database built for East African conditions, and gives a small number of
                practical next steps in the language the farmer thinks in.
              </p>
              <p className="mb-0">
                The tool is free for farmers. Extension officers get accounts so they can save scan reports, attach a
                GPS location and follow a farm over a season. That record is what turns a single scan into better
                decisions.
              </p>
            </div>

            <div className="col-12 col-lg-4">
              <div className="gc-scan-aside mb-30">
                <h5>By the numbers</h5>
                <ul>
                  <li>
                    <Leaf size={17} aria-hidden="true" />
                    <span>{TOTAL_CONDITIONS} conditions in the local database</span>
                  </li>
                  <li>
                    <BookOpenCheck size={17} aria-hidden="true" />
                    <span>8 crops covered, from maize to cassava</span>
                  </li>
                  <li>
                    <MapPin size={17} aria-hidden="true" />
                    <span>Built for Kenya and East Africa</span>
                  </li>
                  <li>
                    <Handshake size={17} aria-hidden="true" />
                    <span>Free for farmers, no login needed to scan</span>
                  </li>
                </ul>
              </div>
              <div className="gc-alert gc-alert-info mb-0">
                <strong>No cloud AI.</strong> There is no external image recognition service in this product. The
                matcher is a rule engine that runs in your browser.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray section-padding-100-70">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="section-heading">
                <h2>How the symptom database was built</h2>
                <p>A small, deliberate dataset, reviewed by people who work in Kenyan fields.</p>
              </div>

              <ol className="gc-prose" style={{ listStyle: "decimal", paddingLeft: 20 }}>
                <li style={{ marginBottom: 16 }}>
                  <strong style={{ color: "#303030" }}>Field interviews.</strong> We sat with farmers in Kakamega,
                  Nyandarua, Kitui, Kisumu and Kilifi and recorded how they describe what they see. That is why the
                  checklist says &ldquo;white powder&rdquo; and &ldquo;holes in leaves&rdquo; rather than Latin names.
                </li>
                <li style={{ marginBottom: 16 }}>
                  <strong style={{ color: "#303030" }}>Research desk review.</strong> In this build the dataset was
                  prepared with the fictional East Africa Crop Diagnostics Working Group, a fictional collaboration
                  used to illustrate how the database would be compiled with Kenyan crop protection researchers,
                  county extension officers and plant health students. Each condition was written against KALRO and
                  county extension guidance for the crops listed.
                </li>
                <li style={{ marginBottom: 16 }}>
                  <strong style={{ color: "#303030" }}>Bilingual drafting.</strong> Every entry was written twice, in
                  English and in Kiswahili, by people who speak both. Nothing is machine translated at runtime.
                </li>
                <li style={{ marginBottom: 0 }}>
                  <strong style={{ color: "#303030" }}>Field testing.</strong> Officers tested the checklist on 40
                  farms and flagged the entries that caused confusion. Those symptom labels were rewritten.
                </li>
              </ol>

              <div className="gc-panel mt-30" style={{ padding: 26 }}>
                <div className="d-flex align-items-start mb-15" style={{ gap: 12 }}>
                  <AlertTriangle size={22} color="#b9770e" aria-hidden="true" style={{ flex: "0 0 auto", marginTop: 2 }} />
                  <div>
                    <h5 style={{ fontSize: 18, marginBottom: 8 }}>Data accuracy disclaimer</h5>
                    <p style={{ fontSize: 15, marginBottom: 10 }}>
                      Gideon Crops is a decision aid, not a diagnosis. Many conditions look alike: nutrient deficiency,
                      drought stress and root disease can all turn a leaf yellow. The matcher returns the most likely
                      explanations from the symptoms you report, and it cannot see what you do not tick.
                    </p>
                    <p style={{ fontSize: 15, marginBottom: 0 }}>
                      Always confirm before you spend money on a chemical. Read the product label, respect the waiting
                      period before harvest, and speak to your county extension officer for anything that spreads
                      quickly or affects more than a small patch.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="gc-crop-card mb-30">
                <div className="gc-crop-thumb" style={{ backgroundImage: "url(/images/cassava-harvest.jpg)", height: 220 }} />
                <div className="gc-crop-body">
                  <h5 style={{ fontSize: 18 }}>Where we work</h5>
                  <p>
                    Kenya and East Africa. Support is in English and Kiswahili, with field visits arranged through
                    county extension partners.
                  </p>
                </div>
              </div>
              <div className="gc-scan-aside">
                <h5>Contact</h5>
                <ul>
                  <li>
                    <Mail size={17} aria-hidden="true" />
                    <a href={`mailto:${SITE.email}`} style={{ color: "#303030", fontSize: 15 }}>
                      {SITE.email}
                    </a>
                  </li>
                  <li>
                    <i className="fa fa-whatsapp" aria-hidden="true" style={{ color: "#70c745", marginTop: 2 }} />
                    <a href={whatsappLink(WHATSAPP_MESSAGES.general)} style={{ color: "#303030", fontSize: 15 }}>
                      {SITE.phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <MapPin size={17} aria-hidden="true" />
                    <span>Nairobi, Kenya</span>
                  </li>
                </ul>
                <Link href="/contact" className="btn alazea-btn mt-15">
                  Send a message
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
