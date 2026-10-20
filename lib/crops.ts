import { conditionCountForCrop } from "@/lib/symptoms";

export type CropInfo = {
  slug: string;
  name: string;
  swahiliName: string;
  image: string;
  blurb: string;
  seasons: string[];
  regions: string[];
  growingTips: string[];
};

export const CROPS: CropInfo[] = [
  {
    slug: "maize",
    name: "Maize",
    swahiliName: "Mahindi",
    image: "/images/crop-maize.jpg",
    blurb:
      "The country's staple cereal. Most smallholder plots in Kenya grow at least a quarter acre of maize, usually intercropped with beans.",
    seasons: [
      "Long rains: plant late March to mid April, harvest August to September",
      "Short rains: plant late October to November in medium rainfall areas, harvest February",
    ],
    regions: [
      "Trans Nzoia and Uasin Gishu",
      "Kakamega and Bungoma",
      "Nakuru and Narok",
      "Machakos and Kitui (short rains)",
      "Kisii and Nyamira",
    ],
    growingTips: [
      "Test the soil before planting and apply DAP in the planting hole, then top dress with CAN when the crop is knee high.",
      "Plant on the first reliable rains and keep 75cm between rows and 25cm between plants for good airflow.",
      "Scout for fall armyworm twice a week from germination, checking inside the funnel of each plant.",
      "Intercrop with beans to spread risk and add nitrogen to the soil.",
    ],
  },
  {
    slug: "tomato",
    name: "Tomato",
    swahiliName: "Nyanya",
    image: "/images/crop-tomato.jpg",
    blurb:
      "A high value horticultural crop grown by smallholders for local markets, hotels and processing. It rewards careful watering and scouting.",
    seasons: [
      "Open field: plant at the start of the long rains and again in September for a December harvest",
      "Greenhouse and drip irrigated plots can be planted most months where water is reliable",
    ],
    regions: [
      "Kirinyaga and Nyeri",
      "Kajiado and Narok",
      "Homa Bay and Migori",
      "Kisumu and Siaya",
      "Meru and Embu",
    ],
    growingTips: [
      "Stake or trellis the plants so leaves and fruits stay off the soil.",
      "Water at the base early in the day and keep the moisture steady to reduce fruit splitting.",
      "Rotate with maize or a cereal, never with potato or pepper, to break disease cycles.",
      "Mulch to keep moisture in and to stop soil splashing onto the lower leaves.",
    ],
  },
  {
    slug: "potato",
    name: "Potato",
    swahiliName: "Viazi mviringo",
    image: "/images/crop-potato.jpg",
    blurb:
      "A cool highland crop that matures in three to four months. Certified seed and good drainage decide the size of the harvest.",
    seasons: [
      "Long rains: plant March to April, harvest July to August",
      "Short rains: plant October, harvest January to February",
    ],
    regions: [
      "Nyandarua and Laikipia",
      "Meru and Nyeri",
      "Kiambu and Nakuru",
      "Elgeyo Marakwet and Bomet",
      "Taita Taveta (high altitude pockets)",
    ],
    growingTips: [
      "Use certified seed from a registered grower, never seed saved from the previous harvest.",
      "Earth up the ridges twice so tubers are never exposed to sunlight and greening.",
      "Plant on ridges in wet areas so late blight pressure is lower.",
      "Harvest in dry weather and cure the tubers in the shade before storage.",
    ],
  },
  {
    slug: "beans",
    name: "Beans",
    swahiliName: "Maharagwe",
    image: "/images/crop-beans.jpg",
    blurb:
      "The most common protein crop on Kenyan smallholder farms, often grown with maize. Good for the soil and good for the kitchen.",
    seasons: [
      "Long rains: plant April, harvest July",
      "Short rains: plant November, harvest January to February",
    ],
    regions: [
      "Kakamega and Vihiga",
      "Machakos and Makueni",
      "Nakuru and Narok",
      "Kisii and Nyamira",
      "Tharaka Nithi and Meru",
    ],
    growingTips: [
      "Inoculate seed with rhizobia or use seed from a plot that nodulated well last season.",
      "Keep 45cm by 15cm spacing and weed in the first three weeks so the crop is not crowded.",
      "Do not over apply nitrogen fertiliser, because it encourages soft growth and aphids.",
      "Harvest pods as they dry and dry the grain on a raised mat before storage.",
    ],
  },
  {
    slug: "kale",
    name: "Kale",
    swahiliName: "Sukuma wiki",
    image: "/images/crop-kale.jpg",
    blurb:
      "The everyday green on Kenyan plates. A small kitchen plot can produce leaves for most of the year with steady watering.",
    seasons: [
      "Plant at the start of any reliable rain, February to April and again September to November",
      "Irrigated kale can be planted all year round",
    ],
    regions: [
      "Kiambu and Murang'a",
      "Nairobi peri urban plots",
      "Nakuru and Nyandarua",
      "Kisii and Nyamira",
      "Kitui and Machakos (irrigated)",
    ],
    growingTips: [
      "Transplant strong seedlings at three to four weeks and water them in the evening.",
      "Feed with manure or compost every four to six weeks and top dress with a little CAN.",
      "Pick outer leaves from the bottom and leave the growing tip so the plant keeps producing.",
      "Keep a fine net over young beds to block moths and whiteflies.",
    ],
  },
  {
    slug: "cassava",
    name: "Cassava",
    swahiliName: "Muhogo",
    image: "/images/crop-cassava.jpg",
    blurb:
      "A drought tolerant root crop that carries many families through dry months. Clean planting sticks matter more than anything else.",
    seasons: [
      "Plant with the long rains, March to May, and harvest from nine months onwards",
      "Planting sticks can go in at the start of the short rains in western Kenya",
    ],
    regions: [
      "Kilifi and Kwale",
      "Tana River and Lamu",
      "Busia and Siaya",
      "Homa Bay and Migori",
      "Kitui and Makueni",
    ],
    growingTips: [
      "Take planting sticks only from clean mother plants, about 20cm to 25cm long with healthy buds.",
      "Plant on flat ground in dry areas and on ridges where water stands.",
      "Weed in the first three months, after that the canopy shades out most weeds.",
      "Harvest what you need and leave the rest in the ground, but do not leave roots past their prime.",
    ],
  },
  {
    slug: "banana",
    name: "Banana",
    swahiliName: "Ndizi",
    image: "/images/crop-banana.jpg",
    blurb:
      "A perennial crop that pays all year. Tissue culture planting material and clean mats are the foundation of a healthy plot.",
    seasons: [
      "Plant at the start of the long or short rains, with steady moisture through the first year",
      "A healthy mat produces a bunch roughly every nine to twelve months after planting",
    ],
    regions: [
      "Meru and Tharaka Nithi",
      "Kisii and Nyamira",
      "Kilifi and Kwale",
      "Busia and Bungoma",
      "Kisumu and Siaya",
    ],
    growingTips: [
      "Plant tissue culture suckers from a certified nursery and inspect them before planting.",
      "Remove old leaves and cut spent stems at ground level to keep weevils and sigatoka down.",
      "Keep one follower sucker per mat and cut the rest so the bunch gets enough food.",
      "Mulch around the mat and apply manure twice a year, and never let water stand at the base.",
    ],
  },
  {
    slug: "wheat",
    name: "Wheat",
    swahiliName: "Ngano",
    image: "/images/crop-wheat.jpg",
    blurb:
      "A mechanised grain crop in the highlands, and an increasingly common smallholder crop where rainfall is reliable and cool.",
    seasons: [
      "Plant at the start of the long rains, late March to April, harvest August to September",
      "In Narok and parts of the Rift Valley the crop is grown on the long rains season only",
    ],
    regions: [
      "Narok and Kajiado",
      "Uasin Gishu and Trans Nzoia",
      "Nakuru and Nyandarua",
      "Laikipia and Meru",
      "Timau and Loitokitok",
    ],
    growingTips: [
      "Use certified and treated seed, because loose smut and rust travel with the seed and the wind.",
      "Prepare a fine, level seedbed so the crop comes up evenly.",
      "Scout for rust from the tillering stage and act as soon as the first pustules appear.",
      "Harvest at the right moisture and store the grain dry and off the ground.",
    ],
  },
];

export function getCrop(slug: string): CropInfo | undefined {
  return CROPS.find((crop) => crop.slug === slug);
}

export function cropByDisplayName(name: string): CropInfo | undefined {
  return CROPS.find((crop) => crop.name.toLowerCase() === name.toLowerCase());
}

export function cropSlugFromName(name: string): string {
  return cropByDisplayName(name)?.slug ?? name.toLowerCase();
}

export type CropSummary = CropInfo & { conditionCount: number };

export function cropSummaries(): CropSummary[] {
  return CROPS.map((crop) => ({
    ...crop,
    conditionCount: conditionCountForCrop(crop.name),
  }));
}

export const CROP_NAMES = CROPS.map((crop) => crop.name);
