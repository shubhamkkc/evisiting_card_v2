// ─── Dynamic Brand Identity Engine ──────────────────────────────────────────
// Turns a business logo into a complete, accessible design system.
//
// How it works (no vision API, no API key, no per-logo cost):
//   1. `node-vibrant` (already a dependency) extracts the six semantic
//      swatches every designer reaches for — Vibrant, LightVibrant,
//      DarkVibrant, Muted, LightMuted, DarkMuted. Swatches are chosen by
//      saturation × population, not by raw pixel counts, so a gold emblem
//      on a black field is recognised as "gold + black", not "mostly black".
//   2. A `sharp` pixel pass measures what Vibrant cannot: the logo's mean
//      luminance, its dark/light share, its most populous dark colour
//      ("ink") and light colour, and whether it is dark / light /
//      colourful / monochrome. Transparent pixels are ignored.
//   3. `buildPalette` assigns each colour a *role* — primary, dark
//      surface, page background, text — and derives the rest (hover
//      states, borders, chip tints, gradients) with contrast-checked
//      text colours (WCAG: black vs white picked by measured ratio).
//
// The palette is stored per business as JSON in `Business.brandPalette`.
// Theme 6 reads it with `resolveBrandPalette`; a business without a
// stored palette gets `fallbackPalette` (the Linktree lime/purple
// tokens), so existing cards render exactly as before.
// This file is client-safe: it imports nothing from node/sharp/vibrant.
// Extraction lives in `brand-extract.ts` (server-only).

export type BrandMode = "light" | "dark";
export type BrandArchetype = "dark" | "light" | "colorful" | "monochrome";

export interface BrandPalette {
  version: 1;
  /** 'dark' when the logo itself is predominantly dark (e.g. black+gold). */
  mode: BrandMode;
  archetype: BrandArchetype;
  /** Main brand colour — CTAs, review hero, logo halo, install button. */
  primary: string;
  primaryHover: string;
  /** Supporting brand colour. */
  secondary: string;
  /** Highlight — category chip, price tags. */
  accent: string;
  /** Deep surface — footer, Save Contact button. */
  dark: string;
  /** Text on `dark`. */
  onDark: string;
  /** Text on `primary`. */
  onPrimary: string;
  pageBackground: string;
  cardBackground: string;
  /** Pills / buttons sitting on the page background. */
  surface: string;
  surfaceText: string;
  /** Primary text. */
  text: string;
  /** Secondary text. */
  textMuted: string;
  /** Hairline borders. */
  border: string;
  chipBg: string;
  chipText: string;
  gradient: [string, string];
  /** Button inside the review hero (contrasts with `primary`). */
  heroButtonBg: string;
  heroButtonText: string;
  source?: {
    logoLuminance: number;
    logoSaturation: number;
    generatedAt: string;
  };
}

// ─── Colour math ────────────────────────────────────────────────────────────

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v =
    h.length === 3
      ? h.split("").map((c) => c + c).join("")
      : h.padEnd(6, "0").slice(0, 6);
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** WCAG relative luminance, 0..1. */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, 1..21. */
export function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Black or white — whichever reads better on `bg`. */
export function bestTextOn(bg: string): "#000000" | "#FFFFFF" {
  return contrastRatio("#000000", bg) >= contrastRatio("#FFFFFF", bg)
    ? "#000000"
    : "#FFFFFF";
}

/** mix(a, b, t): t=0 → a, t=1 → b. */
export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t
  );
}

export function shade(hex: string, amt: number): string {
  return mix(hex, "#000000", amt);
}

export function tint(hex: string, amt: number): string {
  return mix(hex, "#FFFFFF", amt);
}

/** HSL saturation, 0..1. */
export function saturation(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  if (mx === mn) return 0;
  const l = (mx + mn) / 2;
  return l > 0.5 ? (mx - mn) / (2 - mx - mn) : (mx - mn) / (mx + mn);
}

