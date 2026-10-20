import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, ScanLine, Sprout } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CROPS, getCrop } from "@/lib/crops";
import { conditionsForCrop, localized, SEVERITY_LABELS, TYPE_LABELS, type ConditionEntry } from "@/lib/symptoms";
import { localiseKey } from "@/lib/labels";

type CropPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CROPS.map((crop) => ({ slug: crop.slug }));
}

export async function generateMetadata({ params }: CropPageProps): Promise<Metadata> {
  const { slug } = await params;
  const crop = getCrop(slug);
  if (!crop) return { title: "Crop not found" };
  const conditions = conditionsForCrop(crop.name);
  return {
    title: `${crop.name} diseases, pests and deficiencies`,
    description: `${conditions.length} detectable ${crop.name.toLowerCase()} conditions with symptoms and treatment advice for Kenyan farms. ${crop.blurb}`,
    alternates: { canonical: `/crops/${crop.slug}` },
    openGraph: {
      title: `${crop.name} guide | Gideon Crops`,
      description: crop.blurb,
      images: [{ url: crop.image }],
    },
  };
}

function ConditionRow({ entry }: { entry: ConditionEntry }) {
  return (
    <div className="gc-condition-row">
      <div className="d-flex flex-wrap align-items-center" style={{ gap: 8, marginBottom: 6 }}>
        <span className={`gc-badge gc-type-${entry.type}`}>{TYPE_LABELS[entry.type].en}</span>
        <span className={`gc-badge gc-sev-${entry.severity}`}>{SEVERITY_LABELS[entry.severity].en}</span>
        <span className="gc-badge gc-badge-outline">{entry.conditionName.sw}</span>
      </div>
      <h5>{entry.conditionName.en}</h5>
      <div className="gc-symptom-tags">
        {entry.visualSymptoms.map((symptom) => (
          <span className="gc-symptom-tag" key={symptom}>
            {localiseKey(symptom, "en")}
          </span>
        ))}
      </div>
      <p style={{ fontSize: 15, marginBottom: 6 }}>
        <strong style={{ color: "#303030" }}>Treatment: </strong>
        {localized(entry.treatmentAdvice, "en")}
      </p>
      <p style={{ fontSize: 15, marginBottom: 0 }}>
        <strong style={{ color: "#303030" }}>Prevention: </strong>
        {localized(entry.preventionTip, "en")}
      </p>
    </div>
  );
}

export default async function CropDetailPage({ params }: CropPageProps) {
  const { slug } = await params;
  const crop = getCrop(slug);
  if (!crop) notFound();

  const conditions = conditionsForCrop(crop.name);
  const grouped = {
    disease: conditions.filter((entry) => entry.type === "disease"),
    pest: conditions.filter((entry) => entry.type === "pest"),
    deficiency: conditions.filter((entry) => entry.type === "deficiency"),
  };

  return (
    <>
      <Breadcrumbs
        title={crop.name}
        trail={[{ href: "/crops", label: "Crop library" }]}
        image={crop.image}
        short
      />

      <section className="section-padding-100-70">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-12 col-lg-7">
              <div className="section-heading">
                <h2>
                  {crop.name} <span style={{ color: "#b7b7b7", fontSize: 22 }}>({crop.swahiliName})</span>
                </h2>
                <p>{crop.blurb}</p>
              </div>

              <div className="row mb-30">
                <div className="col-12 col-md-6 mb-20">
                  <div className="d-flex" style={{ gap: 12 }}>
                    <CalendarDays size={20} color="#70c745" aria-hidden="true" style={{ flex: "0 0 auto", marginTop: 3 }} />
                    <div>
                      <h6 style={{ fontSize: 15, textTransform: "uppercase", marginBottom: 8 }}>Growing season in Kenya</h6>
                      <ul>
                        {crop.seasons.map((season) => (
                          <li key={season} style={{ fontSize: 15, color: "#707070", lineHeight: 1.7, marginBottom: 6 }}>
                            {season}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-20">
                  <div className="d-flex" style={{ gap: 12 }}>
                    <MapPin size={20} color="#70c745" aria-hidden="true" style={{ flex: "0 0 auto", marginTop: 3 }} />
                    <div>
                      <h6 style={{ fontSize: 15, textTransform: "uppercase", marginBottom: 8 }}>Common regions</h6>
                      <ul>
                        {crop.regions.map((region) => (
                          <li key={region} style={{ fontSize: 15, color: "#707070", lineHeight: 1.7, marginBottom: 6 }}>
                            {region}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gc-panel mb-30" style={{ padding: 26 }}>
                <div className="d-flex align-items-center mb-15" style={{ gap: 10 }}>
                  <Sprout size={22} color="#70c745" aria-hidden="true" />
                  <h5 style={{ marginBottom: 0, fontSize: 18 }}>Growing {crop.name.toLowerCase()} in Kenya</h5>
                </div>
                <ul className="gc-prose">
                  {crop.growingTips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-30">
                <h4 style={{ fontSize: 22, textTransform: "uppercase", marginBottom: 6 }}>
                  {conditions.length} detectable conditions
                </h4>
                <p style={{ fontSize: 15 }}>
                  Listed by type. Each one matches the symptom checklist in the scanner, so ticking the same symptoms
                  will return the same diagnosis on your phone.
                </p>

                {(["disease", "pest", "deficiency"] as const).map((type) =>
                  grouped[type].length > 0 ? (
                    <div key={type} className="mt-30">
                      <h5 style={{ fontSize: 17, textTransform: "uppercase", marginBottom: 4 }}>
                        {TYPE_LABELS[type].en === "Pest" ? "Pests" : `${TYPE_LABELS[type].en}s`}
                      </h5>
                      <div className="gc-conditions-list">
                        {grouped[type].map((entry) => (
                          <ConditionRow entry={entry} key={entry.id} />
                        ))}
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="gc-crop-card mb-30">
                <div className="gc-crop-thumb" style={{ backgroundImage: `url(${crop.image})`, height: 220 }} />
                <div className="gc-crop-body">
                  <h5 style={{ fontSize: 18 }}>Scan this crop</h5>
                  <p>Open the scanner with {crop.name.toLowerCase()} already selected, then tick what you see.</p>
                  <Link href={`/scan?crop=${crop.slug}`} className="btn alazea-btn mt-15 d-inline-flex align-items-center" style={{ gap: 8 }}>
                    <ScanLine size={16} aria-hidden="true" /> Scan this crop
                  </Link>
                </div>
              </div>

              <div className="gc-scan-aside mb-30">
                <h5>Other crops</h5>
                <ul>
                  {CROPS.filter((item) => item.slug !== crop.slug).map((item) => (
                    <li key={item.slug}>
                      <Sprout size={16} color="#70c745" aria-hidden="true" />
                      <Link href={`/crops/${item.slug}`} style={{ color: "#303030", fontSize: 15 }}>
                        {item.name} ({item.swahiliName})
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="gc-alert gc-alert-info mb-0">
                Advice is written for a Kenyan smallholder farm. Always confirm a chemical rate on the product label
                and with your local extension officer before spraying.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
