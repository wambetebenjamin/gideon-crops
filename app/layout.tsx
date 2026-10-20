import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Providers from "./providers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Preloader from "@/components/Preloader";
import CookieConsent from "@/components/CookieConsent";
import VoiceTour from "@/components/VoiceTour";
import WhatsAppButton from "@/components/FloatingActions";
import OfflineBanner from "@/components/OfflineBanner";
import SmoothScroll from "@/components/SmoothScroll";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Gideon Crops | Scan your crop. Know the problem. Act fast.",
    template: "%s | Gideon Crops",
  },
  description: SITE.description,
  applicationName: "Gideon Crops",
  manifest: "/manifest.webmanifest",
  keywords: [
    "crop disease detector Kenya",
    "maize disease",
    "tomato blight",
    "plant disease scanner",
    "offline farming app",
    "sukuma wiki disease",
    "East Africa agriculture",
  ],
  authors: [{ name: "Gideon Crops" }],
  openGraph: {
    title: "Gideon Crops | Scan your crop. Know the problem. Act fast.",
    description: SITE.description,
    url: SITE.url,
    siteName: "Gideon Crops",
    locale: "en_KE",
    type: "website",
    images: [{ url: "/images/extension-officer-with-farmer.jpg", width: 1125, height: 750, alt: "Two farmers inspecting a young plant in a field" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gideon Crops",
    description: SITE.description,
    images: ["/images/extension-officer-with-farmer.jpg"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
    apple: [{ url: "/icons/icon-192.png" }],
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#70c745",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="gc-skip-link">
          Skip to content
        </a>
        <Providers>
          <Preloader />
          <OfflineBanner />
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <VoiceTour />
          <WhatsAppButton />
          <CookieConsent />
          <SmoothScroll />
          <ServiceWorkerRegister />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
