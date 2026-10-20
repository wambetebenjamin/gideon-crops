"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONSENT_STORAGE_KEY } from "@/lib/site";

type Preferences = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: number;
};

const DEFAULT_PREFERENCES: Preferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  updatedAt: "",
  version: 1,
};

const CATEGORIES: {
  key: "functional" | "analytics" | "marketing";
  title: string;
  description: string;
}[] = [
  {
    key: "functional",
    title: "Functional",
    description:
      "Remembers your language choice and the last crop you scanned so the tool opens where you left it. No advertising data.",
  },
  {
    key: "analytics",
    title: "Analytics",
    description:
      "Anonymous page counts that show us which crops farmers look up most. We never collect leaf photos or farm coordinates.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description:
      "Off by default. Would allow campaign measurement if Gideon Crops ever runs farmer outreach advertising.",
  },
];

function readConsent(): Preferences | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Preferences;
    if (!parsed || parsed.version !== 1) return null;
    return { ...DEFAULT_PREFERENCES, ...parsed, necessary: true };
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<Preferences | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<Preferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setDraft(stored ?? DEFAULT_PREFERENCES);
    setReady(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-open-gc", modalOpen);
    return () => document.body.classList.remove("modal-open-gc");
  }, [modalOpen]);

  const persist = useCallback((next: Preferences) => {
    const value = { ...next, necessary: true as const, updatedAt: new Date().toISOString(), version: 1 };
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* storage blocked, the banner simply returns next visit */
    }
    setConsent(value);
    setDraft(value);
    setModalOpen(false);
  }, []);

  if (!ready) return null;

  const showBanner = !consent;

  return (
    <>
      <AnimatePresence>
        {showBanner ? (
          <motion.div
            className="gc-cookie-banner"
            role="region"
            aria-label="Cookie consent"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
          >
            <div className="container">
              <div className="row align-items-center">
                <div className="col-12 col-lg-7">
                  <p>
                    We use a few cookies and local storage to keep your language choice, remember your last scan and
                    count visits. No photos ever leave your phone. Read our{" "}
                    <Link href="/legal/cookie-policy">cookie policy</Link> and{" "}
                    <Link href="/legal/privacy-policy">privacy policy</Link>.
                  </p>
                </div>
                <div className="col-12 col-lg-5">
                  <div className="gc-cookie-actions justify-content-lg-end mt-15 mt-lg-0">
                    <button type="button" className="btn alazea-btn" onClick={() => persist({ ...draft, functional: true, analytics: true, marketing: true })}>
                      Accept all
                    </button>
                    <button type="button" className="btn alazea-btn gc-manage-btn" onClick={() => setModalOpen(true)}>
                      Manage preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen ? (
          <motion.div
            className="gc-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setModalOpen(false);
            }}
          >
            <motion.div
              className="gc-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gc-cookie-modal-title"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h4 id="gc-cookie-modal-title">Cookie preferences</h4>
              <p className="gc-form-note mb-30">
                Choose what Gideon Crops may store on this device. Necessary storage keeps the tool working and cannot
                be switched off. You can change this any time from the cookie policy page.
              </p>

              <div className="gc-pref-row">
                <div>
                  <h6>Necessary</h6>
                  <p>Security, session and offline caching for the scanner. Always on.</p>
                </div>
                <button type="button" className="gc-switch gc-on" disabled aria-label="Necessary storage is always on">
                  <span />
                </button>
              </div>

              {CATEGORIES.map((category) => (
                <div className="gc-pref-row" key={category.key}>
                  <div>
                    <h6>{category.title}</h6>
                    <p>{category.description}</p>
                  </div>
                  <button
                    type="button"
                    className={`gc-switch${draft[category.key] ? " gc-on" : ""}`}
                    role="switch"
                    aria-checked={draft[category.key]}
                    aria-label={`${category.title} storage`}
                    onClick={() => setDraft({ ...draft, [category.key]: !draft[category.key] })}
                  >
                    <span />
                  </button>
                </div>
              ))}

              <div className="d-flex flex-wrap mt-30" style={{ gap: 12 }}>
                <button type="button" className="btn alazea-btn" onClick={() => persist(draft)}>
                  Save choices
                </button>
                <button
                  type="button"
                  className="btn alazea-btn gc-manage-btn"
                  onClick={() => persist({ ...draft, functional: false, analytics: false, marketing: false })}
                >
                  Necessary only
                </button>
                <button type="button" className="btn alazea-btn gc-manage-btn ml-auto" onClick={() => setModalOpen(false)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
