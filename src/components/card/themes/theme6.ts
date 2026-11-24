// ─── Theme 6 — Linktree ─────────────────────────────────────────────────────
// Design tokens taken from the Linktree DESIGN.md (OpenDesignMD, MIT licensed):
// "How linktr.ee is designed" — linktr.ee design system reference.
// That guide covers the Linktree marketing site; this theme adapts its tokens
// to the single-column link-in-bio profile layout Linktree profiles use.
// NOTE: Link Sans is a commercial font (Average Type Service) — verify its
// licence before production use. Theme 6 therefore ships NO webfont download
// and uses a system-ui stack with the same weights / sizes / tracking, so the
// page stays fast on 2G/3G and never render-blocks on a font request.
export const theme6 = {
  isTheme6: true, // Marker for the dedicated Theme6Card renderer (see BusinessCard)
  container: "bg-[#F3F3F1] text-[#000000] font-[Link_Sans,system-ui,-apple-system,'Segoe_UI',Roboto,Arial,sans-serif]",
  headerBg: "bg-[#F3F3F1]",
  accentText: "text-[#061492]",
  accentBg: "bg-[#D2E823] text-[#000000] shadow-none",
  cardBg: "bg-white border border-black/5 shadow-none",
  iconBg: "bg-[#000000] text-white",
  buttonOutline: "border border-[#000000] text-[#000000] hover:bg-black/5",
  badge: "bg-[#E9C0E9] text-[#000000] border border-transparent",
  typography: {
    heading: "font-bold text-[#000000]",
    description: "text-[#676B5F] leading-relaxed",
    meta: "text-[#676B5F]",
    sectionTitle: "text-[28px] font-medium tracking-[-0.01em] text-[#000000]",
  },
  // Raw Linktree tokens (DESIGN.md) for use inside Theme6Card.
  tokens: {
    ink: "#000000",
    inkDeep: "#1E2330",
    inkNavy: "#061492",
    canvas: "#FFFFFF",
    canvasWarm: "#F3F3F1",
    surface: "#EFF0EC",
    surfaceLime: "#D2E823",
    surfaceLavender: "#E9C0E9",
    surfaceMint: "#E0E2D9",
    accentPurple: "#471E67",
    accentPurpleDeep: "#502274",
    accentTeal: "#254F1A",
    accentBlue: "#2665D6",
    accentRose: "#B69FAF",
    muted: "#676B5F",
  },
};