/** HSL hue in degrees, 0..360. */
export function hue(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  if (mx === mn) return 0;
  const d = mx - mn;
  let h = 0;
  if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (mx === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return h;
}

function hueDistance(a: string, b: string): number {
  const d = Math.abs(hue(a) - hue(b)) % 360;
  return d > 180 ? 360 - d : d;
}

function isHex(v: unknown): v is string {
  return typeof v === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
}

// ─── Fallback: the Linktree tokens Theme 6 shipped with ────────────────────

export const fallbackPalette: BrandPalette = {
  version: 1,
  mode: "light",
  archetype: "colorful",
  primary: "#D2E823",
  primaryHover: "#BCCF1E",
  secondary: "#E9C0E9",
  accent: "#E9C0E9",
  dark: "#471E67",
  onDark: "#FFFFFF",
  onPrimary: "#000000",
  pageBackground: "#F3F3F1",
  cardBackground: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceText: "#000000",
  text: "#000000",
  textMuted: "#676B5F",
  border: "#E7E7E3",
  chipBg: "#E9C0E9",
  chipText: "#000000",
  gradient: ["#D2E823", "#471E67"],
  heroButtonBg: "#000000",
  heroButtonText: "#FFFFFF",
};

// ─── Palette construction ───────────────────────────────────────────────────

export interface SwatchSet {
  vibrant: string | null;
  lightVibrant: string | null;
  darkVibrant: string | null;
  muted: string | null;
  lightMuted: string | null;
  darkMuted: string | null;
}

export interface LogoStats {
  /** Mean relative luminance of opaque pixels, 0..1. */
  meanLuminance: number;
  /** Mean saturation of opaque pixels, 0..1. */
  meanSaturation: number;
  /** Share of opaque pixels with luminance < 0.25. */
  darkShare: number;
  /** Share of opaque pixels with luminance > 0.75. */
  lightShare: number;
  /** Most populous dark colour (the logo's "ink"). */
  ink: string;
  /** Most populous light colour (or #FFFFFF when there is none). */
  light: string;
  /** Share of pixels that are opaque (0..1). */
  opaqueShare: number;
}

function pickPrimary(sw: SwatchSet): string | null {
  const candidates = [sw.vibrant, sw.darkVibrant, sw.muted, sw.lightVibrant];
  for (const c of candidates) {
    if (!c) continue;
    const lum = luminance(c);
    if (saturation(c) >= 0.3 && lum >= 0.12 && lum <= 0.88) return c;
  }
  return null;
}

function pickSecondary(sw: SwatchSet, primary: string): string | null {
  const candidates = [sw.lightVibrant, sw.muted, sw.darkVibrant, sw.vibrant];
  for (const c of candidates) {
    if (!c || c.toLowerCase() === primary.toLowerCase()) continue;
    if (saturation(c) >= 0.18 && hueDistance(c, primary) >= 18) return c;
  }
  for (const c of candidates) {
    if (c && c.toLowerCase() !== primary.toLowerCase()) return c;
  }
  return null;
}

function pickAccent(sw: SwatchSet, primary: string): string | null {
  const candidates = [sw.muted, sw.lightVibrant, sw.vibrant, sw.lightMuted];
  for (const c of candidates) {
    if (!c || c.toLowerCase() === primary.toLowerCase()) continue;
    if (saturation(c) >= 0.12 && hueDistance(c, primary) >= 12) return c;
  }
  return null;
}

/** Build the full design system from the extracted swatches + pixel stats. */
export function buildPalette(sw: SwatchSet, stats: LogoStats): BrandPalette {
  const mode: BrandMode = stats.meanLuminance < 0.34 ? "dark" : "light";
  const archetype: BrandArchetype =
    stats.meanSaturation < 0.12
      ? "monochrome"
      : mode === "dark"
        ? "dark"
        : stats.meanLuminance > 0.72
          ? "light"
          : "colorful";

  // Ink: the logo's own darkest populous colour; fall back to the darkest
  // swatch, then to a neutral ink.
  const ink =
    luminance(stats.ink) < 0.3
      ? stats.ink
      : (sw.darkMuted ?? sw.darkVibrant ?? "#1E2330");
  const light = luminance(stats.light) > 0.8 ? stats.light : "#FFFFFF";

  let primary = pickPrimary(sw);
  let secondary: string | null = null;
  let accent: string | null = null;

  if (primary) {
    secondary = pickSecondary(sw, primary);
    accent = pickAccent(sw, primary);
  } else {
    // Monochrome logo: no saturated colour exists. The brand *is* its
    // ink (light theme) or its paper (dark theme); accents stay neutral.
    primary = mode === "dark" ? light : ink;
    secondary = sw.muted ?? mix(primary, mode === "dark" ? "#000000" : "#FFFFFF", 0.35);
    accent = secondary;
  }
  secondary = secondary ?? sw.muted ?? primary;
  accent = accent ?? secondary;

  const dark = luminance(ink) < 0.25 ? ink : (sw.darkMuted ?? sw.darkVibrant ?? "#1E2330");

  // Page background: a whisper of the logo's lightest colour on white
  // (light theme), or the logo's own ink warmed by a hint of the brand
  // colour (dark theme).
  let pageBackground: string;
  if (mode === "light") {
    const lightest = sw.lightMuted ?? sw.lightVibrant ?? "#FFFFFF";
    pageBackground = mix(lightest, "#FFFFFF", 0.85);
    let guard = 0;
    while (luminance(pageBackground) < 0.9 && guard++ < 5) {
      pageBackground = mix(pageBackground, "#FFFFFF", 0.15);
    }
  } else {
    pageBackground = mix(ink, primary, 0.06);
    let guard = 0;
    while (luminance(pageBackground) > 0.07 && guard++ < 5) {
      pageBackground = mix(pageBackground, "#000000", 0.15);
    }
  }

  const cardBackground = mode === "light" ? "#FFFFFF" : mix(ink, "#FFFFFF", 0.06);
  const surface = mode === "light" ? "#FFFFFF" : mix(ink, "#FFFFFF", 0.1);
  const text = mode === "light" ? (luminance(ink) < 0.25 ? ink : "#1E2330") : light;
  const surfaceText = text;
  // Secondary text must stay readable (WCAG AA 4.5:1): start from a soft
  // mix, then walk it back toward the main text until it passes.
  let textMuted = mix(text, pageBackground, 0.42);
  let guard = 0;
  while (contrastRatio(textMuted, pageBackground) < 4.5 && guard++ < 8) {
    textMuted = mix(textMuted, text, 0.15);
  }
  const border =
    mode === "light"
      ? mix("#000000", pageBackground, 0.9)
      : mix("#FFFFFF", pageBackground, 0.86);

  let chipBg =
    mode === "light" ? mix(accent, "#FFFFFF", 0.68) : mix(accent, "#000000", 0.4);
  let chipText = bestTextOn(chipBg);
  guard = 0;
  while (contrastRatio(chipText, chipBg) < 4.5 && guard++ < 8) {
    chipBg = mix(chipBg, mode === "light" ? "#FFFFFF" : "#000000", 0.15);
    chipText = bestTextOn(chipBg);
  }

  const onPrimary = bestTextOn(primary);
  const onDark = bestTextOn(dark);

  // The button inside the hero must contrast with `primary`: black on a
  // light brand colour, white on a dark one — whichever measures better.
  const heroButtonBg =
    contrastRatio("#000000", primary) >= contrastRatio("#FFFFFF", primary)
      ? "#000000"
      : "#FFFFFF";
  const heroButtonText = heroButtonBg === "#000000" ? "#FFFFFF" : "#000000";

  const primaryHover = mode === "light" ? shade(primary, 0.1) : tint(primary, 0.12);

  return {
    version: 1,
    mode,
    archetype,
    primary,
    primaryHover,
    secondary,
    accent,
    dark,
    onDark,
    onPrimary,
    pageBackground,
    cardBackground,
    surface,
    surfaceText,
    text,
    textMuted,
    border,
    chipBg,
    chipText,
    gradient: [primary, secondary],
    heroButtonBg,
    heroButtonText,
    source: {
      logoLuminance: Number(stats.meanLuminance.toFixed(3)),
      logoSaturation: Number(stats.meanSaturation.toFixed(3)),
      generatedAt: new Date().toISOString(),
    },
  };
}

// ─── Reading a stored palette ───────────────────────────────────────────────

/** Parse a stored palette (JSON string, object, or nothing). Never throws. */
export function parseBrandPalette(value: unknown): BrandPalette | null {
  try {
    const raw =
      typeof value === "string" ? (JSON.parse(value) as unknown) : value;
    if (!raw || typeof raw !== "object") return null;
    const p = raw as Partial<BrandPalette>;
    if (p.version !== 1 || !isHex(p.primary)) return null;
    return { ...fallbackPalette, ...p, version: 1 };
  } catch {
    return null;
  }
}

/** The palette a card renders with: the business's own, or the Linktree fallback. */
export function resolveBrandPalette(business: {
  brandPalette?: string | unknown | null;
}): BrandPalette {
  return parseBrandPalette(business?.brandPalette) ?? fallbackPalette;
}
