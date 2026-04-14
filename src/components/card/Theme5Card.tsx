"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  Phone, MessageCircle, Mail, Globe, MapPin, Download,
  Home, Info, ShoppingBag, Image as ImageIcon, Send,
  Facebook, Instagram, Linkedin, Youtube, Twitter,
  Music, Ghost, Link as LinkIcon, Star,
  X, Eye, Share2, Copy, Check,
} from "lucide-react";

// ─── Color Extraction from logo ────────────────────────────────────────────────
async function extractLogoColors(src: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const SIZE = 80;
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(getFallbackColors());
        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

        const buckets: Record<number, { r: number; g: number; b: number; count: number }> = {};
        const BUCKET_SIZE = 30;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          if (saturation < 0.25) continue;
          if (max < 60) continue;
          if (min > 210) continue;

          const h = rgbToHue(r, g, b);
          const bucket = Math.floor(h / BUCKET_SIZE) * BUCKET_SIZE;
          if (!buckets[bucket]) buckets[bucket] = { r: 0, g: 0, b: 0, count: 0 };
          buckets[bucket].r += r;
          buckets[bucket].g += g;
          buckets[bucket].b += b;
          buckets[bucket].count += 1;
        }

        const sorted = Object.entries(buckets)
          .filter(([_, v]) => v.count > 5)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 6)
          .map(([_, v]) => {
            const c = v.count;
            return `rgb(${Math.round(v.r / c)},${Math.round(v.g / c)},${Math.round(v.b / c)})`;
          });

        if (sorted.length < 3) return resolve(getFallbackColors());
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
    "rgb(236,0,140)",   // magenta
    "rgb(0,174,239)",   // cyan
    "rgb(255,212,0)",   // yellow
    "rgb(30,169,80)",   // green
    "rgb(255,102,0)",   // orange
    "rgb(106,27,154)",  // purple
  ];
}

// Convert "rgb(r,g,b)" → "#rrggbb" for libraries that need hex
function rgbStrToHex(rgb: string): string {
  const m = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return "#000000";
  return "#" + [m[1], m[2], m[3]]
    .map(n => parseInt(n).toString(16).padStart(2, "0"))
    .join("");
}

function makeGrad(colors: string[], dir = "135deg") {
  return `linear-gradient(${dir}, ${colors.join(", ")})`;
}

