"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Info, Leaf, MessageCircle, ShieldCheck } from "lucide-react";
import {
  localized,
  SEVERITY_LABELS,
  TYPE_LABELS,
  type ConditionEntry,
  type Language,
} from "@/lib/symptoms";
import type { SymptomMatch } from "@/lib/symptomMatcher";
import LanguageToggle from "@/components/scan/LanguageToggle";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";

type ResultsPanelProps = {
  matches: SymptomMatch[];
  crop: string;
  language: Language;
  onLanguageChange: (language: Language) => void;
  symptomLabels: string[];
  children?: React.ReactNode;
};

function TypeBadge({ type, language }: { type: ConditionEntry["type"]; language: Language }) {
  return <span className={`gc-badge gc-type-${type}`}>{localized(TYPE_LABELS[type], language)}</span>;
}

function SeverityBadge({ severity, language }: { severity: ConditionEntry["severity"]; language: Language }) {
  return <span className={`gc-badge gc-sev-${severity} gc-badge-live`}>{localized(SEVERITY_LABELS[severity], language)}</span>;
}

function DiagnosisBody({ entry, language }: { entry: ConditionEntry; language: Language }) {
  return (
    <>
      <h6>{language === "sw" ? "Matibabu" : "Treatment advice"}</h6>
      <p>{localized(entry.treatmentAdvice, language)}</p>
      <h6>{language === "sw" ? "Kuzuia" : "Prevention tip"}</h6>
      <p>{localized(entry.preventionTip, language)}</p>
    </>
  );
}

export default function ResultsPanel({
  matches,
  crop,
  language,
  onLanguageChange,
  symptomLabels,
  children,
}: ResultsPanelProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const primary = matches[0];
  const others = matches.slice(1);

  if (!primary) {
    return (
      <motion.div className="gc-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h4 style={{ fontSize: 22, marginBottom: 10 }}>No match yet</h4>
        <p className="mb-20">
          None of the conditions in the local database scored on those symptoms for {crop || "this crop"}. Recheck the
          leaf in good light, add another symptom, or send a photo to our team on WhatsApp.
        </p>
        <a
          className="gc-wa-escalate"
          href={whatsappLink(WHATSAPP_MESSAGES.diagnosis)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} aria-hidden="true" /> Not sure? Ask on WhatsApp
        </a>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-20" style={{ gap: 12 }}>
        <h4 style={{ fontSize: 22, marginBottom: 0 }}>Diagnosis</h4>
        <LanguageToggle language={language} onChange={onLanguageChange} label="Language" />
      </div>

      <motion.div
        className="gc-result-card"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <div className="d-flex flex-wrap align-items-center mb-15" style={{ gap: 8 }}>
          <TypeBadge type={primary.entry.type} language={language} />
          <SeverityBadge severity={primary.entry.severity} language={language} />
          <span className="gc-badge gc-badge-outline">{crop}</span>
          <span className="gc-badge gc-badge-outline">
            {language === "sw" ? "Matching" : "Match"} {primary.score}/{primary.entry.visualSymptoms.length}
          </span>
        </div>

        <h4>
          <Leaf size={22} style={{ marginRight: 10, verticalAlign: "-2px", color: "#70c745" }} aria-hidden="true" />
          {localized(primary.entry.conditionName, language)}
        </h4>

        {language === "sw" ? (
          <p className="gc-form-note mb-0">{primary.entry.conditionName.en}</p>
        ) : (
          <p className="gc-form-note mb-0">{primary.entry.conditionName.sw}</p>
        )}

        <div className="gc-advice-block">
          <h6>{language === "sw" ? "Matibabu" : "Treatment advice"}</h6>
          <p>{localized(primary.entry.treatmentAdvice, language)}</p>
        </div>

        <div className="gc-advice-block" style={{ marginTop: 12 }}>
          <h6>{language === "sw" ? "Kuzuia" : "Prevention tip"}</h6>
          <p>{localized(primary.entry.preventionTip, language)}</p>
        </div>

        <div className="mt-30">
          <h6 style={{ fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
            {language === "sw" ? "Dalili zilizotumika" : "Symptoms matched"}
          </h6>
          <div className="gc-symptom-tags">
            {primary.matchedSymptoms.map((symptom) => (
              <span className="gc-symptom-tag" key={symptom} style={{ backgroundColor: "rgba(112,199,69,0.12)", color: "#35671f" }}>
                {symptom.replace(/-/g, " ")}
              </span>
            ))}
          </div>
          <p className="gc-form-note mb-0">
            <ShieldCheck size={15} style={{ marginRight: 6, verticalAlign: "-3px", color: "#70c745" }} aria-hidden="true" />
            {language === "sw"
              ? "Matokeo haya yametokana na hifadhidata ya ndani kwenye simu yako, hakuna picha iliyotumwa mtandaoni."
              : "This result came from the local database on your phone. No photo was sent anywhere."}
          </p>
        </div>

        {symptomLabels.length > 0 ? (
          <p className="gc-form-note mt-15 mb-0">
            {language === "sw" ? "Ulizochagua" : "You ticked"}: {symptomLabels.join(", ")}
          </p>
        ) : null}
      </motion.div>

      {children ? <div className="mt-30">{children}</div> : null}

      {others.length > 0 ? (
        <div className="mt-30">
          <h5 style={{ fontSize: 17, textTransform: "uppercase", marginBottom: 14 }}>
            {language === "sw" ? "Uwezekano mwingine" : "Other possible matches"}
          </h5>
          {others.map((match) => {
            const open = openId === match.entry.id;
            return (
              <div className="gc-accordion-item" key={match.entry.id}>
                <button
                  type="button"
                  className="gc-accordion-trigger"
                  aria-expanded={open}
                  aria-controls={`gc-acc-${match.entry.id}`}
                  onClick={() => setOpenId(open ? null : match.entry.id)}
                >
                  <span className="d-flex align-items-center flex-wrap" style={{ gap: 10 }}>
                    {localized(match.entry.conditionName, language)}
                    <span className={`gc-badge gc-sev-${match.entry.severity}`} style={{ fontSize: 10, padding: "3px 8px" }}>
                      {localized(SEVERITY_LABELS[match.entry.severity], language)}
                    </span>
                  </span>
                  {open ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
                </button>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      id={`gc-acc-${match.entry.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="gc-accordion-body">
                        <div className="d-flex flex-wrap mb-10" style={{ gap: 8 }}>
                          <TypeBadge type={match.entry.type} language={language} />
                          <span className="gc-badge gc-badge-outline">
                            {language === "sw" ? "Matching" : "Match"} {match.score}/{match.entry.visualSymptoms.length}
                          </span>
                        </div>
                        <DiagnosisBody entry={match.entry} language={language} />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="mt-30 d-flex flex-wrap align-items-center" style={{ gap: 14 }}>
        <a
          className="gc-wa-escalate"
          href={whatsappLink(WHATSAPP_MESSAGES.diagnosis)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} aria-hidden="true" />
          {language === "sw" ? "Hujui? Uliza kwa WhatsApp" : "Not sure? Ask on WhatsApp"}
        </a>
        <span className="gc-form-note">
          <Info size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} aria-hidden="true" />
          {language === "sw"
            ? "Ushauri huu ni mwongozo tu. Thibitisha kiwango cha dawa na afisa ugani."
            : "Guidance only. Confirm any chemical rate with your extension officer."}
        </span>
      </div>
    </div>
  );
}
