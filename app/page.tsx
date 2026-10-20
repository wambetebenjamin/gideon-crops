import Link from "next/link";
import type { Metadata } from "next";
import {
  Camera,
  CloudOff,
  Gauge,
  Languages,
  Leaf,
  ListChecks,
  MessageSquareQuote,
  ShieldCheck,
  Sprout,
  WifiOff,
} from "lucide-react";
import CropGrid from "@/components/home/CropGrid";
import Reveal from "@/components/Reveal";
import { cropSummaries } from "@/lib/crops";
import { TOTAL_CONDITIONS } from "@/lib/symptoms";
import { SITE, whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gideon Crops | Scan your crop. Know the problem. Act fast.",
  description:
    "Scan a crop leaf with your phone and get a diagnosis and treatment advice in seconds, in English or Kiswahili. Free, offline ready and built for farmers in Kenya and East Africa.",
  alternates: { canonical: "/" },
};

const STEPS = [
  {
    title: "Open the scanner",
    body: "Tap Scan a Crop Now. No sign up, no login and no data bundle needed once the page is saved on your phone.",
    icon: Camera,
  },
  {
    title: "Point at the affected leaf",
    body: "Use the rear camera, fill the guide frame with the damaged part of the leaf and capture it. The photo never leaves your device.",
    icon: Leaf,
  },
  {
    title: "Read the diagnosis and advice",
    body: "Tick the symptoms you can see, choose your crop and get the most likely cause with treatment and prevention advice in seconds.",
    icon: ListChecks,
  },
];

const WHY = [
  {
    title: "Works without internet",
    body: "The scanner, the checklist and the symptom database are saved on your phone. It keeps working in a field with no signal.",
    icon: CloudOff,
  },
  {
    title: "No login for a basic scan",
    body: "A farmer can scan immediately. Accounts are only needed by extension officers who save reports.",
    icon: ShieldCheck,
  },
  {
    title: "Results in under 3 seconds",
    body: "The matcher is a small local rule engine, so answers come back while you are still standing next to the plant.",
    icon: Gauge,
  },
  {
    title: "Written for Kenyan farms",
    body: "Advice uses the products, seasons and planting practices smallholders in Kenya and East Africa actually work with.",
    icon: Sprout,
  },
  {
    title: "English and Kiswahili",
    body: "Every diagnosis, treatment note and prevention tip is written in both languages, not machine translated.",
    icon: Languages,
  },
  {
    title: "Your photos stay yours",
    body: "No photo is uploaded, no cloud AI is called and no leaf image is stored. Only the ticks you choose are used.",
    icon: WifiOff,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I used to wait for the extension officer to pass by. Now I scan the leaf myself in the shamba and I know whether to spray or to wait. Last season I caught the maize rust early.",
    name: "Wanjiku Mwangi",
    role: "Maize and beans farmer, Murang'a",
    image: "/images/farmer-portrait-field.jpg",
  },
  {
    quote:
      "The Kiswahili advice is what made me trust it. I read it to my mother and she understood the treatment the first time. Our sukuma wiki is clean again.",
    name: "Grace Achieng",
    role: "Vegetable grower, Kisumu",
    image: "/images/farmer-portrait-maize.jpg",
  },
  {
    quote:
      "I run demonstrations for sixty farmers. Saving the scan reports with GPS has changed how I follow up on farms, I can see which plot is getting worse.",
    name: "Peter Kilonzo",
    role: "Extension officer, Makueni",
    image: "/images/farmer-portrait-man.jpg",
  },
];

