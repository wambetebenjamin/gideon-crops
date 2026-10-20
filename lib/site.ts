export const SITE = {
  name: "Gideon Crops",
  tagline: "Scan your crop. Know the problem. Act fast.",
  description:
    "Gideon Crops helps farmers in Kenya and East Africa identify crop diseases, pest damage and nutrient problems with a phone camera. Detection runs on the device, works offline and needs no login for a basic scan.",
  serviceArea: "Kenya and East Africa",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gideon-crops.vercel.app",
  email: "hello@gideoncrops.co.ke",
  phoneDisplay: "+254 112 272 061",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254112272061",
} as const;

export const WHATSAPP_MESSAGES = {
  general:
    "Hello Gideon Crops, I would like to learn more about the crop disease detector for my farm.",
  diagnosis:
    "Hello Gideon Crops, I scanned my crop and would like help understanding the diagnosis.",
  support: "Hello Gideon Crops, I need help with my Gideon Crops account.",
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const CONSENT_STORAGE_KEY = "gideon_crops_consent";

export const SUPPORTED_CROPS = [
  "Maize",
  "Tomato",
  "Potato",
  "Beans",
  "Kale",
  "Cassava",
  "Banana",
  "Wheat",
] as const;

export type SupportedCrop = (typeof SUPPORTED_CROPS)[number];

export const SYMPTOM_OPTIONS = [
  { key: "yellowing", en: "Yellowing", sw: "Kunyauka kwa rangi ya njano" },
  { key: "brown-spots", en: "Brown spots", sw: "Madoa ya kahawia" },
  { key: "wilting", en: "Wilting", sw: "Kunyunyuka" },
  { key: "holes-in-leaves", en: "Holes in leaves", sw: "Matundu kwenye majani" },
  { key: "white-powder", en: "White powder", sw: "Unga mweupe" },
  { key: "black-spots", en: "Black spots", sw: "Madoa meusi" },
  { key: "curling-leaves", en: "Curling leaves", sw: "Majani yanayojikunja" },
  { key: "mosaic-pattern", en: "Mosaic pattern", sw: "Michirizi ya mosaic" },
  { key: "rotting-stem", en: "Rotting stem", sw: "Shina linalooza" },
  { key: "pale-colour", en: "Pale colour", sw: "Rangi iliyofifia" },
  { key: "unusual-growth", en: "Unusual growth", sw: "Ukuaji usio wa kawaida" },
  { key: "insect-presence", en: "Insects present", sw: "Wadudu wapo" },
] as const;

export type SymptomKey = (typeof SYMPTOM_OPTIONS)[number]["key"];
