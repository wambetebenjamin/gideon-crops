"use client";

import { motion } from "framer-motion";
import type { Language } from "@/lib/symptoms";

type LanguageToggleProps = {
  language: Language;
  onChange: (language: Language) => void;
  label?: string;
};

export default function LanguageToggle({ language, onChange, label }: LanguageToggleProps) {
  return (
    <div className="d-flex align-items-center" style={{ gap: 12 }}>
      {label ? <span className="gc-label mb-0">{label}</span> : null}
      <div className="gc-lang-toggle" role="group" aria-label="Diagnosis language">
        {(["en", "sw"] as Language[]).map((option) => {
          const active = language === option;
          return (
            <button
              key={option}
              type="button"
              className={active ? "gc-lang-active" : undefined}
              aria-pressed={active}
              onClick={() => onChange(option)}
            >
              {active ? (
                <motion.span
                  layoutId="gc-lang-pill"
                  className="gc-lang-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              ) : null}
              <span>{option === "en" ? "EN" : "SW"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