// ─── Wave SVG (uses palette colors) ───────────────────────────────────────────
function WaveSection({ colors, flip = false, height = 120 }: { colors: string[]; flip?: boolean; height?: number }) {
  const id1 = flip ? "wg1f" : "wg1";
  const id2 = flip ? "wg2f" : "wg2";
  return (
    <div style={{ height, overflow: "hidden", transform: flip ? "scaleY(-1)" : "none", width: "100%", lineHeight: 0 }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <linearGradient id={id1} x1="0%" y1="0%" x2="100%" y2="0%">
            {colors.map((c, i) => (
              <stop key={i} offset={`${(i / Math.max(colors.length - 1, 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>
          <linearGradient id={id2} x1="100%" y1="0%" x2="0%" y2="0%">
            {colors.map((c, i) => (
              <stop key={i} offset={`${(i / Math.max(colors.length - 1, 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
        <path d="M0,50 C200,5 400,110 600,50 C800,0 1000,90 1200,40 L1200,120 L0,120 Z" fill={`url(#${id1})`} opacity="0.95" />
        <path d="M0,75 C150,30 350,115 550,65 C750,20 950,100 1200,60 L1200,120 L0,120 Z" fill={`url(#${id2})`} opacity="0.65" />
        <path d="M0,95 C100,65 300,120 500,90 C700,58 900,115 1200,88 L1200,120 L0,120 Z" fill={`url(#${id1})`} opacity="0.4" />
      </svg>
    </div>
  );
}

// ─── Section Card wrapper ──────────────────────────────────────────────────────
function SectionCard({ gradient, children }: { gradient: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl overflow-hidden shadow-md border border-gray-100">
      <div className="h-1.5 w-full" style={{ background: gradient }} />
      <div className="p-5 bg-white">{children}</div>
    </div>
  );
}

// ─── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ gradient, children }: { gradient: string; children: React.ReactNode }) {
  return (
    <h2
      className="t5-heading font-black text-xs uppercase tracking-widest mb-4"
      style={{
        backgroundImage: gradient,
        backgroundSize: "300% 300%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "t5-palette-anim 4s ease infinite",
      }}
    >
      {children}
    </h2>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Theme5Card({ business, viewCount }: { business: any; viewCount: number }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>(getFallbackColors());
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [cardUrl, setCardUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const reviewRef = useRef<HTMLDivElement>(null);

  // Parse JSON fields
  const socialData = business.socialLinks && typeof business.socialLinks === "string"
    ? JSON.parse(business.socialLinks) : business.socialLinks;
  const servicesData = business.services && typeof business.services === "string"
    ? JSON.parse(business.services) : business.services || [];
  const galleryData = business.gallery && typeof business.gallery === "string"
    ? JSON.parse(business.gallery) : business.gallery || [];

  // Extract palette from logo
  useEffect(() => {
    if (business.logo) {
      extractLogoColors(business.logo).then(setPalette);
    }
  }, [business.logo]);

  // Generate QR code — always use hex colors (qrcode lib requires hex, not rgb())
  useEffect(() => {
    const url = `${window.location.origin}/${business.slug}`;
    setCardUrl(url);
    // Use first palette color converted to hex, or fallback to black
    const darkColor = palette[0].startsWith("rgb")
      ? rgbStrToHex(palette[0])
      : palette[0];
    QRCode.toDataURL(url, {
      width: 240,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: darkColor, light: "#FFFFFF" },
    })
      .then(setQrCodeUrl)
      .catch((err) => {
        console.error("QR generation error:", err);
        // Fallback: try with plain black
        QRCode.toDataURL(url, { width: 240, margin: 2 }).then(setQrCodeUrl).catch(console.error);
      });
  }, [business.slug, palette]);

  // Inject Google Review widget
  useEffect(() => {
    if (!business.googleReviewWidget || !reviewRef.current) return;
    const fragment = document.createRange().createContextualFragment(business.googleReviewWidget);
    reviewRef.current.innerHTML = "";
    reviewRef.current.appendChild(fragment);
    const interval = setInterval(() => {
      reviewRef.current?.querySelectorAll("img").forEach((img) => {
        if (img.naturalWidth === 0) {
          img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(img.alt || "R")}&background=random&color=fff`;
        }
      });
    }, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 10000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [business.googleReviewWidget, palette]);

  // PWA install
  const [pwaPrompt, setPwaPrompt] = useState<any>(null);
  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setPwaPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const p = palette;
  const gradH = makeGrad(p, "90deg");
  const gradD = makeGrad(p, "135deg");

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(cardUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

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
      case "google": case "googlereview": case "review": return <Star className="w-5 h-5" />;
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
          50%      { background-position: 100% 50%; }
        }
        @keyframes t5-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes t5-ring-spin { to { transform: rotate(360deg); } }

        .t5-font    { font-family: 'Poppins', system-ui, sans-serif; }
        .t5-heading { font-family: 'Montserrat','Poppins', system-ui, sans-serif; }
        .t5-float   { animation: t5-float 3.2s ease-in-out infinite; }
        .t5-lift    { transition: transform .2s ease; }
        .t5-lift:hover { transform: translateY(-4px) scale(1.06); }

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
          background: conic-gradient(from 0deg, var(--t5c0),var(--t5c1),var(--t5c2),var(--t5c3),var(--t5c4),var(--t5c5),var(--t5c0));
          animation: t5-ring-spin 4s linear infinite;
          z-index:0;
        }
        .t5-ring-inner {
          position:relative; z-index:1; border-radius:50%; overflow:hidden; background:#fff;
          width:152px; height:152px;
        }
        .review-widget-container img { object-fit: cover !important; }
      `}</style>

      {/* Palette CSS vars */}
      <style>{`:root{--t5c0:${p[0]};--t5c1:${p[1]};--t5c2:${p[2]};--t5c3:${p[3]};--t5c4:${p[4]};--t5c5:${p[5]};}`}</style>

      <div id="t5-top" className="t5-font w-full min-h-screen bg-white pb-24 overflow-x-hidden relative">

        {/* ── Views Badge ── */}
        {business.showCardViews && (
          <div className="absolute top-4 right-4 z-[60] bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
            <Eye className="w-3.5 h-3.5" />
            {viewCount} Views
          </div>
        )}

        {/* ══ HEADER: Cover Photo + Wave ══════════════════════════════════════ */}
        <div className="relative w-full" style={{ height: 220 }}>
          {/* Cover photo */}
          <div className="absolute inset-0 overflow-hidden">
            {business.coverPhoto ? (
              <img src={business.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: gradD }} />
            )}
          </div>
          {/* subtle dark veil so wave reads clearly */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)" }} />

          {/* Palette wave at bottom of header */}
          <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 10 }}>
            <WaveSection colors={p} height={90} />
          </div>

          {/* Small floating logo (corner) */}
          {business.logo && (
            <div className="absolute top-5 right-16 z-20 t5-float">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-2xl border-2 border-white">
                <img src={business.logo} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* ══ LOGO CIRCLE (spinning ring, overlapping wave) ════════════════════ */}
        <div className="flex justify-center" style={{ marginTop: -80, position: "relative", zIndex: 30 }}>
          <div className="t5-ring-wrap" style={{ width: 162, height: 162 }}>
            <div className="t5-ring-inner">
              {business.logo ? (
                <img src={business.logo} alt={business.businessName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: gradD }}>
                  <span className="t5-heading font-black text-5xl text-white">{business.businessName.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ NAME + DESIGNATION + CATEGORY ════════════════════════════════════ */}
        <div className="text-center px-4 mt-4">
          <h1 className="t5-heading font-black text-4xl leading-tight t5-gtext" style={{ backgroundImage: gradH }}>
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
              style={{ background: `${p[0]}18`, color: p[0], border: `1px solid ${p[0]}55` }}
            >
              {business.category}
            </span>
          )}
        </div>

        {/* ══ CONTACT BUTTONS ═══════════════════════════════════════════════════ */}
        <div className="px-4 mt-8" id="t5-contact">
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
                <span className="text-xs font-bold" style={{ color: p[idx % p.length] }}>
                  {btn.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ══ SOCIAL LINKS on wave strip ════════════════════════════════════════ */}
        {socialLinks.length > 0 && (
          <div className="mt-8 relative" style={{ minHeight: 120 }}>
            <div className="absolute inset-0" style={{ background: "rgba(8,8,20,0.92)" }} />
            <div className="absolute top-0 left-0 right-0" style={{ zIndex: 1 }}>
              <WaveSection colors={[...p].reverse()} flip height={60} />
            </div>
            <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 1 }}>
              <WaveSection colors={p} height={60} />
            </div>
            <div className="relative flex items-center justify-center gap-5 flex-wrap px-4" style={{ zIndex: 10, paddingTop: 28, paddingBottom: 28 }}>
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

        {/* ══ ABOUT ═════════════════════════════════════════════════════════════ */}
        {business.about && (
          <div id="t5-about" className="px-4 mt-8">
            <SectionCard gradient={gradH}>
              <SectionHeading gradient={gradH}>About Us</SectionHeading>
              <p className="text-gray-600 text-sm leading-relaxed">{business.about}</p>
              {business.yearEstd && <p className="text-xs text-gray-400 mt-3 font-semibold">Est. {business.yearEstd}</p>}
              {business.address && (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" style={{ color: p[0] }} />
                  {business.address}
                </p>
              )}
            </SectionCard>
          </div>
        )}

        {/* ══ SERVICES & PRODUCTS ═══════════════════════════════════════════════ */}
        {servicesData.length > 0 && (
          <div id="t5-services" className="px-4 mt-8">
            <SectionHeading gradient={gradH}>Services &amp; Products</SectionHeading>
            <div className="grid grid-cols-2 gap-3">
              {servicesData.map((svc: any, idx: number) => {
                const rawP = (svc.price || "").trim();
                const displayP = /^\d+$/.test(rawP) ? `₹${Number(rawP).toLocaleString("en-IN")}` : rawP;
                const priceVal = displayP.replace(/onwards|from/gi, "").trim();
                const color = p[idx % p.length];

                return (
                  <div
                    key={idx}
                    className="t5-lift rounded-2xl overflow-hidden shadow-md bg-white border border-gray-100 flex flex-col"
                  >
                    {svc.image ? (
                      <div
                        className="w-full aspect-square relative overflow-hidden cursor-pointer"
                        onClick={() => setSelectedImage(svc.image)}
                      >
                        <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" />
                        {/* Palette top accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: makeGrad([color, p[(idx + 2) % p.length]]) }} />
                        {/* Price badge */}
                        {svc.price && (
                          <div
                            className="absolute top-2 right-2 w-[78px] h-[78px] rounded-full flex flex-col items-center justify-center z-10 bg-white/20 backdrop-blur-sm shadow-lg"
                            style={{ border: `2px solid ${color}` }}
                          >
                            <span className="text-[10px] italic leading-tight" style={{ color }}>From</span>
                            <span className="text-[15px] font-black leading-tight" style={{ color }}>{priceVal}</span>
                            <span className="text-[10px] leading-tight" style={{ color }}>Onwards</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full aspect-square flex items-center justify-center" style={{ background: `${color}12` }}>
                        <ShoppingBag className="w-10 h-10" style={{ color: `${color}55` }} />
                        {svc.price && !svc.image && (
                          <span className="absolute text-xs font-bold" style={{ color }}>{priceVal} Onwards</span>
                        )}
                      </div>
                    )}
                    <div className="p-3 flex flex-col flex-1">
                      <p className="font-bold text-gray-900 text-sm leading-tight">{svc.title}</p>
                      {svc.description && (
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2 flex-1">{svc.description}</p>
                      )}
                      <a
                        href={`https://wa.me/${business.whatsapp?.replace(/\D/g, "")}?text=Hi, I would like to enquire about: *${encodeURIComponent(svc.title)}*`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 w-full flex items-center justify-center py-2 rounded-xl font-bold text-white text-xs shadow-sm t5-lift"
                        style={{ background: makeGrad([color, p[(idx + 1) % p.length]]) }}
                      >
                        Enquiry
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ GALLERY ═══════════════════════════════════════════════════════════ */}
        {galleryData.length > 0 && (
          <div id="t5-gallery" className="px-4 mt-8">
            <SectionHeading gradient={gradH}>Gallery</SectionHeading>
            <div className="grid grid-cols-3 gap-2">
              {galleryData.map((img: string, idx: number) => (
                <div
                  key={idx}
                  className="t5-lift aspect-square rounded-xl overflow-hidden shadow-sm cursor-pointer relative group"
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: p[idx % p.length] }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ GOOGLE REVIEWS WIDGET ═════════════════════════════════════════════ */}
        {business.googleReviewWidget && (
          <div className="mt-8 px-4">
            <SectionCard gradient={gradH}>
              <SectionHeading gradient={gradH}>Customer Reviews</SectionHeading>
              <div ref={reviewRef} className="review-widget-container w-full" style={{ minHeight: 100 }} />
            </SectionCard>
          </div>
        )}

        {/* ══ ENQUIRY FORM ══════════════════════════════════════════════════════ */}
        <div id="t5-enquiry" className="px-4 mt-8">
          <SectionCard gradient={gradH}>
            <SectionHeading gradient={gradH}>Send an Enquiry</SectionHeading>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem("t5name") as HTMLInputElement)?.value;
                const phone = (form.elements.namedItem("t5phone") as HTMLInputElement)?.value;
                const msg = (form.elements.namedItem("t5msg") as HTMLTextAreaElement)?.value;
                const wa = business.whatsapp || business.phone;
                if (wa) {
                  window.open(
                    `https://wa.me/${wa.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello! I'm ${name} (${phone}). ${msg}`)}`,
                    "_blank"
                  );
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
                onFocus={e => (e.target.style.borderColor = p[0])}
                onBlur={e => (e.target.style.borderColor = "")}
              />
              <input
                name="t5phone"
                type="tel"
                placeholder="Your Phone Number"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-colors"
                onFocus={e => (e.target.style.borderColor = p[1])}
                onBlur={e => (e.target.style.borderColor = "")}
              />
              <textarea
                name="t5msg"
                rows={3}
                placeholder="Your message..."
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-colors resize-none"
                onFocus={e => (e.target.style.borderColor = p[2])}
                onBlur={e => (e.target.style.borderColor = "")}
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg t5-lift"
                style={{ background: gradH }}
              >
                Send via WhatsApp
              </button>
            </form>
          </SectionCard>
        </div>

        {/* ══ SHARE CARD (QR Code) ══════════════════════════════════════════════ */}
        <div id="t5-share" className="px-4 mt-8">
          <SectionCard gradient={gradH}>
            <SectionHeading gradient={gradH}>Share Card</SectionHeading>
            <div className="flex flex-col items-center gap-5">
              {qrCodeUrl ? (
                <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-100">
                  <img src={qrCodeUrl} alt="QR Code" width={180} height={180} className="rounded-lg" />
                </div>
              ) : (
                <div className="w-[180px] h-[180px] bg-gray-100 animate-pulse rounded-2xl" />
              )}
              <div className="flex gap-3 w-full">
                <button
                  onClick={copyLink}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border-2"
                  style={{ borderColor: p[0], color: p[0], background: copied ? `${p[0]}15` : "white" }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/?text=Check out my Digital Business Card: ${cardUrl}`, "_blank")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow t5-lift"
                  style={{ background: gradH }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ══ INSTALL PWA ═══════════════════════════════════════════════════════ */}
        {pwaPrompt && (
          <div className="px-4 mt-6">
            <button
              onClick={async () => {
                pwaPrompt.prompt();
                await pwaPrompt.userChoice;
                setPwaPrompt(null);
              }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 t5-lift"
              style={{ background: gradH }}
            >
              <Download className="w-5 h-5" />
              Save as App (Install)
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">Install this card as an app for easy access anytime.</p>
          </div>
        )}

        {/* ══ BOTTOM WAVE + FOOTER ══════════════════════════════════════════════ */}
        <div className="mt-10 relative" style={{ minHeight: 200 }}>
          <div className="absolute inset-0" style={{ background: "rgba(6,6,22,0.96)" }} />
          <div className="absolute top-0 left-0 right-0" style={{ zIndex: 1 }}>
            <WaveSection colors={p} flip height={80} />
          </div>
          <div className="relative z-10 px-4 text-center" style={{ paddingTop: 90 }}>
            <p className="text-gray-500 text-[11px] mb-4 uppercase tracking-[0.2em] font-bold">
              Create your own digital card
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-extrabold text-white shadow-lg t5-lift"
              style={{ background: gradH }}
            >
              Get Started Now
            </Link>
            <div className="mt-8 pb-8 flex flex-col items-center gap-1 opacity-40">
              <span className="text-[10px] uppercase font-medium tracking-widest text-gray-400">Powered by</span>
              <span className="text-sm font-black t5-gtext" style={{ backgroundImage: gradH }}>
                EVisitingCard
              </span>
            </div>
          </div>
        </div>

        {/* ══ BOTTOM NAVIGATION BAR ════════════════════════════════════════════ */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.15)]">
          <div className="h-0.5 w-full" style={{ background: gradH }} />
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

        {/* ══ LIGHTBOX ══════════════════════════════════════════════════════════ */}
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