export default function HomePage() {
  const crops = cropSummaries();

  return (
    <>
      {/* Hero, reproduced from the template hero block */}
      <section className="hero-area">
        <div className="hero-post-slides">
          <div className="single-hero-post bg-overlay">
            <div
              className="slide-img bg-img"
              style={{ backgroundImage: "url(/images/extension-officer-with-farmer.jpg)" }}
              role="img"
              aria-label="Two East African farmers inspecting a young crop plant in a field"
            />
            <div className="container h-100">
              <div className="row h-100 align-items-center">
                <div className="col-12">
                  <div className="hero-slides-content text-center">
                    <span
                      className="d-inline-block mb-15"
                      style={{
                        color: "#70c745",
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      Crop disease detection for Kenya and East Africa
                    </span>
                    <h1>Scan your crop. Know the problem. Act fast.</h1>
                    <p>
                      Point your phone at the affected leaf, tick what you see and get a diagnosis with treatment
                      advice in seconds. No login for a basic scan, no cloud AI and no data bundle needed once the
                      page is saved.
                    </p>
                    <div className="welcome-btn-group">
                      <Link href="/scan" className="btn alazea-btn mr-30">
                        Scan a crop now
                      </Link>
                      <Link href="#how-it-works" className="btn alazea-btn active">
                        Learn how it works
                      </Link>
                    </div>
                    <p className="mt-30 mb-0" style={{ fontSize: 15, color: "rgba(255,255,255,0.85)" }}>
                      {TOTAL_CONDITIONS} detectable conditions across {crops.length} crops. Works offline as a PWA.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported crops */}
      <section className="alazea-portfolio-area section-padding-100-70 bg-gray" id="supported-crops">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-heading text-center">
                <h2>Supported crops</h2>
                <p>
                  {TOTAL_CONDITIONS} plant conditions in the local database, covering the crops most Kenyan
                  smallholders grow.
                </p>
              </div>
            </div>
          </div>
          <CropGrid crops={crops} />
          <div className="row">
            <div className="col-12 text-center">
              <Link href="/crops" className="btn alazea-btn">
                Browse the crop library
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="our-services-area section-padding-100-0" id="how-it-works">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-heading text-center">
                <h2>How it works</h2>
                <p>Three steps, one phone, no account needed.</p>
              </div>
            </div>
          </div>
          <div className="row">
            {STEPS.map((step, index) => (
              <div className="col-12 col-md-4 mb-30" key={step.title}>
                <Reveal delay={index * 0.08}>
                  <div className="gc-step">
                    <div className="gc-step-number">{index + 1}</div>
                    <step.icon size={26} color="#70c745" aria-hidden="true" className="mb-15" />
                    <h5>{step.title}</h5>
                    <p>{step.body}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Gideon Crops */}
      <section className="about-us-area section-padding-100-0">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-12 col-lg-5">
              <div className="section-heading">
                <h2>Why Gideon Crops</h2>
                <p>Built for the field, not the showroom.</p>
              </div>
              <p>
                Most crop trouble is spotted too late because the farmer waits for a visit or an internet connection.
                Gideon Crops puts the checklist in your hand. The photo is captured on your phone, the symptoms are
                matched against a database that lives on your phone, and the advice comes back in seconds. Nothing is
                uploaded and nothing is guessed by a cloud model.
              </p>
              <p className="mb-0">
                The database was assembled with Kenyan crop protection researchers and reviewed against KALRO and
                county extension guidance. It is a decision aid, not a laboratory test.
              </p>
              <div className="mt-30">
                <Link href="/about" className="btn alazea-btn">
                  About the database
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="alazea-benefits-area">
                <div className="row">
                  {WHY.map((item, index) => (
                    <div className="col-12 col-sm-6" key={item.title}>
                      <Reveal delay={(index % 2) * 0.08}>
                        <div className="single-benefits-area">
                          <div className="gc-benefit-icon">
                            <item.icon size={26} aria-hidden="true" />
                          </div>
                          <h5>{item.title}</h5>
                          <p>{item.body}</p>
                        </div>
                      </Reveal>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="border-line" />
            </div>
          </div>
        </div>
      </section>

      {/* Count band */}
      <section className="subscribe-newsletter-area" style={{ backgroundImage: "url(/img/bg-img/subscribe.png)" }}>
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-12 col-lg-6">
              <div className="section-heading mb-0">
                <h2>{TOTAL_CONDITIONS} detectable conditions</h2>
                <p>
                  Diseases, pest damage and nutrient deficiencies, each with bilingual advice written for a Kenyan
                  smallholder farm.
                </p>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="subscribe-form">
                <div className="d-flex flex-wrap" style={{ gap: 12 }}>
                  <Link href="/scan" className="btn alazea-btn">
                    Scan a crop now
                  </Link>
                  <a
                    href={whatsappLink(WHATSAPP_MESSAGES.general)}
                    className="btn alazea-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonial-area section-padding-100">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-heading text-center">
                <h2>From the farms</h2>
                <p>Three farmers and officers using Gideon Crops in the field.</p>
              </div>
            </div>
          </div>
          <div className="row">
            {TESTIMONIALS.map((item, index) => (
              <div className="col-12 col-lg-4 mb-30" key={item.name}>
                <Reveal delay={index * 0.08}>
                  <figure className="gc-testimonial mb-0">
                    <MessageSquareQuote size={26} color="#70c745" aria-hidden="true" className="mb-15" />
                    <blockquote className="gc-quote mb-0">
                      <p style={{ fontStyle: "italic", marginBottom: 0 }}>&ldquo;{item.quote}&rdquo;</p>
                    </blockquote>
                    <figcaption className="gc-author">
                      <img src={item.image} alt="" width={60} height={60} loading="lazy" />
                      <div>
                        <h6>{item.name}</h6>
                        <p>{item.role}</p>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extension officer CTA */}
      <section className="section-padding-0-100">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Reveal>
                <div className="gc-cta-band">
                  <div className="row align-items-center">
                    <div className="col-12 col-lg-8">
                      <h3>Are you an agricultural extension officer?</h3>
                      <p>
                        Create an account to save scan reports and track farm health over time. Farmer accounts stay
                        read only, officer access is verified before it is switched on.
                      </p>
                    </div>
                    <div className="col-12 col-lg-4 text-lg-right mt-30 mt-lg-0">
                      <Link href="/auth/signup" className="btn alazea-btn">
                        Create an officer account
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
