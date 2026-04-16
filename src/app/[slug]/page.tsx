import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import BusinessCard from "@/components/card/BusinessCard";
import { Metadata } from "next";
import Link from "next/link";
import { Edit3 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Category → Schema.org @type mapping ──────────────────────────────────────

const CATEGORY_SCHEMA_TYPE: Record<string, string> = {
  photographer: "Photographer",
  photography: "Photographer",
  lawyer: "LegalService",
  legal: "LegalService",
  advocate: "LegalService",
  doctor: "Physician",
  clinic: "MedicalClinic",
  hospital: "Hospital",
  dentist: "Dentist",
  salon: "BeautySalon",
  beauty: "BeautySalon",
  spa: "DaySpa",
  gym: "ExerciseGym",
  fitness: "ExerciseGym",
  yoga: "SportsActivityLocation",
  restaurant: "Restaurant",
  cafe: "CafeOrCoffeeShop",
  hotel: "Hotel",
  caterer: "FoodEstablishment",
  catering: "FoodEstablishment",
  real_estate: "RealEstateAgent",
  realty: "RealEstateAgent",
  property: "RealEstateAgent",
  architect: "ProfessionalService",
  interior: "HomeAndConstructionBusiness",
  interior_design: "HomeAndConstructionBusiness",
  construction: "HomeAndConstructionBusiness",
  contractor: "HomeAndConstructionBusiness",
  electrician: "Electrician",
  plumber: "Plumber",
  ca: "AccountingService",
  chartered_accountant: "AccountingService",
  accountant: "AccountingService",
  financial: "FinancialService",
  insurance: "InsuranceAgency",
  travel: "TravelAgency",
  tour: "TravelAgency",
  event: "EventPlanner",
  events: "EventPlanner",
  wedding: "WeddingVenue",
  florist: "Florist",
  bakery: "Bakery",
  jewelry: "JewelryStore",
  jewellery: "JewelryStore",
  clothing: "ClothingStore",
  fashion: "ClothingStore",
  electronics: "ElectronicsStore",
  automobile: "AutoDealer",
  car: "AutoDealer",
  vehicle: "AutoDealer",
  mechanic: "AutoRepair",
  garage: "AutoRepair",
  it: "ProfessionalService",
  software: "ProfessionalService",
  web: "ProfessionalService",
  digital: "ProfessionalService",
  marketing: "ProfessionalService",
  ngo: "NGO",
  charity: "NGO",
  school: "School",
  college: "CollegeOrUniversity",
  coaching: "EducationalOrganization",
  training: "EducationalOrganization",
  physiotherapy: "PhysicalTherapy",
  veterinary: "VeterinaryCare",
  pet: "PetStore",
};

function resolveSchemaType(category?: string | null): string {
  if (!category) return "LocalBusiness";
  const key = category.toLowerCase().replace(/\s+/g, "_");
  // Check for exact key, then partial match
  if (CATEGORY_SCHEMA_TYPE[key]) return CATEGORY_SCHEMA_TYPE[key];
  for (const [k, v] of Object.entries(CATEGORY_SCHEMA_TYPE)) {
    if (key.includes(k)) return v;
  }
  return "LocalBusiness";
}

// ─── Address helpers ──────────────────────────────────────────────────────────

function parseAddress(address?: string | null) {
  if (!address) return null;
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  // Heuristic: last part = country (or state), second-last = city, rest = street
  const total = parts.length;
  return {
    streetAddress: parts.slice(0, Math.max(1, total - 2)).join(", "),
    addressLocality: parts[total - 2] ?? "",
    addressRegion: parts[total - 1] ?? "",
    postalCode:
      parts.find((p) => /^\d{6}$/.test(p)) ??
      parts.find((p) => /^\d{5,6}$/.test(p)) ??
      "",
    addressCountry: "IN",
  };
}

function extractCity(address?: string | null): string {
  if (!address) return "";
  const parts = address.split(",").map((p) => p.trim());
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0] ?? "";
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({ where: { slug } });

  if (!business) {
    return { title: "Not Found" };
  }

  const city = extractCity(business.address);
  const area =
    business.address?.split(",")?.slice(0, 1)[0]?.trim() ?? "";

  // Parse first service name for description
  let mainService = "";
  try {
    const svcs =
      business.services && typeof business.services === "string"
        ? JSON.parse(business.services)
        : business.services || [];
    mainService = svcs[0]?.title ?? svcs[0]?.name ?? "";
  } catch {}

  // ── Titles & Descriptions ────────────────────────────────────────────────
  const title = business.category && city
    ? `${business.businessName} | ${business.category} in ${city}`
    : `${business.businessName} — Digital Business Card | EVisitingCard`;

  const description =
    business.category && city
      ? `${business.businessName}, ${area} ${city} mein professional ${business.category} services.${mainService ? ` ${mainService} packages available.` : ""} Enquiry karein.`
      : `View ${business.businessName}'s digital visiting card. Contact details, services, gallery and more. Powered by EVisitingCard.`;

  const cardUrl = `https://evistingcard.shop/${slug}`;
  const ogImage = business.coverPhoto || business.logo || null;

  return {
    title,
    description,
    manifest: `/api/${slug}/manifest`,
    alternates: {
      canonical: cardUrl,
    },
    icons: {
      icon: business.logo || "/favicon.ico",
      apple: business.logo || "/favicon.ico",
    },
    openGraph: {
      title,
      description,
      url: cardUrl,
      type: "website",
      siteName: "EVisitingCard",
      locale: "en_IN",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: `${business.businessName} — Digital Business Card`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
      creator: "@evistingcard",
      site: "@evistingcard",
    },
  };
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function CardPage({ params }: Props) {
  const { slug } = await params;

  const [business, session] = await Promise.all([
    prisma.business.findFirst({ where: { slug, isActive: true } }),
    getServerSession(authOptions),
  ]);

  if (!business) {
    notFound();
  }

  const isOwner =
    (session?.user as any)?.role === "owner" &&
    (session?.user as any)?.businessId === business.id;
  const isAdmin = (session?.user as any)?.role === "admin";

  // ── JSON-LD data ──────────────────────────────────────────────────────────
  const cardUrl = `https://evistingcard.shop/${slug}`;
  const schemaType = resolveSchemaType(business.category);
  const addr = parseAddress(business.address);

  // Build opening hours from any future field; currently null-safe
  const openingHours: string[] = [];

  // Parse services for offers
  let servicesArr: any[] = [];
  try {
    servicesArr =
      business.services && typeof business.services === "string"
        ? JSON.parse(business.services)
        : business.services || [];
  } catch {}

  const priceRange =
    servicesArr.length > 0
      ? (() => {
          const prices = servicesArr
            .map((s: any) => parseInt(s.price ?? ""))
            .filter((n: number) => !isNaN(n));
          if (prices.length === 0) return undefined;
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          return min === max ? `₹${min}` : `₹${min}–₹${max}`;
        })()
      : undefined;

  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaType === "LocalBusiness" ? "LocalBusiness" : ["LocalBusiness", schemaType],
    name: business.businessName,
    description:
      business.about ||
      `${business.businessName} — professional ${business.category ?? "services"} provider.`,
    url: cardUrl,
    telephone: business.phone,
    ...(business.email ? { email: business.email } : {}),
    ...(business.website ? { sameAs: [business.website] } : {}),
    ...(business.logo ? { logo: business.logo, image: business.coverPhoto || business.logo } : {}),
    ...(priceRange ? { priceRange } : {}),
    ...(openingHours.length ? { openingHours } : {}),
    ...(addr
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: addr.streetAddress,
            addressLocality: addr.addressLocality,
            addressRegion: addr.addressRegion,
            postalCode: addr.postalCode,
            addressCountry: addr.addressCountry,
          },
        }
      : {}),
    ...(business.category
      ? {
          knowsAbout: business.category,
        }
      : {}),
  };

  // Offers from services
  if (servicesArr.length > 0) {
    jsonLd.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: servicesArr.map((svc: any, idx: number) => ({
        "@type": "Offer",
        position: idx + 1,
        itemOffered: {
          "@type": "Service",
          name: svc.title ?? svc.name ?? `Service ${idx + 1}`,
          ...(svc.description ? { description: svc.description } : {}),
        },
        ...(svc.price ? { price: svc.price, priceCurrency: "INR" } : {}),
      })),
    };
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pb-20">
      {/* JSON-LD LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="w-full max-w-[430px] bg-white min-h-screen relative shadow-2xl overflow-hidden">
        <BusinessCard business={business as any} />

        {/* Floating Edit Button — visible to owner of this card or admin */}
        {(isOwner || isAdmin) && (
          <Link
            href={isAdmin ? `/admin/businesses/${business.id}/edit` : "/owner/edit"}
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: isAdmin
                ? "linear-gradient(135deg, #f59e0b, #ef4444)"
                : "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
              color: "white",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "14px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              zIndex: 9999,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <Edit3 style={{ width: "16px", height: "16px" }} />
            {isAdmin ? "Admin: Edit Card" : "Edit My Card"}
          </Link>
        )}
      </main>
    </div>
  );
}
