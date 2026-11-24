// ─── Logo → palette extraction (server-only) ────────────────────────────────
// Uses node-vibrant for the semantic swatches and sharp for the pixel
// statistics Vibrant cannot see (mean luminance, dark/light share, the
// logo's own ink and paper colours, transparency handling). Imported only
// by API routes — never by client components.

import Vibrant from "node-vibrant";
import sharp from "sharp";
import {
  buildPalette,
  type BrandPalette,
  type LogoStats,
  type SwatchSet,
} from "./brand";
import { hexToRgb, rgbToHex } from "./brand";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Pixel statistics from the logo: luminance, saturation, ink/paper. */
async function analyzePixels(buffer: Buffer): Promise<LogoStats> {
  const { data, info } = await sharp(buffer)
    .resize(64, 64, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const total = info.width * info.height;
  let opaque = 0;
  let lumSum = 0;
  let satSum = 0;
  let dark = 0;
  let light = 0;
  // 4-bit-per-channel buckets: the most populous bucket ≈ the flat colour.
  const buckets = new Map<number, number>();
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 128) continue; // transparent pixel: not part of the logo
    opaque++;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const sat = mx === 0 ? 0 : (mx - mn) / mx;
    lumSum += lum;
    satSum += sat;
    if (lum < 0.25) dark++;
    else if (lum > 0.75) light++;
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const n = Math.max(1, opaque);
  const bucketHex = (key: number): string => {
    const r = ((key >> 8) & 15) * 17;
    const g = ((key >> 4) & 15) * 17;
    const b = (key & 15) * 17;
    return rgbToHex(r, g, b);
  };
  const lumOf = (key: number): number => {
    const [r, g, b] = hexToRgb(bucketHex(key));
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  };

  // Ink = most populous dark bucket; paper = most populous light bucket.
  let inkKey: number | null = null;
  let inkCount = -1;
  let lightKey: number | null = null;
  let lightCount = -1;
  for (const [key, count] of buckets) {
    const lum = lumOf(key);
    if (lum < 0.3 && count > inkCount) {
      inkKey = key;
      inkCount = count;
    }
    if (lum > 0.8 && count > lightCount) {
      lightKey = key;
      lightCount = count;
    }
  }

  return {
    meanLuminance: lumSum / n,
    meanSaturation: satSum / n,
    darkShare: dark / n,
    lightShare: light / n,
    ink: inkKey !== null ? bucketHex(inkKey) : "#1E2330",
    light: lightKey !== null ? bucketHex(lightKey) : "#FFFFFF",
    opaqueShare: opaque / Math.max(1, total),
  };
}

/** Extract the full brand palette from raw image bytes (PNG/JPG/WebP). */
export async function extractBrandFromBuffer(
  buffer: Buffer
): Promise<BrandPalette> {
  if (!buffer || buffer.length === 0) {
    throw new Error("Empty image");
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error("Image too large (max 8 MB)");
  }

  const [palette, stats] = await Promise.all([
    Vibrant.from(buffer).getPalette(),
    analyzePixels(buffer),
  ]);

  const hex = (s: { getHex: () => string } | null | undefined) =>
    s ? s.getHex() : null;
  const swatches: SwatchSet = {
    vibrant: hex(palette.Vibrant),
    lightVibrant: hex(palette.LightVibrant),
    darkVibrant: hex(palette.DarkVibrant),
    muted: hex(palette.Muted),
    lightMuted: hex(palette.LightMuted),
    darkMuted: hex(palette.DarkMuted),
  };

  return buildPalette(swatches, stats);
}

/** Fetch a logo by URL (10s timeout, image-only, max 8 MB) and extract. */
export async function extractBrandFromUrl(url: string): Promise<BrandPalette> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid logo URL");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Logo URL must be http(s)");
  }

  const res = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: { Accept: "image/*" },
  });
  if (!res.ok) {
    throw new Error(`Could not fetch logo (HTTP ${res.status})`);
  }
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    throw new Error("Logo URL did not return an image");
  }
  const length = Number(res.headers.get("content-length") ?? 0);
  if (length > MAX_IMAGE_BYTES) {
    throw new Error("Image too large (max 8 MB)");
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return extractBrandFromBuffer(buf);
}
