import { SYMPTOM_OPTIONS } from "@/lib/site";
import type { Language } from "@/lib/symptoms";

export function localiseKey(key: string, language: Language): string {
  const option = SYMPTOM_OPTIONS.find((item) => item.key === key);
  if (!option) return key.replace(/-/g, " ");
  return language === "sw" ? option.sw : option.en;
}

export function localiseKeys(keys: string[], language: Language): string[] {
  return keys.map((key) => localiseKey(key, language));
}
