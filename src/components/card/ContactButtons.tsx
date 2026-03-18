import { Phone, MessageCircle, Mail, Globe, MapPin, Download } from "lucide-react";

export default function ContactButtons({ business, theme }: { business: any; theme: any }) {
  const buttons = [];

  if (business.phone) {
    buttons.push({
      icon: <Phone className="w-6 h-6" />,
      label: "Call",
      href: `tel:${business.phone}`,
    });
  }

  if (business.whatsapp) {
    buttons.push({
      icon: <MessageCircle className="w-6 h-6" />,
      label: "WhatsApp",
      href: `https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(business.businessName)}`,
    });
  }

  if (business.email) {
    buttons.push({
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      href: `mailto:${business.email}`,
    });
  }

  if (business.website) {
    let url = business.website;
    if (!url.startsWith('http')) url = `https://${url}`;
    buttons.push({
      icon: <Globe className="w-6 h-6" />,
      label: "Website",
      href: url,
    });
  }

  if (business.googleMapsUrl) {
    buttons.push({
      icon: <MapPin className="w-6 h-6" />,
      label: "Map",
      href: business.googleMapsUrl,
    });
  }

  buttons.push({
    icon: <Download className="w-6 h-6" />,
    label: "Save",
    href: `/api/vcard/${business.slug}`,
    download: true,
  });

  return (
    <div className="flex overflow-x-auto gap-4 py-2 hide-scrollbar snap-x snap-mandatory px-2">
      {buttons.map((btn, idx) => (
        <a
          key={idx}
          href={btn.href}
          target={btn.label !== "Call" && btn.label !== "Save" ? "_blank" : undefined}
          rel="noreferrer"
          className="flex-shrink-0 flex flex-col items-center justify-center w-[72px] snap-start"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-sm transition-transform active:scale-95 ${theme.accentBg}`}>
            {btn.icon}
          </div>
          <span className={`text-xs font-semibold ${theme.typography.heading}`}>
            {btn.label}
          </span>
        </a>
      ))}
    </div>
  );
}
