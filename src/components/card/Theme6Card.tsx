"use client";

// ─── Theme 6 — Linktree ─────────────────────────────────────────────────────
// Faithful adaptation of the Linktree design system (DESIGN.md, OpenDesignMD):
//   ink #000000 · canvas-warm #F3F3F1 · surface-lime #D2E823 (primary CTAs only)
//   accent-purple #471E67 / deep #502274 (conversion/footer stage + hover)
//   surface-lavender #E9C0E9 (badges) · muted #676B5F (secondary text)
//   Pill buttons: radius 9999px, 1rem–1.25rem vertical / 1.5rem horizontal
//   Cards: 2rem radius, 1.5rem padding · flat colour, no heavy shadows
//   Type: Link Sans scale (20px/800 profile name, 16px/400 body, 16px/500 buttons)
//   Link Sans is commercial — no webfont is downloaded; system-ui stack is
//   used at the same weights/sizes so nothing render-blocks on 2G/3G.
// Performance: no animation libraries, no font @import, no colour extraction.
// The QR library is dynamic-imported only when the Share section scrolls into
// view. Below-the-fold images are lazy; only the logo/cover are prioritised.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone, MessageCircle, Mail, Globe, MapPin, Download,
  Home, Info, ShoppingBag, Image as ImageIcon, Send,
  Facebook, Instagram, Linkedin, Youtube, Twitter,
  Music, Ghost, Link as LinkIcon, Star,
  X, Eye, Share2, Copy, Check,
} from "lucide-react";

// ─── Linktree tokens (DESIGN.md) ────────────────────────────────────────────
const T = {
  ink: "#000000",
  inkDeep: "#1E2330",
  muted: "#676B5F",
  canvas: "#FFFFFF",
  canvasWarm: "#F3F3F1",
  surface: "#EFF0EC",
  lime: "#D2E823",
  lavender: "#E9C0E9",
  mint: "#E0E2D9",
  purple: "#471E67",
  purpleDeep: "#502274",
  blue: "#2665D6",
} as const;

const FONT = "'Link Sans',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif";

// ─── Small building blocks ──────────────────────────────────────────────────

// Full-pill Linktree button. Primary = lime, secondary = white + 1px ink
// border, dark = purple (footer/conversion). Min 56px touch target.
function PillButton({
  href,
  children,
  variant = "secondary",
  download,
  onClick,
  ariaLabel,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dark";
  download?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const style: React.CSSProperties =
    variant === "primary"
      ? { background: T.lime, color: T.ink }
      : variant === "dark"
        ? { background: T.purple, color: "#FFFFFF" }
        : { background: T.canvas, color: T.ink, border: `1px solid ${T.ink}` };
  const cls =
    "t6-pill group flex w-full min-h-[56px] items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-medium transition-[filter,transform] duration-150 hover:brightness-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.99]";
  const inner = <span className="flex items-center gap-2.5">{children}</span>;
  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        {...(download ? { download: true } : {})}
        aria-label={ariaLabel}
        style={style}
        className={cls}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} style={style} className={cls}>
      {inner}
    </button>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-[28px] font-medium leading-[1.3] tracking-[-0.01em] text-black">
      {children}
    </h2>
  );
}

function Card({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section
      id={id}
      className="scroll-mt-20 rounded-[2rem] border border-black/5 bg-white p-6"
    >
      {children}
    </section>
  );
}

// ─── Types ──────────────────────────────────────────────────────────────────
interface Theme6Business {
  slug: string;
  businessName: string;
  ownerName?: string | null;
  designation?: string | null;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  googleMapsUrl?: string | null;
  googleReviewWidget?: string | null;
  logo?: string | null;
  coverPhoto?: string | null;
  about?: string | null;
  category?: string | null;
  yearEstd?: string | null;
  socialLinks?: unknown;
  services?: unknown;
  gallery?: unknown;
  showCardViews?: boolean;
}

