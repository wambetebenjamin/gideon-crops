"use client";

import { useState } from "react";
import { CONSENT_STORAGE_KEY } from "@/lib/site";

/**
 * Clears the stored choice so the consent banner appears again with the
 * preference modal open. The banner owns the actual preference UI.
 */
export default function CookiePreferencesButton() {
  const [cleared, setCleared] = useState(false);

  const reopen = () => {
    try {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
      /* storage blocked, nothing to clear */
    }
    setCleared(true);
    window.setTimeout(() => window.location.reload(), 250);
  };

  return (
    <div className="d-flex flex-wrap align-items-center mt-20" style={{ gap: 12 }}>
      <button type="button" className="btn alazea-btn" onClick={reopen}>
        Open cookie preferences
      </button>
      <span className="gc-form-note mb-0">
        {cleared ? "Preference cleared, reloading the banner." : "This clears your saved choice and asks you again."}
      </span>
    </div>
  );
}
