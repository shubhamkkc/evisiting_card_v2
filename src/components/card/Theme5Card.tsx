"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone, MessageCircle, Mail, Globe, MapPin, Download,
  Home, Info, ShoppingBag, Image as ImageIcon, Send,
  Facebook, Instagram, Linkedin, Youtube, Twitter,
  Music, Ghost, Link as LinkIcon, Star,
  X, Eye
} from "lucide-react";

// ─── Color Extraction from logo ────────────────────────────────────────────────
async function extractLogoColors(src: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const SIZE = 60;
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(getFallbackColors());
        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

        // Sample pixels and bucket by hue
        const buckets: Record<number, { r: number; g: number; b: number; count: number }> = {};
        const BUCKET_SIZE = 30;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue; // skip transparent

          // Skip near-white and near-black and near-grey
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          if (saturation < 0.3) continue; // skip greyscale
          if (max < 50) continue;         // too dark
          if (min > 200) continue;        // too bright/white

          const h = rgbToHue(r, g, b);
          const bucket = Math.floor(h / BUCKET_SIZE) * BUCKET_SIZE;
          if (!buckets[bucket]) buckets[bucket] = { r: 0, g: 0, b: 0, count: 0 };
          buckets[bucket].r += r;
          buckets[bucket].g += g;
          buckets[bucket].b += b;
          buckets[bucket].count += 1;
        }

        const sorted = Object.entries(buckets)
          .filter(([_, v]) => v.count > 10)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 6)
          .map(([_, v]) => {
            const c = v.count;
            return `rgb(${Math.round(v.r / c)},${Math.round(v.g / c)},${Math.round(v.b / c)})`;
          });

        if (sorted.length < 3) return resolve(getFallbackColors());
        // Pad to 6
        while (sorted.length < 6) sorted.push(sorted[sorted.length % sorted.length]);
        resolve(sorted);
      } catch {
        resolve(getFallbackColors());
      }
    };
    img.onerror = () => resolve(getFallbackColors());
    img.src = src;
  });
}

function rgbToHue(r: number, g: number, b: number): number {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === min) return 0;
  const d = max - min;
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return h * 360;
}

function getFallbackColors(): string[] {
  return [
    "rgb(255,0,153)",
    "rgb(0,179,65)",
    "rgb(0,140,186)",
    "rgb(21,101,192)",
    "rgb(194,24,91)",
    "rgb(106,27,154)",
  ];
}

// Make a CSS linear-gradient from the palette
function makeGrad(colors: string[], dir = "135deg") {
  return `linear-gradient(${dir}, ${colors.join(", ")})`;
}

