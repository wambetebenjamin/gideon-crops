import Link from "next/link";
import { SITE, whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";

const CURRENT_YEAR = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="footer-area bg-img" style={{ backgroundImage: "url(/img/bg-img/3.jpg)" }}>
      <div className="main-footer-area">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="single-footer-widget">
                <div className="footer-logo mb-30">
                  <Link href="/" className="gc-brand gc-brand-footer">
                    <img src="/img/core-img/leaf.png" alt="" width={32} height={32} />
                    <span>Gideon Crops</span>
                  </Link>
                </div>
                <p>
                  Scan your crop. Know the problem. Act fast. A free crop disease detector for smallholder farms in
                  Kenya and East Africa, built to work offline.
                </p>
                <div className="social-info">
                  <a href={whatsappLink(WHATSAPP_MESSAGES.general)} aria-label="Chat with Gideon Crops on WhatsApp">
                    <i className="fa fa-whatsapp" aria-hidden="true" />
                  </a>
                  <a href={`mailto:${SITE.email}`} aria-label="Email Gideon Crops">
                    <i className="fa fa-envelope-o" aria-hidden="true" />
                  </a>
                  <a href={`tel:+${SITE.whatsapp}`} aria-label="Call Gideon Crops">
                    <i className="fa fa-phone" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="single-footer-widget">
                <div className="widget-title">
                  <h5>The tool</h5>
                </div>
                <nav className="widget-nav" aria-label="Tool links">
                  <ul>
                    <li>
                      <Link href="/scan">Scan a crop</Link>
                    </li>
                    <li>
                      <Link href="/crops">Crop library</Link>
                    </li>
                    <li>
                      <Link href="/crops/maize">Maize</Link>
                    </li>
                    <li>
                      <Link href="/crops/tomato">Tomato</Link>
                    </li>
                    <li>
                      <Link href="/my-reports">My reports</Link>
                    </li>
                    <li>
                      <Link href="/about">About the tool</Link>
                    </li>
                    <li>
                      <Link href="/contact">Contact</Link>
                    </li>
                    <li>
                      <Link href="/auth/signup">Officer account</Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="single-footer-widget">
                <div className="widget-title">
                  <h5>Legal</h5>
                </div>
                <nav className="widget-nav" aria-label="Legal links">
                  <ul>
                    <li>
                      <Link href="/legal/privacy-policy">Privacy policy</Link>
                    </li>
                    <li>
                      <Link href="/legal/terms">Terms of use</Link>
                    </li>
                    <li>
                      <Link href="/legal/cookie-policy">Cookie policy</Link>
                    </li>
                    <li>
                      <Link href="/legal/privacy-policy">Data protection</Link>
                    </li>
                  </ul>
                </nav>
                <div className="mt-30">
                  <p className="mb-0" style={{ fontSize: 14 }}>
                    Built for the Kenya Data Protection Act, 2019.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="single-footer-widget">
                <div className="widget-title">
                  <h5>Contact</h5>
                </div>
                <div className="contact-information">
                  <p>
                    <span>Service area:</span> {SITE.serviceArea}
                  </p>
                  <p>
                    <span>WhatsApp:</span> {SITE.phoneDisplay}
                  </p>
                  <p>
                    <span>Email:</span> {SITE.email}
                  </p>
                  <p>
                    <span>Hours:</span> Mon to Sat, 7 AM to 7 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom-area">
          <div className="container">
            <div className="border-line" />
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="copywrite-text">
                  <p>
                    &copy; {CURRENT_YEAR} Gideon Crops. Guidance only, confirm with your extension officer before
                    applying any chemical.
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="footer-nav">
                  <ul className="d-flex justify-content-md-end">
                    <li>
                      <Link href="/legal/privacy-policy">Privacy</Link>
                    </li>
                    <li>
                      <Link href="/legal/terms">Terms</Link>
                    </li>
                    <li>
                      <Link href="/legal/cookie-policy">Cookies</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