interface Theme6Service {
  title?: string;
  name?: string;
  description?: string;
  price?: string;
  image?: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function Theme6Card({ business, viewCount }: { business: Theme6Business; viewCount: number }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [cardUrl, setCardUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [pwaPrompt, setPwaPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  // Parse JSON fields (same shape as the other themes)
  const socialData =
    business.socialLinks && typeof business.socialLinks === "string"
      ? JSON.parse(business.socialLinks)
      : business.socialLinks;
  const servicesData =
    business.services && typeof business.services === "string"
      ? JSON.parse(business.services)
      : business.services || [];
  const galleryData =
    business.gallery && typeof business.gallery === "string"
      ? JSON.parse(business.gallery)
      : business.gallery || [];

  const socialLinks: { platform: string; url: string }[] = Array.isArray(socialData)
    ? (socialData as { platform: string; url: string }[]).filter((l) => l.url)
    : socialData && typeof socialData === "object"
      ? Object.entries(socialData)
          .filter(([, v]) => v)
          .map(([platform, url]) => ({ platform, url: url as string }))
      : [];

  const cardHref = typeof window !== "undefined" ? `${window.location.origin}/${business.slug}` : `/${business.slug}`;

  // QR code: lazy — only generated when the Share section scrolls into view,
  // and the `qrcode` library is dynamic-imported so it never enters the
  // initial bundle.
  useEffect(() => {
    setCardUrl(cardHref);
    const el = shareRef.current;
    if (!el) return;
    let done = false;
    const generate = async () => {
      if (done) return;
      done = true;
      try {
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(cardHref, {
          width: 240,
          margin: 2,
          errorCorrectionLevel: "M",
          color: { dark: T.ink, light: "#FFFFFF" },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error("QR generation error:", err);
      }
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            generate();
            io.disconnect();
          }
        },
        { rootMargin: "200px" }
      );
      io.observe(el);
      return () => io.disconnect();
    }
    generate();
  }, [cardHref]);

  // Google Reviews widget — only when the business has one configured.
  useEffect(() => {
    if (!business.googleReviewWidget || !reviewRef.current) return;
    const fragment = document.createRange().createContextualFragment(business.googleReviewWidget);
    reviewRef.current.innerHTML = "";
    reviewRef.current.appendChild(fragment);
  }, [business.googleReviewWidget]);

  // PWA install prompt — only renders a button when the browser offers one.
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPwaPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getSocialIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case "facebook": return <Facebook className="h-5 w-5" />;
      case "instagram": return <Instagram className="h-5 w-5" />;
      case "linkedin": return <Linkedin className="h-5 w-5" />;
      case "youtube": return <Youtube className="h-5 w-5" />;
      case "twitter": return <Twitter className="h-5 w-5" />;
      case "whatsapp": return <MessageCircle className="h-5 w-5" />;
      case "telegram": return <Send className="h-5 w-5" />;
      case "tiktok": return <Music className="h-5 w-5" />;
      case "snapchat": return <Ghost className="h-5 w-5" />;
      case "website": return <Globe className="h-5 w-5" />;
      case "google":
      case "googlereview":
      case "review": return <Star className="h-5 w-5" />;
      default: return <LinkIcon className="h-5 w-5" />;
    }
  };

  const websiteUrl = business.website
    ? business.website.startsWith("http")
      ? business.website
      : `https://${business.website}`
    : null;

  const navItems = [
    { id: "t6-top", label: "Home", icon: <Home className="h-5 w-5" /> },
    { id: "t6-about", label: "About", icon: <Info className="h-5 w-5" /> },
    { id: "t6-services", label: "Services", icon: <ShoppingBag className="h-5 w-5" /> },
    { id: "t6-gallery", label: "Gallery", icon: <ImageIcon className="h-5 w-5" /> },
    { id: "t6-enquiry", label: "Enquiry", icon: <Send className="h-5 w-5" /> },
  ];

