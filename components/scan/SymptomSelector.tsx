"use client";

import { motion } from "framer-motion";
import { AlertCircle, Check } from "lucide-react";
import { CROPS } from "@/lib/crops";
import { SYMPTOM_OPTIONS } from "@/lib/site";
import type { Language } from "@/lib/symptoms";
import type { CaptureQuality } from "@/components/scan/CropScanner";

type SymptomSelectorProps = {
  crop: string;
  symptoms: string[];
  language: Language;
  quality: CaptureQuality | null;
  onCropChange: (crop: string) => void;
  onToggle: (symptom: string) => void;
  onSubmit: () => void;
};

const QUALITY_COPY: Record<CaptureQuality["verdict"], { en: string; sw: string; tone: "info" | "warn" | "good" }> = {
  good: {
    en: "The photo looks clear. Tick everything you can see on the leaf.",
    sw: "Picha inaonekana wazi. Chagua kila dalili unayoona kwenye jani.",
    tone: "good",
  },
  dark: {
    en: "That photo came out dark. Retake it in daylight if you can, the ticks still work either way.",
    sw: "Picha ilipigwa gizani. Iongeze tena mchana ikiwezekana, lakini uchaguzi utafanya kazi hata hivyo.",
    tone: "warn",
  },
  blurry: {
    en: "Most of the frame is not leaf. Move closer to the damaged part next time, then tick what you see.",
    sw: "Sehemu kubwa ya picha si jani. Sogea karibu na sehemu iliyoharibika wakati ujao, kisha chagua unachoona.",
    tone: "warn",
  },
  unknown: {
    en: "Tick everything you can see on the leaf.",
    sw: "Chagua kila dalili unayoona kwenye jani.",
    tone: "info",
  },
};

export default function SymptomSelector({
  crop,
  symptoms,
  language,
  quality,
  onCropChange,
  onToggle,
  onSubmit,
}: SymptomSelectorProps) {
  const copy = QUALITY_COPY[quality?.verdict ?? "unknown"];
  const disabled = !crop || symptoms.length === 0;
  const t = (en: string, sw: string) => (language === "sw" ? sw : en);

  return (
    <motion.div
      className="gc-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <h4 style={{ fontSize: 22, marginBottom: 8 }}>{t("Tick the symptoms you can see", "Chagua dalili unazoziona")}</h4>
      <p style={{ fontSize: 15 }} className="mb-30">
        {t(
          "Choose the crop, then tick every symptom on the leaf. The matcher only uses this local checklist, it does not guess from the photo.",
          "Chagua zao, kisha chagua kila dalili iliyo kwenye jani. Kipimo hiki kinatumia orodha hii ya ndani pekee, hakikisi kutoka kwenye picha.",
        )}
      </p>

      <div className={`gc-alert ${copy.tone === "warn" ? "gc-alert-error" : copy.tone === "good" ? "gc-alert-success" : "gc-alert-info"}`} role="status">
        <AlertCircle size={16} style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
        {copy[language]}
      </div>

      <div className="gc-field mb-30">
        <label className="gc-label" htmlFor="gc-crop-select">
          {t("Which crop is it", "Ni zao gani")}
        </label>
        <select
          id="gc-crop-select"
          className="form-control"
          value={crop}
          onChange={(event) => onCropChange(event.target.value)}
        >
          <option value="">{t("Select your crop", "Chagua zao lako")}</option>
          {CROPS.map((item) => (
            <option key={item.slug} value={item.name}>
              {item.name} {language === "sw" ? `(${item.swahiliName})` : ""}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="mb-30">
        <legend className="gc-label">{t("What do you see on the plant", "Unaona nini kwenye mmea")}</legend>
        <div className="gc-symptom-grid">
          {SYMPTOM_OPTIONS.map((option) => {
            const checked = symptoms.includes(option.key);
            return (
              <motion.label
                key={option.key}
                className={`gc-symptom-check${checked ? " gc-checked" : ""}`}
                whileTap={{ scale: 0.96 }}
                animate={checked ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(option.key)}
                  value={option.key}
                />
                <span>{language === "sw" ? option.sw : option.en}</span>
                {checked ? <Check size={16} color="#70c745" style={{ marginLeft: "auto" }} aria-hidden="true" /> : null}
              </motion.label>
            );
          })}
        </div>
      </fieldset>

      <div className="d-flex flex-wrap align-items-center" style={{ gap: 14 }}>
        <motion.button
          type="button"
          className="btn alazea-btn"
          onClick={onSubmit}
          disabled={disabled}
          whileTap={{ scale: 0.97 }}
          style={disabled ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
        >
          {t("Submit symptoms", "Wasilisha dalili")}
        </motion.button>
        <span className="gc-camera-status">
          {symptoms.length === 0
            ? t("Tick at least one symptom", "Chagua dalili moja angalau")
            : t(`${symptoms.length} symptom${symptoms.length === 1 ? "" : "s"} selected`, `Dalili ${symptoms.length} zimechaguliwa`)}
        </span>
      </div>
    </motion.div>
  );
}
