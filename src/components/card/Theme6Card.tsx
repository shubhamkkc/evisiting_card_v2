"use client";

// ─── Theme 6 — Linktree (redesign) ──────────────────────────────────────────
// QR customer-engagement page. First screen, in order: profile → Google
// Review hero (the primary CTA) → social follow grid → quick actions
// (Save Contact / Rate us on Google / Install App / Call / Email) → Website / Maps. Everything
// below the fold is compact: small left-aligned headings, 12px gaps,
// no duplicate description, no bottom nav, no decorative banner art.
// COLOURS ARE DYNAMIC: the layout language is Linktree (pill buttons,
// radii, spacing), but every colour token comes from the business's own
// logo via the Brand Identity Engine (src/lib/brand.ts). A business
// without a stored palette renders the Linktree lime/purple fallback.
// Social pills keep each platform's own brand colour on the icon chip
// (YouTube red, Instagram gradient, Facebook blue, WhatsApp green) while
// the pill itself follows the business's surface colour.
// Performance: no animation libraries, no font @import, no client-side
// colour extraction (the palette is generated once, server-side, when
// the logo is uploaded). The QR library is dynamic-imported only when
// the Share section scrolls into view. Below-the-fold images are lazy;
// only the logo/cover are prioritised.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone, MessageCircle, Mail, Globe, MapPin, Download,
  Facebook, Instagram, Linkedin, Youtube, Twitter,
  Music, Ghost, Link as LinkIcon, Star, Send,
  X, Share2, Copy, Check,
} from "lucide-react";
import { resolveBrandPalette, type BrandPalette } from "@/lib/brand";

// ─── Linktree layout tokens (DESIGN.md) ─────────────────────────────────────
// Only the *shape* language lives here (radii, font). All colours come
// from the business's brand palette — see resolveBrandPalette() — with
// the Linktree lime/purple tokens as the fallback for businesses that
// have no palette stored yet.
const FONT = "'Link Sans',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif";

// Platform brand colours — icon chips only; the pill stays Linktree-white.
const BRAND: Record<string, string> = {
  youtube: "#FF0000",
  instagram: "linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)",
  facebook: "#1877F2",
  whatsapp: "#25D366",
};

// ─── Small building blocks ──────────────────────────────────────────────────

// Full-pill Linktree button. Primary = brand primary, secondary =
// brand surface + hairline border, dark = brand dark surface.
// Compact size is for 2-column grid rows.
function PillButton({
  brand,
  href,
  children,
  variant = "secondary",
  size = "default",
  className = "",
  download,
  onClick,
  ariaLabel,
}: {
  brand: BrandPalette;
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dark";
  size?: "default" | "compact";
  className?: string;
  download?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const style: React.CSSProperties =
    variant === "primary"
      ? { background: brand.primary, color: brand.onPrimary }
      : variant === "dark"
        ? { background: brand.dark, color: brand.onDark }
        : { background: brand.surface, color: brand.surfaceText, border: `1px solid ${brand.border}` };
  const cls =
    (size === "compact"
      ? "t6-pill group flex w-full min-h-[52px] items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
      : "t6-pill group flex w-full min-h-[56px] items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-medium") +
    " transition-[filter,transform] duration-150 hover:brightness-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99] " +
    className;
  const inner = <span className="flex items-center gap-2.5">{children}</span>;
  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        onClick={onClick}
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

// Social follow pill for the 2-column grid: brand-coloured icon chip,
// platform name + action on two compact lines. The pill follows the
// business's surface colour.
function SocialGridButton({
  brand,
  href,
  label,
  action,
  chip,
  icon,
  onClick,
  ariaLabel,
}: {
  brand: BrandPalette;
  href: string;
  label: string;
  action: string;
  chip: string;
  icon: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ background: brand.surface, borderColor: brand.border }}
      className="flex min-h-[56px] items-center gap-2.5 rounded-full border px-3.5 py-2.5 text-left transition-[filter,transform] duration-150 hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99]"
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
        style={{ background: chip }}
      >
        {icon}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-sm font-bold" style={{ color: brand.surfaceText }}>{label}</span>
        <span className="block text-[11px] font-medium" style={{ color: brand.textMuted }}>{action}</span>
      </span>
    </a>
  );
}

