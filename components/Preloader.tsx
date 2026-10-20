"use client";

import { useEffect, useRef, useState } from "react";

const MAX_DURATION = 3000;
const SKIP_AFTER = 1000;
const STORAGE_KEY = "gideon_preloader_shown";

/**
 * Loading screen reproduced from the uploaded template: the light grey
 * preloader background, the rotating green ring and the leaf mark in the
 * centre. A percentage counter sits under the leaf and the screen clears
 * after three seconds at the latest.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const startRef = useRef<number>(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);

    let alreadyShown = false;
    try {
      alreadyShown = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      alreadyShown = false;
    }

    if (alreadyShown) {
      setProgress(100);
      return;
    }

    setVisible(true);
    startRef.current = performance.now();

    const skipTimer = window.setTimeout(() => setCanSkip(true), SKIP_AFTER);
    const doneTimer = window.setTimeout(() => finish(), MAX_DURATION);

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const next = Math.min(100, Math.round((elapsed / MAX_DURATION) * 100));
      setProgress(next);
      if (next < 100) {
        frameRef.current = window.requestAnimationFrame(tick);
      }
    };
    frameRef.current = window.requestAnimationFrame(tick);

    function finish() {
      setProgress(100);
      setVisible(false);
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* storage can be blocked in private mode, the screen still closes */
      }
    }

    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(doneTimer);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="gc-preloader preloader d-flex align-items-center justify-content-center" role="status" aria-live="polite">
      <div className="preloader-circle" aria-hidden="true" />
      <div className="preloader-img text-center">
        <img src="/img/core-img/leaf.png" alt="" width={45} height={45} />
        <span className="gc-preloader-count">{progress}%</span>
      </div>
      <span className="gc-preloader-label">Preparing your crops tool</span>
      {canSkip ? (
        <button
          type="button"
          className="gc-skip"
          onClick={() => {
            setProgress(100);
            setVisible(false);
            try {
              window.sessionStorage.setItem(STORAGE_KEY, "1");
            } catch {
              /* ignore */
            }
          }}
        >
          Skip
        </button>
      ) : null}
      {reducedMotion ? (
        <span className="gc-preloader-plain">{progress} percent loaded</span>
      ) : null}
    </div>
  );
}
