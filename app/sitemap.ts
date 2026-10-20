import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { CROPS } from "@/lib/crops";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/scan",
    "/crops",
    "/about",
    "/contact",
    "/my-reports",
    "/auth/signin",
    "/auth/signup",
    "/legal/privacy-policy",
    "/legal/terms",
    "/legal/cookie-policy",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE.url}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/scan" ? 0.9 : 0.6,
    })),
    ...CROPS.map((crop) => ({
      url: `${SITE.url}/crops/${crop.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
