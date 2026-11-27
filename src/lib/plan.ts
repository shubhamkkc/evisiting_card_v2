// Free vs Paid plan limits for GrowX Digital Card.
//
// Paid = ₹499/year (India) / $9/year (outside India) — "everything included"
// on the homepage. Free = a minimal trial card so people can try it before
// paying (same idea as vkardz.com's free tier). Free limits set by the user
// 27 Nov 2026: Theme 1 only, 1 service, 2 gallery images, 2 social links,
// no cover photo, no Google Review widget.
//
// Single source of truth: the owner API enforces these server-side, the
// owner edit form uses them for its caps / locked fields, and the admin
// form uses them only as a reference (admins set `plan` per business).
//
// No DB change needed: Business.plan already exists ("free" default, or
// "paid"). A business with no / unknown plan is treated as free.
//
// Grandfathering: the API only blocks *adding* beyond a free limit. A
// business that already has e.g. 10 services keeps showing them, and can
// still save while trimming down — it just can't add an 11th, or switch to
// another paid theme, or newly add a cover photo / review widget. This
// keeps the live demo cards (demo-dentist, demo-photographer) intact.

export type PlanName = "free" | "paid";

export type PlanLimits = {
  plan: PlanName;
  /** Themes the plan may use. Free = Theme 1 only (the self-serve default). */
  themes: string[];
  maxServices: number;
  maxGallery: number;
  /** Infinity = no cap. */
  maxSocialLinks: number;
  /** Cover photo upload. */
  coverPhoto: boolean;
  /** Third-party Google Review widget code. */
  googleReviewWidget: boolean;
};

// Paid gets every theme in this list — so when a new theme is added here,
// paid users get it automatically too. That's why the homepage says
// "All themes (6+)" instead of a fixed number.
export const ALL_THEMES = ["theme1", "theme2", "theme3", "theme4", "theme5", "theme6"];

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  free: {
    plan: "free",
    themes: ["theme1"],
    maxServices: 1,
    maxGallery: 2,
    maxSocialLinks: 2,
    coverPhoto: false,
    googleReviewWidget: false,
  },
  paid: {
    plan: "paid",
    themes: ALL_THEMES,
    maxServices: 10,
    maxGallery: 30,
    maxSocialLinks: Infinity,
    coverPhoto: true,
    googleReviewWidget: true,
  },
};

export function normalizePlan(plan: unknown): PlanName {
  return plan === "paid" ? "paid" : "free";
}

export function isPaidPlan(plan: unknown): boolean {
  return normalizePlan(plan) === "paid";
}

export function getPlanLimits(plan: unknown): PlanLimits {
  return PLAN_LIMITS[normalizePlan(plan)];
}

/** Parse a JSON-encoded array field (services / gallery / socialLinks). */
export function parseJsonArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      // Social links are sometimes stored as an object { platform: url }.
      if (parsed && typeof parsed === "object") return Object.values(parsed).filter(Boolean);
    } catch {
      return [];
    }
  }
  if (value && typeof value === "object") return Object.values(value).filter(Boolean);
  return [];
}
