import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cropSummaries } from "@/lib/crops";
import { TOTAL_CONDITIONS } from "@/lib/symptoms";

export const metadata: Metadata = {
  title: "Crop library",
  description:
    "Browse the crops Gideon Crops supports, see how many conditions it can detect on each one and open a full guide with symptoms, treatment and Kenyan growing tips.",
  alternates: { canonical: "/crops" },
};

export default function CropsPage() {
  const crops = cropSummaries();

  return (
    <>
      <Breadcrumbs title="Crop library" image="/images/crop-beans.jpg" short />
      <section className="section-padding-100-70">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="section-heading">
                <h2>Eight crops, {TOTAL_CONDITIONS} conditions</h2>
                <p>
                  Each guide lists every condition the local database can match for that crop, the symptoms that point
                  to it and the treatment advice a smallholder can act on the same day.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            {crops.map((crop) => (
              <div className="col-12 col-sm-6 col-lg-3 mb-30" key={crop.slug}>
                <article className="gc-crop-card">
                  <Link href={`/crops/${crop.slug}`}>
                    <div className="gc-crop-thumb" style={{ backgroundImage: `url(${crop.image})` }}>
                      <span className="gc-crop-count">{crop.conditionCount} conditions</span>
                    </div>
                    <div className="gc-crop-body">
                      <h5>{crop.name}</h5>
                      <p>
                        {crop.swahiliName}. {crop.blurb}
                      </p>
                      <span className="gc-crop-link">
                        Open guide <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </article>
              </div>
            ))}
          </div>

          <div className="row mt-30">
            <div className="col-12 text-center">
              <Link href="/scan" className="btn alazea-btn">
                Scan a crop now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