// ─── Wave SVG ──────────────────────────────────────────────────────────────────
function WaveSection({ colors, flip = false, height = 140 }: { colors: string[]; flip?: boolean; height?: number }) {
  const grad = colors.length >= 2
    ? colors.slice(0, Math.min(colors.length, 4)).join(", ")
    : "#FF0099, #FF6600, #FFCC00, #0099FF";
  return (
    <div style={{ height, overflow: "hidden", transform: flip ? "scaleY(-1)" : "none", width: "100%" }}>
      <svg viewBox="0 0 1200 140" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
            {colors.map((c, i) => (
              <stop key={i} offset={`${(i / (colors.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>
          <linearGradient id="wg2" x1="100%" y1="0%" x2="0%" y2="0%">
            {colors.map((c, i) => (
              <stop key={i} offset={`${(i / (colors.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
        <path d="M0,60 C200,10 400,120 600,60 C800,0 1000,100 1200,50 L1200,140 L0,140 Z" fill="url(#wg1)" opacity="0.95" />
        <path d="M0,90 C150,40 350,130 550,80 C750,30 950,110 1200,70 L1200,140 L0,140 Z" fill="url(#wg2)" opacity="0.65" />
        <path d="M0,110 C100,70 300,140 500,100 C700,60 900,130 1200,100 L1200,140 L0,140 Z" fill="url(#wg1)" opacity="0.45" />
      </svg>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Theme5Card({ business, viewCount }: { business: any; viewCount: number }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>(getFallbackColors());
  const [palLoaded, setPalLoaded] = useState(false);

  // Parse data
  const socialData = business.socialLinks && typeof business.socialLinks === "string"
    ? JSON.parse(business.socialLinks) : business.socialLinks;
  const servicesData = business.services && typeof business.services === "string"
    ? JSON.parse(business.services) : business.services || [];
  const galleryData = business.gallery && typeof business.gallery === "string"
    ? JSON.parse(business.gallery) : business.gallery || [];

  // Extract colors from logo on mount
  useEffect(() => {
    if (business.logo) {
      extractLogoColors(business.logo).then((colors) => {
        setPalette(colors);
        setPalLoaded(true);
      });
    } else {
      setPalLoaded(true);
    }
  }, [business.logo]);

  // Derived convenience values
  const p = palette; // shorthand
  const gradHoriz = makeGrad(p, "90deg");
  const gradDiag = makeGrad(p, "135deg");

  // Social icon helper
  const getSocialIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case "facebook": return <Facebook className="w-5 h-5" />;
      case "instagram": return <Instagram className="w-5 h-5" />;
      case "linkedin": return <Linkedin className="w-5 h-5" />;
      case "youtube": return <Youtube className="w-5 h-5" />;
      case "twitter": return <Twitter className="w-5 h-5" />;
      case "whatsapp": return <MessageCircle className="w-5 h-5" />;
      case "telegram": return <Send className="w-5 h-5" />;
      case "tiktok": return <Music className="w-5 h-5" />;
      case "snapchat": return <Ghost className="w-5 h-5" />;
      case "website": return <Globe className="w-5 h-5" />;
      case "google": case "googlereview": case "review":
        return <Star className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  // Contact buttons
  const contactButtons: { icon: React.ReactNode; label: string; href: string }[] = [];
  if (business.phone) contactButtons.push({ icon: <Phone className="w-6 h-6" />, label: "Call", href: `tel:${business.phone}` });
  if (business.whatsapp) contactButtons.push({ icon: <MessageCircle className="w-6 h-6" />, label: "WhatsApp", href: `https://wa.me/${business.whatsapp.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(business.businessName)}` });
  if (business.email) contactButtons.push({ icon: <Mail className="w-6 h-6" />, label: "Email", href: `mailto:${business.email}` });
  if (business.website) {
    let url = business.website;
    if (!url.startsWith("http")) url = `https://${url}`;
    contactButtons.push({ icon: <Globe className="w-6 h-6" />, label: "Website", href: url });
  }
  if (business.googleMapsUrl) contactButtons.push({ icon: <MapPin className="w-6 h-6" />, label: "Map", href: business.googleMapsUrl });
  contactButtons.push({ icon: <Download className="w-6 h-6" />, label: "Save", href: `/api/vcard/${business.slug}` });

  // Social links
  const socialLinks: { platform: string; url: string }[] = Array.isArray(socialData)
    ? socialData.filter((l: any) => l.url)
    : socialData && typeof socialData === "object"
    ? Object.entries(socialData).filter(([_, v]) => v).map(([platform, url]) => ({ platform, url: url as string }))
    : [];

  const navItems = [
    { id: "t5-top", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "t5-about", label: "About", icon: <Info className="w-5 h-5" /> },
    { id: "t5-services", label: "Services", icon: <ShoppingBag className="w-5 h-5" /> },
    { id: "t5-gallery", label: "Gallery", icon: <ImageIcon className="w-5 h-5" /> },
    { id: "t5-enquiry", label: "Enquiry", icon: <Send className="w-5 h-5" /> },
  ];

  const scrollTo = (id: string) => {
    if (id === "t5-top") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap');

        @keyframes t5-palette-anim {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes t5-float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes t5-fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes t5-ring-spin {
          to { transform: rotate(360deg); }
        }

        .t5-font { font-family: 'Poppins', system-ui, sans-serif; }
        .t5-heading { font-family: 'Montserrat', 'Poppins', system-ui, sans-serif; }
        .t5-float  { animation: t5-float 3s ease-in-out infinite; }
        .t5-fadeUp { animation: t5-fadeUp 0.55s ease both; }
        .t5-lift:hover { transform: translateY(-4px) scale(1.06); transition: transform .2s ease; }
        .t5-lift { transition: transform .2s ease; }

        /* Animated gradient text */
        .t5-gtext {
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: t5-palette-anim 4s ease infinite;
        }

        /* Spinning conic ring behind logo */
        .t5-ring-wrap { position:relative; display:inline-flex; align-items:center; justify-content:center; }
        .t5-ring-wrap::before {
          content:'';
          position:absolute;
          inset:-5px;
          border-radius:50%;
          background: conic-gradient(from 0deg, var(--t5-c0), var(--t5-c1), var(--t5-c2), var(--t5-c3), var(--t5-c4), var(--t5-c5), var(--t5-c0));
          animation: t5-ring-spin 4s linear infinite;
          z-index:0;
        }
        .t5-ring-inner {
          position:relative; z-index:1;
          border-radius:50%;
          overflow:hidden;
          background:#fff;
          width:152px; height:152px;
        }
      `}</style>

      {/* Inject CSS variables for conic ring */}
      <style>{`
        :root {
          --t5-c0: ${p[0]};
          --t5-c1: ${p[1]};
          --t5-c2: ${p[2]};
          --t5-c3: ${p[3]};
          --t5-c4: ${p[4]};
          --t5-c5: ${p[5]};
        }
      `}</style>

      <div id="t5-top" className="t5-font w-full min-h-screen bg-white pb-24 overflow-x-hidden relative">

        {/* ── Views Badge ── */}
        {business.showCardViews && (
          <div className="absolute top-4 right-4 z-[60] bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
            <Eye className="w-3.5 h-3.5" />
            {viewCount} Views
          </div>
        )}

        {/* ══════════════════════════════════════════
            HEADER — Cover photo + wave overlay
        ══════════════════════════════════════════ */}
        <div className="relative w-full" style={{ height: 220 }}>
          {/* Cover photo / fallback */}
          <div className="absolute inset-0 overflow-hidden">
            {business.coverPhoto ? (
              <img
                src={business.coverPhoto}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div style={{ background: gradDiag, width: "100%", height: "100%" }} />
            )}
          </div>

          {/* Dark overlay so wave sits nicely */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Palette-colored wave at the bottom of header */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 90, zIndex: 10 }}>
            <WaveSection colors={p} height={90} />
          </div>

          {/* Small floating logo (top-right corner) */}
          {business.logo && (
            <div className="absolute top-5 right-16 z-20 t5-float">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-2xl border-2 border-white/90">
                <img src={business.logo} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            LOGO CIRCLE — overlapping the wave
        ══════════════════════════════════════════ */}
        <div className="flex justify-center" style={{ marginTop: -80, position: "relative", zIndex: 20 }}>
          <div className="t5-ring-wrap" style={{ width: 162, height: 162 }}>
            <div className="t5-ring-inner">
              {business.logo ? (
                <img src={business.logo} alt={business.businessName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: gradDiag }}>
                  <span className="t5-heading font-black text-5xl text-white">{business.businessName.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            BUSINESS NAME + TAGS
        ══════════════════════════════════════════ */}
        <div className="text-center px-4 mt-4 t5-fadeUp">
          <h1
            className="t5-heading font-black text-4xl leading-tight t5-gtext"
            style={{ backgroundImage: makeGrad(p, "90deg") }}
          >
            {business.businessName}
          </h1>

          {(business.ownerName || business.designation) && (
            <p className="text-gray-500 text-sm mt-1.5 font-medium">
              {[business.ownerName, business.designation].filter(Boolean).join(" · ")}
            </p>
          )}

          {business.category && (
            <span
              className="inline-block mt-3 px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full"
              style={{
                background: `${p[0]}18`,
                color: p[0],
                border: `1px solid ${p[0]}44`,
              }}
            >
              {business.category}
            </span>
          )}
        </div>

        {/* ══════════════════════════════════════════
            CONTACT BUTTONS — each gets a unique extracted color
        ══════════════════════════════════════════ */}
        <div className="px-4 mt-8 t5-fadeUp" style={{ animationDelay: "0.1s" }} id="t5-contact">
          <div className="flex flex-wrap justify-center gap-4">
            {contactButtons.map((btn, idx) => (
              <a
                key={idx}
                href={btn.href}
                target={btn.label !== "Call" && btn.label !== "Save" ? "_blank" : undefined}
                rel="noreferrer"
                className="t5-lift flex flex-col items-center justify-center w-[72px] gap-1.5"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
                  style={{ background: p[idx % p.length] }}
                >
                  {btn.icon}
                </div>
                <span
                  className="text-xs font-bold"
                  style={{ color: p[idx % p.length] }}
                >
                  {btn.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SOCIAL LINKS — on a wave strip
        ══════════════════════════════════════════ */}
        {socialLinks.length > 0 && (
          <div className="mt-8 relative" style={{ minHeight: 130 }}>
            {/* Wave background */}
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.88)" }} />
            <div className="absolute top-0 left-0 right-0" style={{ height: 70, zIndex: 1 }}>
              <WaveSection colors={[...p].reverse()} flip height={70} />
            </div>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: 70, zIndex: 1 }}>
              <WaveSection colors={p} height={70} />
            </div>

            {/* Icons */}
            <div
              className="relative flex items-center justify-center gap-5"
              style={{ zIndex: 10, paddingTop: 32, paddingBottom: 32 }}
            >
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="t5-lift w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl"
                  style={{ background: p[idx % p.length] }}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            ABOUT
        ══════════════════════════════════════════ */}
        {business.about && (
          <div id="t5-about" className="px-4 mt-8 t5-fadeUp" style={{ animationDelay: "0.2s" }}>
            <div className="rounded-3xl overflow-hidden shadow-md border border-gray-100">
              <div className="h-1.5 w-full" style={{ background: gradHoriz }} />
              <div className="p-5 bg-white">
                <h2
                  className="t5-heading font-black text-xs uppercase tracking-widest mb-3 t5-gtext"
                  style={{ backgroundImage: gradHoriz }}
                >
                  About Us
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{business.about}</p>
                {business.yearEstd && (
                  <p className="text-xs text-gray-400 mt-3 font-semibold">Est. {business.yearEstd}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            SERVICES
        ══════════════════════════════════════════ */}
        {servicesData.length > 0 && (
          <div id="t5-services" className="px-4 mt-8 t5-fadeUp" style={{ animationDelay: "0.25s" }}>
            <h2
              className="t5-heading font-black text-xs uppercase tracking-widest mb-4 t5-gtext"
              style={{ backgroundImage: gradHoriz }}
            >
              Services & Products
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {servicesData.map((svc: any, idx: number) => (
                <div
                  key={idx}
                  className="t5-lift rounded-2xl overflow-hidden shadow-md bg-white border border-gray-100 cursor-pointer"
                  onClick={() => svc.image && setSelectedImage(svc.image)}
                >
                  {svc.image && (
                    <div className="w-full aspect-square relative overflow-hidden">
                      <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" />
                      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: makeGrad([p[idx % p.length], p[(idx + 1) % p.length]]) }} />
                      {svc.price && (
                        <div
                          className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[10px] font-black shadow"
                          style={{ color: p[idx % p.length] }}
                        >
                          {svc.price}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-bold text-gray-900 text-sm leading-tight">{svc.title}</p>
                    {svc.description && <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">{svc.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            GALLERY
        ══════════════════════════════════════════ */}
        {galleryData.length > 0 && (
          <div id="t5-gallery" className="px-4 mt-8 t5-fadeUp" style={{ animationDelay: "0.3s" }}>
            <h2
              className="t5-heading font-black text-xs uppercase tracking-widest mb-4 t5-gtext"
              style={{ backgroundImage: gradHoriz }}
            >
              Gallery
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {galleryData.map((img: string, idx: number) => (
                <div
                  key={idx}
                  className="t5-lift aspect-square rounded-xl overflow-hidden shadow-sm cursor-pointer relative"
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  {/* colored corner accent */}
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: p[idx % p.length] }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            ENQUIRY
        ══════════════════════════════════════════ */}
        <div id="t5-enquiry" className="px-4 mt-8 t5-fadeUp" style={{ animationDelay: "0.35s" }}>
          <div className="rounded-3xl overflow-hidden shadow-md border border-gray-100">
            <div className="h-1.5 w-full" style={{ background: gradHoriz }} />
            <div className="p-5 bg-white">
              <h2
                className="t5-heading font-black text-xs uppercase tracking-widest mb-4 t5-gtext"
                style={{ backgroundImage: gradHoriz }}
              >
                Send an Enquiry
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const name = (form.elements.namedItem("t5name") as HTMLInputElement)?.value;
                  const msg = (form.elements.namedItem("t5msg") as HTMLTextAreaElement)?.value;
                  const wa = business.whatsapp || business.phone;
                  if (wa) {
                    window.open(`https://wa.me/${wa.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello! I'm ${name}. ${msg}`)}`, "_blank");
                  }
                }}
                className="space-y-3"
              >
                <input
                  name="t5name"
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-colors"
                  style={{ "--focus-color": p[0] } as any}
                  onFocus={e => (e.target.style.borderColor = p[0])}
                  onBlur={e => (e.target.style.borderColor = "")}
                />
                <textarea
                  name="t5msg"
                  rows={3}
                  placeholder="Your message..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-colors resize-none"
                  onFocus={e => (e.target.style.borderColor = p[0])}
                  onBlur={e => (e.target.style.borderColor = "")}
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg"
                  style={{ background: gradHoriz }}
                >
                  Send via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            BOTTOM PALETTE WAVE + FOOTER
        ══════════════════════════════════════════ */}
        <div className="mt-10 relative" style={{ minHeight: 130 }}>
          <div className="absolute inset-0" style={{ background: "rgba(6,6,20,0.95)" }} />
          <div className="absolute top-0 left-0 right-0" style={{ height: 80, zIndex: 1 }}>
            <WaveSection colors={p} flip height={80} />
          </div>
          {/* Footer text */}
          <div className="relative z-10 px-4 py-6 pt-20 text-center">
            <p className="text-gray-500 text-[11px] mb-4 uppercase tracking-[0.2em] font-bold">
              Create your own digital card
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-extrabold text-white shadow-lg t5-lift"
              style={{ background: gradHoriz }}
            >
              Get Started Now
            </Link>
            <div className="mt-6 flex flex-col items-center gap-1 opacity-50">
              <span className="text-[10px] uppercase font-medium tracking-widest text-gray-400">Powered by</span>
              <span
                className="text-sm font-black t5-gtext"
                style={{ backgroundImage: gradHoriz }}
              >
                EVisitingCard
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            BOTTOM NAV — uses palette colors
        ══════════════════════════════════════════ */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.15)]">
          <div className="h-0.5 w-full" style={{ background: gradHoriz }} />
          <div className="flex items-center justify-around h-[60px]">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="flex flex-col items-center justify-center w-16 h-full transition-all active:scale-90"
                style={{ color: idx === 0 ? p[0] : idx === 4 ? p[p.length - 1] : "#999" }}
              >
                {item.icon}
                <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            LIGHTBOX
        ══════════════════════════════════════════ */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </>
  );
}
