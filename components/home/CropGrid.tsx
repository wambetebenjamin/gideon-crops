"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CropSummary } from "@/lib/crops";

export default function CropGrid({ crops }: { crops: CropSummary[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="row">
      {crops.map((crop, index) => (
        <div className="col-12 col-sm-6 col-lg-3 mb-30" key={crop.slug}>
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 28 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: (index % 4) * 0.08, ease: "easeOut" }}
            style={{ height: "100%" }}
          >
            <article className="gc-crop-card">
              <Link href={`/crops/${crop.slug}`} aria-label={`${crop.name}, ${crop.conditionCount} detectable conditions`}>
                <div className="gc-crop-thumb" style={{ backgroundImage: `url(${crop.image})` }}>
                  <span className="gc-crop-count">
                    {crop.conditionCount} condition{crop.conditionCount === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="gc-crop-body">
                  <h5>{crop.name}</h5>
                  <p>
                    {crop.swahiliName}. {crop.conditionCount} conditions in the local database, with treatment advice
                    for Kenyan farms.
                  </p>
                  <span className="gc-crop-link">
                    Open crop guide <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </article>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