  const scrollTo = (id: string) => {
    if (id === "t6-top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        .t6-root { font-family: ${FONT}; }
        .t6-root .t6-pill:hover { transform: translateY(-1px); }
        .t6-root .t6-pill-dark:hover { background: ${T.purpleDeep} !important; }
        @media (prefers-reduced-motion: reduce) {
          .t6-root * { transition: none !important; animation: none !important; }
        }
      `}</style>

      <div id="t6-top" className="t6-root relative min-h-screen w-full overflow-x-hidden bg-[#F3F3F1] pb-24 text-black">
        {/* Views badge */}
        {business.showCardViews && (
          <div className="absolute right-4 top-4 z-[60] flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg">
            <Eye className="h-3.5 w-3.5" />
            {viewCount} Views
          </div>
        )}

        {/* ── Profile header ─────────────────────────────────────────── */}
        <header className="px-4 pt-6 text-center">
          {/* Cover banner (if set) else flat Linktree colour blocks */}
          {business.coverPhoto ? (
            <div className="relative mx-auto h-40 w-full max-w-[398px] overflow-hidden rounded-[2rem]">
              <Image
                src={business.coverPhoto}
                alt=""
                fill
                priority
                sizes="(max-width: 430px) 100vw, 430px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              aria-hidden
              className="relative mx-auto h-24 w-full max-w-[398px] overflow-hidden rounded-[2rem]"
              style={{ background: T.lavender }}
            >
              <div className="absolute -left-6 -top-10 h-28 w-28 rounded-full" style={{ background: T.lime }} />
              <div className="absolute -bottom-8 right-6 h-24 w-24 rounded-full" style={{ background: T.purple }} />
              <div className="absolute right-24 top-4 h-10 w-10 rounded-full" style={{ background: T.mint }} />
            </div>
          )}

          {/* Avatar — 96px circle, white ring, overlapping the banner */}
          <div className="relative z-10 mx-auto -mt-12 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
            {business.logo ? (
              <Image
                src={business.logo}
                alt={business.businessName}
                width={96}
                height={96}
                priority
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#EFF0EC] text-4xl font-extrabold text-black">
                {business.businessName.charAt(0)}
              </div>
            )}
          </div>

          {/* Name / designation / business */}
          <h1 className="mt-4 text-xl font-extrabold leading-[1.3] tracking-[-0.02em]">
            {business.businessName}
          </h1>
          {(business.ownerName || business.designation) && (
            <p className="mt-1 text-base font-normal leading-[1.5] text-[#676B5F]">
              {[business.ownerName, business.designation].filter(Boolean).join(" · ")}
            </p>
          )}
          {business.category && (
            <span className="mt-3 inline-block rounded-full bg-[#E9C0E9] px-4 py-1.5 text-xs font-medium text-black">
              {business.category}
            </span>
          )}
          {business.about && (
            <p className="mx-auto mt-4 max-w-[340px] text-base font-normal leading-[1.5] tracking-[0.01em] text-[#1E2330]">
              {business.about}
            </p>
          )}
        </header>

        {/* ── Contact pills ──────────────────────────────────────────── */}
        <div className="mt-6 space-y-4 px-4">
          {business.phone && (
            <PillButton href={`tel:${business.phone}`} variant="primary" ariaLabel={`Call ${business.businessName}`}>
              <Phone className="h-5 w-5" /> Call
            </PillButton>
          )}
          {business.whatsapp && (
            <PillButton
              href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(business.businessName)}`}
              ariaLabel="Chat on WhatsApp"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </PillButton>
          )}
          {business.email && (
            <PillButton href={`mailto:${business.email}`} ariaLabel={`Email ${business.businessName}`}>
              <Mail className="h-5 w-5" /> Email
            </PillButton>
          )}
          <PillButton href={`/api/vcard/${business.slug}`} variant="dark" download ariaLabel="Save contact">
            <Download className="h-5 w-5" /> Save Contact
          </PillButton>
        </div>

        {/* ── Social icons — circular 2.5rem ink containers ─────────── */}
        {socialLinks.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 px-4">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.platform}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-95"
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}

        {/* ── Links (Linktree link stack) ────────────────────────────── */}
        {(websiteUrl || business.googleMapsUrl) && (
          <div className="mt-6 space-y-4 px-4">
            {websiteUrl && (
              <PillButton href={websiteUrl} ariaLabel="Visit website">
                <Globe className="h-5 w-5" /> Website
              </PillButton>
            )}
            {business.googleMapsUrl && (
              <PillButton href={business.googleMapsUrl} ariaLabel="Open in Google Maps">
                <MapPin className="h-5 w-5" /> View on Google Maps
              </PillButton>
            )}
          </div>
        )}

        {/* ── Address ────────────────────────────────────────────────── */}
        {business.address && (
          <div className="mt-6 px-4">
            <Card>
              <h2 className="text-center text-[28px] font-medium leading-[1.3] tracking-[-0.01em]">Visit Us</h2>
              <p className="mt-3 flex items-start gap-2 text-base leading-[1.5] text-[#676B5F]">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-black" />
                {business.address}
              </p>
              {business.googleMapsUrl && (
                <div className="mt-5">
                  <PillButton href={business.googleMapsUrl} variant="primary" ariaLabel="Get directions on Google Maps">
                    <MapPin className="h-5 w-5" /> Get Directions
                  </PillButton>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── About ──────────────────────────────────────────────────── */}
        {business.about && (
          <div className="mt-6 px-4">
            <Card id="t6-about">
              <SectionHeading>About Us</SectionHeading>
              <p className="mt-4 whitespace-pre-line text-base leading-[1.5] tracking-[0.01em] text-[#1E2330]">
                {business.about}
              </p>
              <dl className="mt-6 space-y-3 border-t border-black/5 pt-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#676B5F]">Company Name</dt>
                  <dd className="text-right font-semibold">{business.businessName}</dd>
                </div>
                {business.category && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#676B5F]">Nature of Business</dt>
                    <dd className="text-right font-semibold">{business.category}</dd>
                  </div>
                )}
                {business.yearEstd && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#676B5F]">Year Established</dt>
                    <dd className="text-right font-semibold">{business.yearEstd}</dd>
                  </div>
                )}
              </dl>
            </Card>
          </div>
        )}

        {/* ── Services ───────────────────────────────────────────────── */}
        {servicesData.length > 0 && (
          <div id="t6-services" className="mt-10 scroll-mt-20 px-4">
            <SectionHeading>Services &amp; Products</SectionHeading>
            <div className="mt-6 space-y-4">
              {(servicesData as Theme6Service[]).map((svc: Theme6Service, idx: number) => {
                const title = svc.title ?? svc.name ?? "Service";
                const rawP = (svc.price || "").trim();
                const displayP = /^\d+$/.test(rawP) ? `₹${Number(rawP).toLocaleString("en-IN")}` : rawP;
                return (
                  <article key={idx} className="overflow-hidden rounded-[2rem] border border-black/5 bg-white">
                    {svc.image && (
                      <button
                        type="button"
                        onClick={() => setSelectedImage(svc.image ?? null)}
                        className="relative block aspect-[16/9] w-full cursor-pointer overflow-hidden"
                        aria-label={`View ${title}`}
                      >
                        <Image
                          src={svc.image}
                          alt={title}
                          fill
                          loading="lazy"
                          sizes="(max-width: 430px) 100vw, 430px"
                          className="object-cover"
                        />
                      </button>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold leading-snug">{title}</h3>
                        {svc.price && (
                          <span className="shrink-0 rounded-full bg-[#E9C0E9] px-3 py-1 text-xs font-bold">
                            {displayP} onwards
                          </span>
                        )}
                      </div>
                      {svc.description && (
                        <p className="mt-2 line-clamp-3 text-base leading-[1.5] text-[#676B5F]">{svc.description}</p>
                      )}
                      <div className="mt-5">
                        <PillButton
                          href={`https://wa.me/${business.whatsapp?.replace(/\D/g, "")}?text=Hi, I would like to enquire about: *${encodeURIComponent(title)}*`}
                          variant="primary"
                          ariaLabel={`Enquire about ${title}`}
                        >
                          Enquiry
                        </PillButton>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Gallery — horizontal snap scroll (DESIGN.md) ───────────── */}
        {galleryData.length > 0 && (
          <div id="t6-gallery" className="mt-10 scroll-mt-20">
            <div className="px-4">
              <SectionHeading>Gallery</SectionHeading>
            </div>
            <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(galleryData as (string | { url?: string })[]).map((item: string | { url?: string }, idx: number) => {
                const imageUrl = typeof item === "string" ? item : item?.url || "";
                if (!imageUrl) return null;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imageUrl)}
                    className="relative h-40 w-40 shrink-0 snap-start overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    aria-label={`Gallery image ${idx + 1}`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      loading="lazy"
                      sizes="160px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Google Reviews widget (only when configured) ───────────── */}
        {business.googleReviewWidget && (
          <div className="mt-6 px-4">
            <Card>
              <SectionHeading>Customer Reviews</SectionHeading>
              <div ref={reviewRef} className="mt-4 w-full" style={{ minHeight: 100 }} />
            </Card>
          </div>
        )}

        {/* ── Enquiry — inputs 0.5rem radius, pill lime button ───────── */}
        <div className="mt-6 px-4">
          <Card id="t6-enquiry">
            <SectionHeading>Send an Enquiry</SectionHeading>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem("t6name") as HTMLInputElement)?.value || "";
                const phone = (form.elements.namedItem("t6phone") as HTMLInputElement)?.value || "";
                const msg = (form.elements.namedItem("t6msg") as HTMLTextAreaElement)?.value || "";
                const wa = business.whatsapp || business.phone;
                if (wa) {
                  window.open(
                    `https://wa.me/${wa.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello! I'm ${name} (${phone}). ${msg}`)}`,
                    "_blank"
                  );
                } else if (business.email) {
                  window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(`Enquiry from ${name}`)}&body=${encodeURIComponent(`${msg}\n\nPhone: ${phone}`)}`;
                }
              }}
              className="mt-5 space-y-3"
            >
              <input
                name="t6name"
                type="text"
                placeholder="Your Name"
                required
                className="w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-base outline-none placeholder:text-[#676B5F] focus:border-black"
              />
              <input
                name="t6phone"
                type="tel"
                placeholder="Your Phone Number"
                className="w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-base outline-none placeholder:text-[#676B5F] focus:border-black"
              />
              <textarea
                name="t6msg"
                rows={3}
                placeholder="Your message..."
                required
                className="w-full resize-none rounded-lg border border-black/15 bg-white px-4 py-3 text-base outline-none placeholder:text-[#676B5F] focus:border-black"
              />
              <button
                type="submit"
                className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#D2E823] px-6 py-4 text-base font-medium text-black transition-[filter] duration-150 hover:brightness-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.99]"
              >
                Send via WhatsApp <Send className="h-4 w-4" />
              </button>
            </form>
          </Card>
        </div>

        {/* ── Share card / QR (QR lib loads lazily, see above) ────────── */}
        <div className="mt-6 px-4" ref={shareRef}>
          <Card>
            <SectionHeading>Share Card</SectionHeading>
            <div className="mt-5 flex flex-col items-center gap-5">
              {qrCodeUrl ? (
                <div className="rounded-2xl border border-black/5 bg-white p-3 shadow-sm">
                  <Image src={qrCodeUrl} alt="QR Code" width={180} height={180} className="rounded-lg" />
                </div>
              ) : (
                <div className="h-[180px] w-[180px] animate-pulse rounded-2xl bg-[#EFF0EC]" />
              )}
              <div className="flex w-full gap-3">
                <button
                  onClick={copyLink}
                  className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full border border-black bg-white px-4 py-3 text-base font-medium transition-[filter] duration-150 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.99]"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out my Digital Business Card: ${cardUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full bg-[#D2E823] px-4 py-3 text-base font-medium text-black transition-[filter] duration-150 hover:brightness-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.99]"
                >
                  <Share2 className="h-4 w-4" /> Share
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Install as app (only when the browser offers it) ────────── */}
        {pwaPrompt && (
          <div className="mt-6 px-4">
            <button
              onClick={async () => {
                pwaPrompt.prompt();
                await pwaPrompt.userChoice;
                setPwaPrompt(null);
              }}
              className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#D2E823] px-6 py-4 text-base font-medium text-black transition-[filter] duration-150 hover:brightness-[0.96] active:scale-[0.99]"
            >
              <Download className="h-5 w-5" /> Save as App (Install)
            </button>
            <p className="mt-2 text-center text-xs text-[#676B5F]">Install this card as an app for easy access anytime.</p>
          </div>
        )}

        {/* ── Footer — purple conversion stage, lime CTA ─────────────── */}
        <footer className="mt-10 px-4 pb-2" style={{ background: T.purple }}>
          <div className="mx-auto max-w-[398px] py-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              Create your own digital card
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#D2E823] px-8 py-4 text-base font-medium text-black transition-[filter] duration-150 hover:brightness-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.99]"
            >
              Get Started Now
            </Link>
            <div className="mt-8 flex flex-col items-center gap-1 opacity-70">
              <span className="text-[10px] font-medium uppercase tracking-widest text-white">Powered by</span>
              <span className="text-sm font-extrabold tracking-tight text-white">EVisitingCard</span>
            </div>
          </div>
        </footer>

        {/* ── Bottom nav ─────────────────────────────────────────────── */}
        <nav className="fixed bottom-0 left-1/2 z-50 flex h-[60px] w-full max-w-[430px] -translate-x-1/2 items-center justify-around border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.15)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex h-full w-16 flex-col items-center justify-center text-black transition-opacity active:opacity-70"
              aria-label={item.label}
            >
              {item.icon}
              <span className="mt-0.5 text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Lightbox ───────────────────────────────────────────────── */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              aria-label="Close image"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </>
  );
}
