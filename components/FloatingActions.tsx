import { SITE, whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site";

export default function WhatsAppButton() {
  return (
    <a
      className="gc-float-btn gc-wa-btn"
      href={whatsappLink(WHATSAPP_MESSAGES.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with Gideon Crops on WhatsApp at ${SITE.phoneDisplay}`}
    >
      <i className="fa fa-whatsapp" aria-hidden="true" style={{ fontSize: 26 }} />
      <span className="gc-tooltip" role="tooltip">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}
