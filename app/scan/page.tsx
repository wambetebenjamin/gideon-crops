import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Lock, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScanExperience from "@/components/scan/ScanExperience";
import { TOTAL_CONDITIONS } from "@/lib/symptoms";
import { SITE, whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";
import { CROPS } from "@/lib/crops";

export const metadata: Metadata = {
  title: "Scan a crop",
  description:
    "Open the Gideon Crops scanner, point your phone at the affected leaf, tick the symptoms you see and read a diagnosis with treatment advice in English or Kiswahili. No login needed.",
  alternates: { canonical: "/scan" },
};

type ScanPageProps = {
  searchParams: Promise<{ crop?: string }>;
};

export default async function ScanPage({ searchParams }: ScanPageProps) {
  const params = await searchParams;
  const requestedCrop = params.crop;
  const requested = requestedCrop ? CROPS.find((crop) => crop.slug === requestedCrop.toLowerCase()) : undefined;

  return (
    <>
      <Breadcrumbs title="Scan a crop" trail={[]} image="/images/crop-maize.jpg" short />
      <section className="section-padding-100-70">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-heading">
                <h2>Leaf scanner</h2>
                <p>
                  Nothing is uploaded. Your camera stays on your device and the match runs against {TOTAL_CONDITIONS}{" "}
                  conditions stored in the app.
                </p>
              </div>
            </div>
          </div>

          <ScanExperience initialCrop={requested?.name ?? ""} />

          <div className="row mt-30">
            <div className="col-12 col-lg-4 mb-30">
              <div className="gc-scan-aside h-100">
                <h5>Before you scan</h5>
                <ul>
                  <li>
                    <CheckCircle2 size={17} aria-hidden="true" />
                    <span>Scan in daylight, or use a torch, so the spots and colours show clearly.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={17} aria-hidden="true" />
                    <span>Photograph one leaf at a time and fill the frame with the damaged part.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={17} aria-hidden="true" />
                    <span>
                      Look at both sides of the leaf, and at the stem, before you tick the symptoms.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={17} aria-hidden="true" />
                    <span>If you are unsure, send the result to us on WhatsApp and we will look with you.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-12 col-lg-4 mb-30">
              <div className="gc-scan-aside h-100">
                <h5>Privacy at a glance</h5>
                <ul>
                  <li>
                    <Lock size={17} aria-hidden="true" />
                    <span>The photo is drawn to a canvas on your phone and never sent to a server.</span>
                  </li>
                  <li>
                    <ShieldCheck size={17} aria-hidden="true" />
                    <span>No external AI API, no cloud model and no image storage, by design.</span>
                  </li>
                  <li>
                    <Phone size={17} aria-hidden="true" />
                    <span>GPS is only requested if an officer chooses to save a report, and only with consent.</span>
                  </li>
                </ul>
                <p className="gc-form-note mb-0">
                  Read the <Link href="/legal/privacy-policy" style={{ color: "#70c745" }}>privacy policy</Link>.
                </p>
              </div>
            </div>

            <div className="col-12 col-lg-4 mb-30">
              <div className="gc-scan-aside h-100">
                <h5>Need a human</h5>
                <p className="mb-20" style={{ fontSize: 15 }}>
                  Some problems need an officer to walk the field. Send a photo of the leaf on WhatsApp and we will
                  reply during working hours.
                </p>
                <a
                  className="gc-wa-escalate"
                  href={whatsappLink(WHATSAPP_MESSAGES.diagnosis)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={18} aria-hidden="true" /> WhatsApp {SITE.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
