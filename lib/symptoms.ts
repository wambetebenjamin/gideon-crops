import rawSymptoms from "@/data/symptoms.json";
import { SUPPORTED_CROPS, type SymptomKey } from "@/lib/site";

export type Language = "en" | "sw";

export type LocalizedText = {
  en: string;
  sw: string;
};

export type ConditionType = "disease" | "pest" | "deficiency";
export type Severity = "low" | "medium" | "high";

export type ConditionEntry = {
  id: string;
  cropName: string;
  conditionName: LocalizedText;
  type: ConditionType;
  visualSymptoms: string[];
  severity: Severity;
  treatmentAdvice: LocalizedText;
  preventionTip: LocalizedText;
  affectedCrops: string[];
};

export const symptoms = rawSymptoms as ConditionEntry[];

export const TOTAL_CONDITIONS = symptoms.length;

export function conditionSlug(entry: ConditionEntry): string {
  return entry.id;
}

export function conditionsForCrop(crop: string): ConditionEntry[] {
  return symptoms.filter((entry) =>
    entry.affectedCrops.some((name) => name.toLowerCase() === crop.toLowerCase()),
  );
}

export function conditionCountForCrop(crop: string): number {
  return conditionsForCrop(crop).length;
}

export function getCondition(id: string): ConditionEntry | undefined {
  return symptoms.find((entry) => entry.id === id);
}

export function isSupportedCrop(name: string): boolean {
  return SUPPORTED_CROPS.some((crop) => crop.toLowerCase() === name.toLowerCase());
}

export function localized(text: LocalizedText, language: Language): string {
  return text[language] || text.en;
}

export const TYPE_LABELS: Record<ConditionType, LocalizedText> = {
  disease: { en: "Disease", sw: "Ugonjwa" },
  pest: { en: "Pest", sw: "Wadudu" },
  deficiency: { en: "Deficiency", sw: "Upungufu" },
};

export const SEVERITY_LABELS: Record<Severity, LocalizedText> = {
  low: { en: "Low severity", sw: "Kiwango cha chini" },
  medium: { en: "Medium severity", sw: "Kiwango cha kati" },
  high: { en: "High severity", sw: "Kiwango cha juu" },
};

export type { SymptomKey };
