import { symptoms, type ConditionEntry, type Severity } from "@/lib/symptoms";

export type SymptomMatch = {
  entry: ConditionEntry;
  score: number;
  matchedSymptoms: string[];
  alternatives: string[];
};

const SEVERITY_RANK: Record<Severity, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Observed symptoms and database keywords are normalised so that
 * "Brown spots", "brown-spots" and "brown_spots" all resolve to one key.
 */
export function normaliseSymptom(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function cropMatches(entry: ConditionEntry, selectedCrop: string): boolean {
  const crop = selectedCrop.trim().toLowerCase();
  if (!crop) return false;
  return entry.affectedCrops.some((name) => {
    const affected = name.trim().toLowerCase();
    return affected === crop || affected === "general";
  });
}

/**
 * Local, rule based symptom matcher. It never calls a server or an AI model.
 * Scores each condition by counting how many of its visual symptom keywords
 * the farmer reported, filtered by affected crop, and returns the best three.
 */
export function matchSymptoms(
  selectedCrop: string,
  observedSymptoms: string[],
  limit = 3,
): SymptomMatch[] {
  if (!selectedCrop || !observedSymptoms || observedSymptoms.length === 0) {
    return [];
  }

  const observed = new Set(observedSymptoms.map(normaliseSymptom));
  const observedList = Array.from(observed);

  const scored: SymptomMatch[] = symptoms
    .filter((entry) => cropMatches(entry, selectedCrop))
    .map((entry) => {
      const keywords = entry.visualSymptoms.map(normaliseSymptom);
      const matchedSymptoms = keywords.filter((keyword) => observed.has(keyword));
      return {
        entry,
        score: matchedSymptoms.length,
        matchedSymptoms,
        alternatives: observedList.filter((item) => !matchedSymptoms.includes(item)),
      };
    })
    .filter((match) => match.score > 0);

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const severityDelta = SEVERITY_RANK[b.entry.severity] - SEVERITY_RANK[a.entry.severity];
    if (severityDelta !== 0) return severityDelta;
    return a.entry.id.localeCompare(b.entry.id);
  });

  return scored.slice(0, limit);
}

/**
 * The symptom keywords that a crop can actually produce, used to hint the
 * farmer about which boxes are worth checking for the crop they selected.
 */
export function symptomsAvailableForCrop(selectedCrop: string): string[] {
  const keys = new Set<string>();
  symptoms
    .filter((entry) => cropMatches(entry, selectedCrop))
    .forEach((entry) => entry.visualSymptoms.forEach((symptom) => keys.add(normaliseSymptom(symptom))));
  return Array.from(keys);
}
