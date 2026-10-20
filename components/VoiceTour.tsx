"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const SCRIPT =
  "Habari, welcome to Gideon Crops. This tool helps Kenyan farmers identify crop diseases, pest damage, and nutrient problems using just their phone camera. Point your camera at the affected leaf, select what you see, and get a diagnosis and treatment advice in seconds. It works without internet, in English or Swahili, and it is completely free to use. Take care of your crops today.";

export default function VoiceTour() {
  const [speaking, setSpeaking] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const triggeredRef = useRef(false);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(SCRIPT);
    utterance.rate = 0.93;
    utterance.pitch = 1.08;
    utterance.lang = "en-KE";

    const kenyanVoice =
      window.speechSynthesis.getVoices().find((voice) => /en[-_]KE/i.test(voice.lang)) ||
      window.speechSynthesis.getVoices().find((voice) => /sw[-_]KE/i.test(voice.lang));
    if (kenyanVoice) utterance.voice = kenyanVoice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setHasPlayed(true);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setHasPlayed(true);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  // The tour never autoplays. The first scroll or click starts it once.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    const trigger = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      speak();
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("click", trigger);
      window.removeEventListener("keydown", trigger);
    };

    window.addEventListener("scroll", trigger, { passive: true, once: true });
    window.addEventListener("click", trigger, { once: true });
    window.addEventListener("keydown", trigger, { once: true });

    return () => {
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("click", trigger);
      window.removeEventListener("keydown", trigger);
      window.speechSynthesis.cancel();
    };
  }, [speak]);

  const toggle = () => {
    triggeredRef.current = true;
    if (speaking) {
      stop();
    } else {
      speak();
    }
  };

  const label = speaking ? "Site voice tour, click to mute" : hasPlayed ? "Replay site voice tour" : "Site voice tour, click to listen";

  return (
    <button
      type="button"
      className={`gc-float-btn gc-voice-btn${speaking ? " gc-speaking" : ""}`}
      onClick={toggle}
      aria-label={label}
      title={speaking ? "Mute the site voice tour" : hasPlayed ? "Replay tour" : "Hear what this site is about"}
      aria-pressed={speaking}
      data-tour-state={speaking ? "speaking" : hasPlayed ? "replay" : "idle"}
    >
      {speaking ? <Volume2 size={24} aria-hidden="true" /> : <VolumeX size={24} aria-hidden="true" />}
      <span className="gc-tooltip" role="tooltip">
        {!supported ? "Voice not supported in this browser" : speaking ? "Mute tour" : hasPlayed ? "Replay tour" : "Hear what this site is about"}
      </span>
      <span className="sr-only">{speaking ? "Mute the site voice tour" : hasPlayed ? "Replay tour" : "Hear what this site is about"}</span>
    </button>
  );
}
