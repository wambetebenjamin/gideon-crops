"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, MapPin, Save, X } from "lucide-react";
import type { ConditionEntry, Language } from "@/lib/symptoms";
import { localized } from "@/lib/symptoms";

type SaveReportPanelProps = {
  crop: string;
  symptoms: string[];
  symptomLabels: string[];
  entry: ConditionEntry;
  language: Language;
};

type Coordinates = { latitude: number; longitude: number };

export default function SaveReportPanel({ crop, symptoms, symptomLabels, entry, language }: SaveReportPanelProps) {
  const { data: session, status } = useSession();
  const [asking, setAsking] = useState(false);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const officer = session?.user?.role === "officer";

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <div className="gc-alert gc-alert-info">
        <strong>{language === "sw" ? "Unataka kuhifadhi ripoti?" : "Want to keep this report?"}</strong>{" "}
        {language === "sw"
          ? "Ingia kama afisa ugani ili kuhifadhi ripoti za uchunguzi na kufuatilia afya ya shamba kwa muda."
          : "Sign in as an extension officer to save scan reports and track farm health over time."}{" "}
        <Link href="/auth/signin" style={{ color: "#70c745", fontWeight: 600 }}>
          {language === "sw" ? "Ingia" : "Sign in"}
        </Link>
      </div>
    );
  }

  if (!officer) {
    return (
      <div className="gc-alert gc-alert-info">
        {language === "sw"
          ? "Akaunti yako ni ya mkulima. Afisa ugani aliyeidhinishwa anaweza kuhifadhi ripoti. Omba uboreshaji kupitia ukurasa wa mawasiliano."
          : "Your account is a farmer account. Verified extension officers can save reports. Request officer access from the contact page."}{" "}
        <Link href="/contact" style={{ color: "#70c745", fontWeight: 600 }}>
          {language === "sw" ? "Omba uboreshaji" : "Request an upgrade"}
        </Link>
      </div>
    );
  }

  const persist = async (coordinates: Coordinates | null) => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/reports/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          symptoms,
          symptomLabels,
          diagnosisId: entry.id,
          language,
          coordinates,
          notes,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; report?: { id: string }; error?: string };
      if (!response.ok || !data.ok || !data.report) {
        throw new Error(data.error || "The report could not be saved.");
      }
      setSavedId(data.report.id);
      setAsking(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The report could not be saved.");
    } finally {
      setSaving(false);
      setLocating(false);
    }
  };

  const requestLocation = () => {
    setLocating(true);
    setError(null);
    if (!("geolocation" in navigator)) {
      void persist(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void persist({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        // The farmer said no, or the fix failed. The report still saves.
        void persist(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  if (savedId) {
    return (
      <div className="gc-alert gc-alert-success d-flex flex-wrap align-items-center" style={{ gap: 12 }}>
        <CheckCircle2 size={18} aria-hidden="true" />
        <span>{language === "sw" ? "Ripoti imehifadhiwa." : "Report saved to your account."}</span>
        <Link href="/my-reports" style={{ color: "#35671f", fontWeight: 600 }}>
          {language === "sw" ? "Tazama ripoti zangu" : "View my reports"}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center" style={{ gap: 12 }}>
        <button type="button" className="btn alazea-btn d-inline-flex align-items-center" onClick={() => setAsking(true)} style={{ gap: 8 }}>
          <Save size={16} aria-hidden="true" /> {language === "sw" ? "Hifadhi ripoti" : "Save report"}
        </button>
        <span className="gc-form-note">
          {language === "sw"
            ? "Ripoti huhifadhiwa kwenye akaunti yako pekee."
            : "Reports are stored on your officer account only."}
        </span>
      </div>

      {error ? (
        <div className="gc-alert gc-alert-error mt-15" role="alert">
          {error}
        </div>
      ) : null}

      <AnimatePresence>
        {asking ? (
          <motion.div
            className="gc-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setAsking(false);
            }}
          >
            <motion.div
              className="gc-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gc-save-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <div className="d-flex justify-content-between align-items-start mb-15">
                <h4 id="gc-save-title" style={{ marginBottom: 0 }}>
                  Save this scan
                </h4>
                <button type="button" onClick={() => setAsking(false)} aria-label="Close" style={{ background: "none", border: 0, color: "#707070" }}>
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: 15 }}>
                {localized(entry.conditionName, language)} on {crop}. We will save the crop, the symptoms you ticked,
                the diagnosis and today&apos;s date to your account.
              </p>

              <div className="gc-field mb-30">
                <label className="gc-label" htmlFor="gc-report-notes">
                  Field notes (optional)
                </label>
                <textarea
                  id="gc-report-notes"
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Farm name, plot number, what you advised"
                  style={{ border: "1px solid #e1e1e1", borderRadius: 2, padding: "10px 16px", width: "100%", fontSize: 16 }}
                />
              </div>

              <div className="gc-alert gc-alert-info">
                <MapPin size={16} style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
                Do you want to attach the GPS location of this scan? Coordinates help you map outbreaks, and they are
                only stored with this report. You can say no and the report still saves.
              </div>

              <div className="d-flex flex-wrap mt-20" style={{ gap: 12 }}>
                <button type="button" className="btn alazea-btn d-inline-flex align-items-center" onClick={requestLocation} disabled={saving || locating} style={{ gap: 8 }}>
                  {saving || locating ? <Loader2 size={16} className="gc-spin" aria-hidden="true" /> : <MapPin size={16} aria-hidden="true" />}
                  {locating || saving ? "Saving" : "Allow location and save"}
                </button>
                <button type="button" className="btn alazea-btn gc-manage-btn" onClick={() => persist(null)} disabled={saving || locating}>
                  Save without location
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
