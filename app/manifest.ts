import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gideon Crops, crop disease detector",
    short_name: "Gideon Crops",
    description:
      "Scan your crop, know the problem, act fast. A free offline crop disease detector for farmers in Kenya and East Africa.",
    start_url: "/scan",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#70c745",
    lang: "en-KE",
    categories: ["agriculture", "productivity", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    shortcuts: [
      { name: "Scan a crop", short_name: "Scan", url: "/scan", description: "Open the leaf scanner" },
      { name: "Crop library", short_name: "Crops", url: "/crops", description: "Browse detectable conditions by crop" },
    ],
  };
}
