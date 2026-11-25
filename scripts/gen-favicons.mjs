// Generate GrowX Digital Card favicon set from the GrowX logo mark:
// dark #150F23 rounded square + bold orange #FF7A00 "X" (legible at 16px).
// Writes to BOTH src/app/ and public/ (Next.js serves metadata files from src/app,
// public/ copies are the fallback / PWA source).
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const REPO = "/home/hatch/workspace/evisiting_card_v2";
const DESTS = [join(REPO, "src/app"), join(REPO, "public")];

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#150F23"/>
  <g fill="#FF7A00">
    <rect x="25" y="10" width="14" height="44" rx="7" transform="rotate(45 32 32)"/>
    <rect x="25" y="10" width="14" height="44" rx="7" transform="rotate(-45 32 32)"/>
  </g>
</svg>`;

async function png(size) {
  return sharp(Buffer.from(SVG)).resize(size, size).png().toBuffer();
}

// Minimal ICO writer: Vista+ ICO files may embed PNG data directly.
function buildIco(pngs) {
  // pngs: [{ size, buf }] sizes <= 255
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  const entries = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const parts = [header, entries];
  pngs.forEach((p, i) => {
    const e = entries.subarray(i * 16, i * 16 + 16);
    e[0] = p.size; // width (0 = 256)
    e[1] = p.size; // height
    e[2] = 0; // palette colours
    e[3] = 0; // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(p.buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += p.buf.length;
    parts.push(p.buf);
  });
  return Buffer.concat(parts);
}

const sizes = { 16: "favicon-16x16", 32: "favicon-32x32", 48: "favicon-48x48" };
const bufs = {};
for (const s of [16, 32, 48, 96, 180, 192, 512]) {
  bufs[s] = await png(s);
}
const ico = buildIco([16, 32, 48].map((s) => ({ size: s, buf: bufs[s] })));

for (const dest of DESTS) {
  mkdirSync(dest, { recursive: true });
  writeFileSync(join(dest, "favicon.svg"), SVG + "\n");
  writeFileSync(join(dest, "favicon-96x96.png"), bufs[96]);
  writeFileSync(join(dest, "apple-touch-icon.png"), bufs[180]);
  writeFileSync(join(dest, "web-app-manifest-192x192.png"), bufs[192]);
  writeFileSync(join(dest, "web-app-manifest-512x512.png"), bufs[512]);
  writeFileSync(join(dest, "favicon.ico"), ico);
  console.log("wrote favicon set to", dest);
}
console.log("ICO bytes:", ico.length);