// Compact section heading — small, left-aligned, no landing-page bulk.
function SectionHeading({ brand, children }: { brand: BrandPalette; children: React.ReactNode }) {
  return (
    <h2 className="text-left text-[15px] font-extrabold leading-snug tracking-[-0.01em]" style={{ color: brand.text }}>
      {children}
    </h2>
  );
}

function Card({ brand, children, id }: { brand: BrandPalette; children: React.ReactNode; id?: string }) {
  return (
    <section
      id={id}
      className="scroll-mt-20 rounded-[2rem] border p-5"
      style={{ background: brand.cardBackground, borderColor: brand.border }}
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
  googlePlaceId?: string | null;
  googleReviewWidget?: string | null;
  businessHours?: string | null;
  closingDay?: string | null;
  logo?: string | null;
  coverPhoto?: string | null;
  /** Dynamic brand identity (JSON BrandPalette, generated from the logo).
      Null → the Linktree fallback palette. */
  brandPalette?: string | null;
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
  const [aboutExpanded, setAboutExpanded] = useState(false);
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

  // ── Dynamic brand identity ─────────────────────────────────────────────
  // Every colour on this card comes from the business's own logo
  // (generated once, server-side, at upload). No stored palette →
  // the Linktree lime/purple fallback, so the card never breaks.
  // Memoised: resolveBrandPalette builds a new object each call, and the
  // QR effect below depends on it.
  const brand = useMemo(() => resolveBrandPalette(business), [business]);

  const socialLinks: { platform: string; url: string }[] = Array.isArray(socialData)
    ? (socialData as { platform: string; url: string }[]).filter((l) => l.url)
    : socialData && typeof socialData === "object"
      ? Object.entries(socialData)
          .filter(([, v]) => v)
          .map(([platform, url]) => ({ platform, url: url as string }))
      : [];

  // ── QR engagement: priority socials, review link, WhatsApp ──────────────
  const findSocial = (...keys: string[]) =>
    socialLinks.find((l) => keys.includes(l.platform.toLowerCase()));
  const youtubeLink = findSocial("youtube");
  const instagramLink = findSocial("instagram");
  const facebookLink = findSocial("facebook");
  const whatsappSocial = findSocial("whatsapp");
  const reviewLink = findSocial("googlereview", "google", "review");
  const priorityKeys = new Set(["youtube", "instagram", "facebook", "whatsapp"]);
  // The review link has its own hero section — don't duplicate it here.
  const iconExcludes = new Set([...priorityKeys, "googlereview", "google", "review"]);
  const otherSocials = socialLinks.filter((l) => !iconExcludes.has(l.platform.toLowerCase()));

  const waNumber = (business.whatsapp || "").replace(/\D/g, "");
  const whatsappUrl = waNumber
    ? `https://wa.me/${waNumber}?text=Hello%20${encodeURIComponent(business.businessName)}`
    : whatsappSocial?.url ?? null;

  // Google Review URL: configured link first, else derive it from the
  // Google Place ID (search.google.com/local/writereview?placeid=...).
  const googleReviewUrl =
    reviewLink?.url ??
    (business.googlePlaceId
      ? `https://search.google.com/local/writereview?placeid=${business.googlePlaceId}`
      : null);

  // ── Privacy-friendly click analytics (POST /api/track, sendBeacon) ──────
  // No personal data — only the page slug + event type.
  const track = useCallback((type: string) => {
    try {
      const payload = JSON.stringify({ slug: business.slug, type });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  }, [business.slug]);

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
          color: { dark: brand.text, light: brand.cardBackground },
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

  // PWA: register the service worker (Theme 6 renders without the shared
  // InstallPWA component, so it registers here), capture the install
  // prompt, and detect installed / iOS states for the install section.
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Register now if the page already loaded (React hydrates after
      // `load` on fast connections, so a load-only listener would never fire).
      const registerSW = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      };
      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
      }
    }
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setPwaInstalled(standalone);
    setIsIOS(
      /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
        !(window as unknown as { MSStream?: unknown }).MSStream
    );
    const handler = (e: Event) => {
      e.preventDefault();
      setPwaPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setPwaInstalled(true);
      setPwaPrompt(null);
      track("pwa_install");
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [track]);

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

  // Install App action for the quick-actions grid: native prompt on
  // Android/Chrome, or scroll to the iOS steps on iPhone. Hidden when
  // already installed or when the browser offers no install path.
  const installAction = !pwaInstalled && pwaPrompt ? (
    <PillButton
      brand={brand}
      variant="secondary"
      size="compact"
      onClick={async () => {
        pwaPrompt.prompt();
        const choice = await pwaPrompt.userChoice;
        if (choice.outcome === "accepted") track("pwa_install");
        setPwaPrompt(null);
      }}
      ariaLabel="Install this card as an app"
    >
      <Download className="h-4 w-4" /> Install App
    </PillButton>
  ) : !pwaInstalled && isIOS ? (
    <PillButton
      brand={brand}
      variant="secondary"
      size="compact"
      onClick={() => document.getElementById("t6-install")?.scrollIntoView({ behavior: "smooth" })}
      ariaLabel="Install this card as an app"
    >
      <Download className="h-4 w-4" /> Install App
    </PillButton>
  ) : null;

  // Quick-action grid: Save Contact is always there; the Google Review
  // button joins it when a review URL is configured; Call / Email /
  // Install App join it when available. A lone button spans both columns.
  const quickCount =
    1 + (googleReviewUrl ? 1 : 0) + (installAction ? 1 : 0) + (business.phone ? 1 : 0) + (business.email ? 1 : 0);

  return (
    <>
      <style>{`
        .t6-root { font-family: ${FONT}; }
        .t6-root .t6-pill:hover { transform: translateY(-1px); }
        .t6-root dt { color: var(--t6-muted); }
        .t6-root input::placeholder, .t6-root textarea::placeholder { color: var(--t6-muted); }
        .t6-root input:focus, .t6-root textarea:focus { border-color: var(--t6-outline); }
        .t6-root :focus-visible { outline-color: var(--t6-outline, #000) !important; }
        @media (prefers-reduced-motion: reduce) {
          .t6-root * { transition: none !important; animation: none !important; }
        }
      `}</style>

      <div
        id="t6-top"
        className="t6-root relative min-h-screen w-full overflow-x-hidden"
        style={{
          background: brand.pageBackground,
          color: brand.text,
          "--t6-muted": brand.textMuted,
          "--t6-outline": brand.text,
        } as React.CSSProperties}
      >
        {/* NOTE: the public view-count badge was removed — a low count hurts
            credibility for new businesses. View counting itself still runs
            in BusinessCard (/api/view) and owners see views in admin. */}

        {/* ── Profile header ─────────────────────────────────────────── */}
        <header className="px-4 pt-5 text-center">
          {/* Cover banner only when the business has one — no decorative
              art when there is none. */}
          {business.coverPhoto && (
            <div className="relative mx-auto h-32 w-full max-w-[398px] overflow-hidden rounded-[1.5rem]">
              <Image
                src={business.coverPhoto}
                alt=""
                fill
                priority
                sizes="(max-width: 430px) 100vw, 430px"
                className="object-cover"
              />
              {/* Brand fade: the bottom of the cover melts into the page
                  background (a brand colour), so the logo sits on a branded
                  fade instead of a hard photo edge. Subtle by design. */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: `linear-gradient(to bottom, transparent 55%, ${brand.pageBackground} 100%)` }}
                aria-hidden="true"
              />
            </div>
          )}

          {/* Logo — 88px with a brand-primary halo, overlapping the cover when set */}
          <div
            className={`relative z-10 mx-auto h-[88px] w-[88px] rounded-full p-[3px] shadow-sm ${
              business.coverPhoto ? "-mt-11" : "mt-1"
            }`}
            style={{ background: brand.primary }}
          >
            <div className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-white">
              {business.logo ? (
                <Image
                  src={business.logo}
                  alt={business.businessName}
                  width={88}
                  height={88}
                  priority
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-3xl font-extrabold"
                  style={{ background: brand.surface, color: brand.surfaceText }}
                >
                  {business.businessName.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Name / designation / business */}
          <h1 className="mt-3 text-[22px] font-extrabold leading-[1.25] tracking-[-0.02em]">
            {business.businessName}
          </h1>
          {(business.ownerName || business.designation) && (
            <p className="mt-0.5 text-sm font-normal leading-[1.4]" style={{ color: brand.textMuted }}>
              {[business.ownerName, business.designation].filter(Boolean).join(" · ")}
            </p>
          )}
          {business.category && (
            <span
              className="mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ background: brand.chipBg, color: brand.chipText }}
            >
              {business.category}
            </span>
          )}
          {/* About — full text behind a Read more / Show less toggle.
              Short abouts (≤120 chars) render exactly as before. */}
          {business.about && (
            <div className="mx-auto mt-2.5 max-w-[330px]">
              <p className={`text-sm font-normal leading-[1.5] ${aboutExpanded ? "" : "line-clamp-2"}`} style={{ color: brand.text }}>
                {business.about}
              </p>
              {business.about.length > 120 && (
                <button
                  type="button"
                  onClick={() => setAboutExpanded((v) => !v)}
                  aria-expanded={aboutExpanded}
                  className="mt-1 text-[13px] font-semibold"
                  style={{ color: brand.primary }}
                >
                  {aboutExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}
          {business.address && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[13px]" style={{ color: brand.textMuted }}>
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {business.address.split(",").slice(0, 2).join(",").trim()}
            </p>
          )}
        </header>

        {/* ── Google Review — the primary CTA ──────────────────────────
            Brand-primary hero card, first action on the page: stars,
            one-line pitch, big contrasting button. */}
        {googleReviewUrl && (
          <div className="mt-4 px-4">
            <div className="rounded-[1.75rem] px-5 py-5 text-center" style={{ background: brand.primary }}>
              <div className="flex justify-center gap-0.5" aria-label="5 star rating">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-current" style={{ color: brand.onPrimary }} />
                ))}
              </div>
              <p className="mt-2 text-lg font-extrabold leading-snug tracking-[-0.01em]" style={{ color: brand.onPrimary }}>
                Enjoyed Shopping With Us?
              </p>
              <p className="mt-1 text-[13px] leading-snug" style={{ color: brand.onPrimary, opacity: 0.75 }}>
                Your feedback helps our business grow.
              </p>
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("google_review_click")}
                aria-label="Rate us on Google"
                style={{ background: brand.heroButtonBg, color: brand.heroButtonText }}
                className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-[filter,transform] duration-150 hover:brightness-[1.15] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99]"
              >
                <Star className="h-5 w-5 fill-current" style={{ color: brand.heroButtonText }} /> Rate Us on Google
              </a>
            </div>
          </div>
        )}

        {/* ── Social follow grid — platform identity on the icon chip ── */}
        {(youtubeLink || instagramLink || facebookLink || whatsappUrl) && (
          <div className="mt-3 grid grid-cols-2 gap-2.5 px-4">
            {youtubeLink && (
              <SocialGridButton
                brand={brand}
                href={youtubeLink.url}
                label="YouTube"
                action="Subscribe"
                chip={BRAND.youtube}
                icon={<Youtube className="h-4 w-4" />}
                onClick={() => track("youtube_click")}
                ariaLabel="Subscribe on YouTube"
              />
            )}
            {instagramLink && (
              <SocialGridButton
                brand={brand}
                href={instagramLink.url}
                label="Instagram"
                action="Follow"
                chip={BRAND.instagram}
                icon={<Instagram className="h-4 w-4" />}
                onClick={() => track("instagram_click")}
                ariaLabel="Follow on Instagram"
              />
            )}
            {facebookLink && (
              <SocialGridButton
                brand={brand}
                href={facebookLink.url}
                label="Facebook"
                action="Follow"
                chip={BRAND.facebook}
                icon={<Facebook className="h-4 w-4" />}
                onClick={() => track("facebook_click")}
                ariaLabel="Follow on Facebook"
              />
            )}
            {whatsappUrl && (
              <SocialGridButton
                brand={brand}
                href={whatsappUrl}
                label="WhatsApp"
                action="Connect"
                chip={BRAND.whatsapp}
                icon={<MessageCircle className="h-4 w-4" />}
                onClick={() => track("whatsapp_click")}
                ariaLabel="Connect on WhatsApp"
              />
            )}
          </div>
        )}

        {/* ── Quick actions: Save Contact / Rate us on Google / Install App / Call / Email ── */}
        <div className="mt-2.5 grid grid-cols-2 gap-2.5 px-4">
          <PillButton
            brand={brand}
            href={`/api/vcard/${business.slug}`}
            variant="primary"
            size="compact"
            className={quickCount === 1 ? "col-span-2" : ""}
            download
            onClick={() => track("save_contact_click")}
            ariaLabel="Save contact"
          >
            <Download className="h-4 w-4" /> Save Contact
          </PillButton>
          {/* Google Review — prominent first-screen action, only when a
              review URL is configured (hero card above carries the same
              link; this puts it next to Save Contact). */}
          {googleReviewUrl && (
            <PillButton
              brand={brand}
              href={googleReviewUrl}
              variant="primary"
              size="compact"
              onClick={() => track("google_review_click")}
              ariaLabel="Rate us on Google"
            >
              <Star className="h-4 w-4 fill-current" /> Rate us on Google
            </PillButton>
          )}
          {installAction}
          {business.phone && (
            <PillButton
              brand={brand}
              href={`tel:${business.phone}`}
              size="compact"
              onClick={() => track("call_click")}
              ariaLabel={`Call ${business.businessName}`}
            >
              <Phone className="h-4 w-4" /> Call
            </PillButton>
          )}
          {business.email && (
            <PillButton
              brand={brand}
              href={`mailto:${business.email}`}
              size="compact"
              onClick={() => track("email_click")}
              ariaLabel={`Email ${business.businessName}`}
            >
              <Mail className="h-4 w-4" /> Email
            </PillButton>
          )}
        </div>

        {/* ── Website / Maps ─────────────────────────────────────────── */}
        {(websiteUrl || business.googleMapsUrl) && (
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 px-4">
            {websiteUrl && (
              <PillButton
                brand={brand}
                href={websiteUrl}
                size="compact"
                className={!business.googleMapsUrl ? "col-span-2" : ""}
                onClick={() => track("website_click")}
                ariaLabel="Visit website"
              >
                <Globe className="h-4 w-4" /> Website
              </PillButton>
            )}
            {business.googleMapsUrl && (
              <PillButton
                brand={brand}
                href={business.googleMapsUrl}
                size="compact"
                className={!websiteUrl ? "col-span-2" : ""}
                onClick={() => track("maps_click")}
                ariaLabel="Open in Google Maps"
              >
                <MapPin className="h-4 w-4" /> Maps
              </PillButton>
            )}
          </div>
        )}

        {/* ── Other socials — circular 2.5rem containers in the brand ink ─── */}
        {otherSocials.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 px-4">
            {otherSocials.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.platform}
                onClick={() => track(`${link.platform.toLowerCase()}_click`)}
                style={{ background: brand.text, color: brand.pageBackground }}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}

        {/* ── Visit Us — address, hours, closing day, phone ──────────── */}
        {business.address && (
          <div className="mt-3 px-4">
            <Card brand={brand}>
              <SectionHeading brand={brand}>Visit Us</SectionHeading>
              <p className="mt-2.5 flex items-start gap-2 text-sm leading-[1.5]" style={{ color: brand.textMuted }}>
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: brand.text }} />
                {business.address}
              </p>
              {(business.businessHours || business.closingDay || business.phone) && (
                <dl className="mt-4 space-y-2.5 border-t pt-4 text-sm" style={{ borderColor: brand.border }}>
                  {business.businessHours && (
                    <div className="flex items-center justify-between gap-4">
                      <dt style={{ color: brand.textMuted }}>Opening Hours</dt>
                      <dd className="text-right font-semibold">{business.businessHours}</dd>
                    </div>
                  )}
                  {business.closingDay && (
                    <div className="flex items-center justify-between gap-4">
                      <dt style={{ color: brand.textMuted }}>Weekly Closing Day</dt>
                      <dd className="text-right font-semibold">{business.closingDay}</dd>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-center justify-between gap-4">
                      <dt style={{ color: brand.textMuted }}>Phone</dt>
                      <dd className="text-right font-semibold">
                        <a href={`tel:${business.phone}`} onClick={() => track("call_click")} className="underline-offset-2 hover:underline">
                          {business.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              )}
            </Card>
          </div>
        )}

        {/* ── Business details — facts only (the description lives in the
            header, clamped to 2 lines; it is not repeated here) ─────── */}
        {(business.category || business.yearEstd) && (
          <div className="mt-3 px-4">
            <Card brand={brand}>
              <SectionHeading brand={brand}>Business Details</SectionHeading>
              <dl className="mt-3 space-y-2.5 text-sm">
                {business.category && (
                  <div className="flex items-center justify-between gap-4">
                    <dt style={{ color: brand.textMuted }}>Nature of Business</dt>
                    <dd className="text-right font-semibold">{business.category}</dd>
                  </div>
                )}
                {business.yearEstd && (
                  <div className="flex items-center justify-between gap-4">
                    <dt style={{ color: brand.textMuted }}>Year Established</dt>
                    <dd className="text-right font-semibold">{business.yearEstd}</dd>
                  </div>
                )}
              </dl>
            </Card>
          </div>
        )}

        {/* ── Services ───────────────────────────────────────────────── */}
        {servicesData.length > 0 && (
          <div className="mt-5 px-4">
            <SectionHeading brand={brand}>Services &amp; Products</SectionHeading>
            <div className="mt-3 space-y-2.5">
              {(servicesData as Theme6Service[]).map((svc: Theme6Service, idx: number) => {
                const title = svc.title ?? svc.name ?? "Service";
                const rawP = (svc.price || "").trim();
                const displayP = /^\d+$/.test(rawP) ? `₹${Number(rawP).toLocaleString("en-IN")}` : rawP;
                return (
                  <article key={idx} className="overflow-hidden rounded-[1.75rem] border" style={{ background: brand.cardBackground, borderColor: brand.border }}>
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
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold leading-snug">{title}</h3>
                        {svc.price && (
                          <span className="shrink-0 rounded-full px-3 py-1 text-xs font-bold" style={{ background: brand.chipBg, color: brand.chipText }}>
                            {displayP} onwards
                          </span>
                        )}
                      </div>
                      {svc.description && (
                        <p className="mt-1.5 line-clamp-2 text-sm leading-[1.5]" style={{ color: brand.textMuted }}>{svc.description}</p>
                      )}
                      <div className="mt-3.5">
                        <PillButton
                          brand={brand}
                          href={`https://wa.me/${business.whatsapp?.replace(/\D/g, "")}?text=Hi, I would like to enquire about: *${encodeURIComponent(title)}*`}
                          variant="primary"
                          size="compact"
                          onClick={() => track("whatsapp_click")}
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

        {/* ── Gallery — horizontal snap scroll ───────────────────────── */}
        {galleryData.length > 0 && (
          <div className="mt-5">
            <div className="px-4">
              <SectionHeading brand={brand}>Gallery</SectionHeading>
            </div>
            <div className="mt-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(galleryData as (string | { url?: string })[]).map((item: string | { url?: string }, idx: number) => {
                const imageUrl = typeof item === "string" ? item : item?.url || "";
                if (!imageUrl) return null;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imageUrl)}
                    className="relative h-36 w-36 shrink-0 snap-start overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    aria-label={`Gallery image ${idx + 1}`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      loading="lazy"
                      sizes="144px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Videos — link out to the channel (no embeds, no API key) ─── */}
        {youtubeLink && (
          <div className="mt-3 px-4">
            <Card brand={brand}>
              <SectionHeading brand={brand}>Videos</SectionHeading>
              <p className="mt-2 text-sm leading-[1.5]" style={{ color: brand.textMuted }}>
                Watch our latest videos on YouTube.
              </p>
              <div className="mt-3.5">
                <PillButton brand={brand} href={youtubeLink.url} size="compact" onClick={() => track("youtube_click")} ariaLabel="Watch videos on YouTube">
                  <Youtube className="h-4 w-4" /> Watch on YouTube
                </PillButton>
              </div>
            </Card>
          </div>
        )}

        {/* ── Google Reviews widget (only when configured) ───────────── */}
        {business.googleReviewWidget && (
          <div className="mt-3 px-4">
            <Card brand={brand}>
              <SectionHeading brand={brand}>Customer Reviews</SectionHeading>
              <div ref={reviewRef} className="mt-3 w-full" style={{ minHeight: 100 }} />
            </Card>
          </div>
        )}

        {/* ── Enquiry — inputs 0.5rem radius, pill lime button ───────── */}
        <div className="mt-3 px-4">
          <Card brand={brand}>
            <SectionHeading brand={brand}>Send an Enquiry</SectionHeading>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                track("enquiry_click");
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
              className="mt-3.5 space-y-2.5"
            >
              <input
                name="t6name"
                type="text"
                placeholder="Your Name"
                required
                className="w-full rounded-lg border px-4 py-3 text-base outline-none" style={{ background: brand.surface, borderColor: brand.border, color: brand.surfaceText }}
              />
              <input
                name="t6phone"
                type="tel"
                placeholder="Your Phone Number"
                className="w-full rounded-lg border px-4 py-3 text-base outline-none" style={{ background: brand.surface, borderColor: brand.border, color: brand.surfaceText }}
              />
              <textarea
                name="t6msg"
                rows={3}
                placeholder="Your message..."
                required
                className="w-full resize-none rounded-lg border px-4 py-3 text-base outline-none" style={{ background: brand.surface, borderColor: brand.border, color: brand.surfaceText }}
              />
              <button
                type="submit"
                style={{ background: brand.primary, color: brand.onPrimary }}
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-[filter] duration-150 hover:brightness-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99]"
              >
                Send via WhatsApp <Send className="h-4 w-4" />
              </button>
            </form>
          </Card>
        </div>

        {/* ── Share card / QR (QR lib loads lazily, see above) ────────── */}
        <div className="mt-3 px-4" ref={shareRef}>
          <Card brand={brand}>
            <SectionHeading brand={brand}>Share Card</SectionHeading>
            <div className="mt-3.5 flex flex-col items-center gap-4">
              {qrCodeUrl ? (
                <div className="rounded-2xl border p-3 shadow-sm" style={{ background: brand.cardBackground, borderColor: brand.border }}>
                  <Image src={qrCodeUrl} alt="QR Code" width={160} height={160} className="rounded-lg" />
                </div>
              ) : (
                <div className="h-[160px] w-[160px] animate-pulse rounded-2xl" style={{ background: brand.surface }} />
              )}
              <div className="flex w-full gap-2.5">
                <button
                  onClick={copyLink}
                  style={{ background: brand.surface, color: brand.surfaceText, borderColor: brand.text }}
                  className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition-[filter] duration-150 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99]"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out my Digital Business Card: ${cardUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("share_click")}
                  style={{ background: brand.primary, color: brand.onPrimary }}
                  className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-[filter] duration-150 hover:brightness-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99]"
                >
                  <Share2 className="h-4 w-4" /> Share
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Install on iPhone — Share → Add to Home Screen steps ──────
            (Android install lives in the first-screen quick actions.) */}
        {!pwaInstalled && !pwaPrompt && isIOS && (
          <div id="t6-install" className="mt-3 scroll-mt-20 px-4">
            <Card brand={brand}>
              <SectionHeading brand={brand}>Install App</SectionHeading>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-[1.5]" style={{ color: brand.text }}>
                <li>Tap the <strong>Share</strong> button in your browser (square with an arrow).</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> — the card appears on your home screen like an app.</li>
              </ol>
            </Card>
          </div>
        )}

        {/* ── Footer — compact brand-dark strip ────────────────────────── */}
        <footer className="mt-5 px-4 pb-4" style={{ background: brand.dark }}>
          <div className="mx-auto max-w-[398px] py-6 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: brand.onDark, opacity: 0.7 }}>
              Create your own digital card
            </p>
            <Link
              href="/"
              style={{ background: brand.primary, color: brand.onPrimary }}
              className="mt-4 inline-flex min-h-[52px] items-center justify-center rounded-full px-7 py-3 text-[15px] font-semibold transition-[filter] duration-150 hover:brightness-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99]"
            >
              Get Started Now
            </Link>
            <div className="mt-5 flex flex-col items-center gap-0.5 opacity-70">
              <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: brand.onDark }}>Powered by</span>
              <span className="text-sm font-extrabold tracking-tight" style={{ color: brand.onDark }}>GrowX Digital Card</span>
            </div>
          </div>
        </footer>

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
