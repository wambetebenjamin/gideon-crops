"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/scan", label: "Scan a Crop" },
  { href: "/crops", label: "Crops" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="header-area">
      <div className="top-header-area">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="top-header-content d-flex align-items-center justify-content-between">
                <div className="top-header-meta">
                  <a href={`mailto:${SITE.email}`} title={SITE.email}>
                    <i className="fa fa-envelope-o" aria-hidden="true" /> <span>Email: {SITE.email}</span>
                  </a>
                  <a href={`tel:+${SITE.whatsapp}`} title={SITE.phoneDisplay}>
                    <i className="fa fa-whatsapp" aria-hidden="true" /> <span>WhatsApp: {SITE.phoneDisplay}</span>
                  </a>
                </div>
                <div className="top-header-meta d-flex align-items-center">
                  <div className="gc-lang-note mr-30">
                    <span>English and Kiswahili</span>
                  </div>
                  <div className="login">
                    <Link href="/auth/signin">
                      <i className="fa fa-user" aria-hidden="true" /> <span>Extension officer sign in</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="alazea-main-menu">
        <div className={stuck ? "gc-menu-fixed" : ""}>
          <div className="classy-nav-container breakpoint-off">
            <div className="container">
              <nav className="classy-navbar justify-content-between" id="alazeaNav" aria-label="Main menu">
                <Link href="/" className="nav-brand gc-brand" aria-label="Gideon Crops home">
                  <img src="/img/core-img/leaf.png" alt="" width={34} height={34} />
                  <span>Gideon Crops</span>
                </Link>

                <button
                  type="button"
                  className="gc-menu-toggle"
                  aria-expanded={open}
                  aria-controls="gc-primary-nav"
                  aria-label={open ? "Close menu" : "Open menu"}
                  onClick={() => setOpen((value) => !value)}
                >
                  {open ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className="classy-menu">
                  <div className={`classynav${open ? " gc-open" : ""}`} id="gc-primary-nav">
                    <ul>
                      {NAV.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} className={isActive(item.href) ? "gc-active" : undefined}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href="/my-reports" className={isActive("/my-reports") ? "gc-active" : undefined}>
                          My Reports
                        </Link>
                      </li>
                    </ul>
                    <Link href="/scan" className="gc-signin-link">
                      Scan now
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
