import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/forms/ContactForm";
import { SITE, whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Gideon Crops on WhatsApp, email or the form. Ask about a diagnosis, request a farm visit or apply for a verified extension officer account.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs title="Contact" image="/images/maize-field-farmers.jpg" short />
      <section className="contact-area section-padding-100-0">
        <div className="container">
          <div className="row align-items-start justify-content-between">
            <div className="col-12 col-lg-5">
              <div className="section-heading">
                <h2>Get in touch</h2>
                <p>Send a message, or reach us on WhatsApp for a fast reply.</p>
              </div>

              <div className="contact-information mb-30">
                <p>
                  <span>
                    <i className="fa fa-whatsapp" aria-hidden="true" style={{ color: "#70c745", marginRight: 8 }} />
                    WhatsApp:
                  </span>{" "}
                  <a href={whatsappLink(WHATSAPP_MESSAGES.general)} style={{ color: "#303030", fontSize: 16 }}>
                    {SITE.phoneDisplay}
                  </a>
                </p>
                <p>
                  <span>
                    <Mail size={15} style={{ marginRight: 8, verticalAlign: "-2px", color: "#70c745" }} aria-hidden="true" />
                    Email:
                  </span>{" "}
                  <a href={`mailto:${SITE.email}`} style={{ color: "#303030", fontSize: 16 }}>
                    {SITE.email}
                  </a>
                </p>
                <p>
                  <span>
                    <Phone size={15} style={{ marginRight: 8, verticalAlign: "-2px", color: "#70c745" }} aria-hidden="true" />
                    Call:
                  </span>{" "}
                  <a href={`tel:+${SITE.whatsapp}`} style={{ color: "#303030", fontSize: 16 }}>
                    {SITE.phoneDisplay}
                  </a>
                </p>
                <p>
                  <span>
                    <MapPin size={15} style={{ marginRight: 8, verticalAlign: "-2px", color: "#70c745" }} aria-hidden="true" />
                    Service area:
                  </span>{" "}
                  {SITE.serviceArea}
                </p>
                <p>
                  <span>
                    <Clock size={15} style={{ marginRight: 8, verticalAlign: "-2px", color: "#70c745" }} aria-hidden="true" />
                    Hours:
                  </span>{" "}
                  Monday to Saturday, 7 AM to 7 PM
                </p>
              </div>

              <div className="gc-scan-aside mb-100">
                <h5>Extension officers</h5>
                <p style={{ fontSize: 15 }}>
                  Use the officer tab in the form to request an account. You will need to give the county or
                  organisation you serve so the request can be verified. Until then your account stays a farmer
                  account and the scanner still works without login.
                </p>
                <a
                  className="gc-wa-escalate"
                  href={whatsappLink(WHATSAPP_MESSAGES.support)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={18} aria-hidden="true" /> Ask on WhatsApp
                </a>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="mb-100">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
