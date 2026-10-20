"use client";

import { create } from "zustand";
import type { Language } from "@/lib/symptoms";

type ScanState = {
  crop: string;
  symptoms: string[];
  language: Language;
  setCrop: (crop: string) => void;
  toggleSymptom: (symptom: string) => void;
  clearSymptoms: () => void;
  setLanguage: (language: Language) => void;
  reset: () => void;
};

export const useScanStore = create<ScanState>((set) => ({
  crop: "",
  symptoms: [],
  language: "en",
  setCrop: (crop) => set({ crop }),
  toggleSymptom: (symptom) =>
    set((state) => ({
      symptoms: state.symptoms.includes(symptom)
        ? state.symptoms.filter((item) => item !== symptom)
        : [...state.symptoms, symptom],
    })),
  clearSymptoms: () => set({ symptoms: [] }),
  setLanguage: (language) => set({ language }),
  reset: () => set({ symptoms: [] }),
}));
