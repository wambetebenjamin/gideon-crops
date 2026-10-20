"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const update = () => {
      setOffline(!navigator.onLine);
      setChecked(true);
    };
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!checked) return null;

  return (
    <AnimatePresence>
      {offline ? (
        <motion.div
          className="gc-offline-banner"
          role="status"
          aria-live="polite"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <WifiOff size={18} aria-hidden="true" />
          <span>Offline mode active. Scanning and the symptom database still work, reports need a connection.</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
