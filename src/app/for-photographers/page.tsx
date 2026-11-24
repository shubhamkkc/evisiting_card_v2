import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, Image, Share2, Link2 } from "lucide-react";
import AutoScrollingIframe from "@/components/AutoScrollingIframe";

export const metadata: Metadata = {
  title: "Digital Business Card for Photographers India | GrowX Digital Card",
  description:
    "Digital visiting card for photographers and studios across India. Show your portfolio, gallery & contact in one link. Starting ₹499/year.",
  keywords: [
    "digital business card for photographers India",
    "photographer digital visiting card",
    "photography studio card online",
    "portfolio link for photographers",
    "digital card photographer India",
  ],
  alternates: {
    canonical: "https://card.growxdigitech.com/for-photographers",
  },
  openGraph: {
    title: "Digital Business Card for Photographers India | GrowX Digital Card",
    description:
      "Digital visiting card for photographers and studios across India. Show your portfolio, gallery & contact in one link. Starting ₹499/year.",
    url: "https://card.growxdigitech.com/for-photographers",
    type: "website",
  },
};

const whatsappUrl =
  "https://wa.me/918252744799?text=Hi%2C%20I%20am%20a%20photographer%20and%20want%20a%20digital%20business%20card%20for%20my%20studio.";

const features = [
  {
    icon: <Camera className="h-7 w-7 text-gx-orange" />,
    title: "Showcase Your Work",
    desc: "Upload your best shots to a stunning gallery that clients can browse right from their phones.",
  },
  {
    icon: <Image className="h-7 w-7 text-gx-violet" />,
    title: "Portfolio in Your Pocket",
    desc: "Your entire portfolio — portraits, weddings, events — organized and shareable in seconds.",
  },
  {
    icon: <Share2 className="h-7 w-7 text-gx-lime" />,
    title: "One Link, Everything",
    desc: "Share one link on Instagram, WhatsApp, or in-person via QR. Clients land on your full profile.",
  },
  {
    icon: <Link2 className="h-7 w-7 text-gx-orange" />,
    title: "Social Media Integration",
    desc: "Connect your Instagram, YouTube, Facebook — all neatly linked from a single digital card.",
  },
];

export default function ForPhotographersPage() {
  return (
    <div className="min-h-screen bg-gx-night font-gx-body text-white">
      {/* Navbar — GrowX Digitech wordmark */}
      <nav className="sticky top-0 z-50 border-b border-gx-hairline bg-gx-night/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex flex-col leading-none">
              <span className="font-gx-display text-xl font-bold tracking-tight sm:text-2xl">
                Grow<span className="text-gx-orange">X</span> Digital Card
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white/50">
                By GrowX Digitech
              </span>
            </Link>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-gx-night rounded-lg shadow-sm transition-colors hover:bg-gx-lime sm:px-4 sm:text-sm"
            >
              Chat on WhatsApp
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="overflow-hidden px-4 pt-20 pb-16 text-center">
          <div className="mx-auto max-w-4xl">
            <p className="mb-8 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              <span className="relative flex size-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gx-orange opacity-60"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-gx-orange"></span>
              </span>
              Built for photographers &amp; studios across India
            </p>

            <h1 className="mb-6 font-gx-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Digital Business Card for{" "}
              <span className="inline-block rounded-md bg-gx-lime px-3 text-gx-night">Photographers</span>{" "}
              in India
            </h1>

            <p className="mx-auto mb-4 max-w-2xl text-xl font-medium text-white/70">
              Share your portfolio, gallery, contact, and social links — all in one link.
            </p>
            <p className="mx-auto mb-10 max-w-xl text-base text-white/50">
              We design and set up your card in 24 hours. Starting at just ₹499/year.
            </p>

            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-gx-night shadow-xl transition-all hover:bg-gx-lime"
            >
              Get My Photographer Card <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Live Demo */}
        <section className="bg-gx-canvas px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gx-hairline bg-white/5 px-3 py-1 text-sm font-medium text-white/70">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-gx-orange"></span>
                Live Example
              </p>
              <h2 className="mb-3 font-gx-display text-3xl font-bold md:text-4xl">
                See it in action — First Beat Studio
              </h2>
              <p className="mx-auto max-w-xl text-lg text-white/70">
                A photography studio already using GrowX Digital Card. Their entire profile, gallery, and contact — in one shareable link.
              </p>
            </div>

            <div className="flex justify-center">
              <Link
                href="/first-beat-studio"
                className="block h-[600px] w-full max-w-[300px] cursor-pointer rounded-[2.5rem] border-[6px] border-white/15 bg-gx-canvas p-2 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
              >
                <div className="h-full w-full overflow-hidden rounded-[2rem] bg-white shadow-inner">
                  <AutoScrollingIframe
                    src="/first-beat-studio"
                    title="First Beat Studio — Digital Business Card Preview"
                  />
                </div>
              </Link>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/first-beat-studio"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gx-orange hover:underline"
              >
                View Full Card <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2 className="mb-4 font-gx-display text-3xl font-bold md:text-4xl">
                Why photographers love GrowX Digital Card
              </h2>
              <p className="mx-auto max-w-xl text-lg text-white/70">
                Everything a photographer needs — nothing they don&apos;t.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-gx-hairline bg-gx-canvas p-7 shadow-sm transition-all hover:shadow-xl"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                    {f.icon}
                  </div>
                  <h3 className="mb-2 font-gx-display text-lg font-bold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="border-y border-gx-hairline bg-gx-canvas px-4 py-20 text-center text-white">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 font-gx-display text-3xl font-bold md:text-4xl">
              Ready to grow your photography business?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-white/70">
              Message us on WhatsApp. We&apos;ll set up your digital card in 24 hours — starting at just ₹499/year.
            </p>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-gx-night shadow-xl transition-all hover:bg-gx-lime"
            >
              Get Started on WhatsApp <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gx-hairline bg-gx-night py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} GrowX Digital Card. Digital business cards for photographers across India.
          </p>
          <p className="mt-2 text-sm text-white/50">
            A product of{" "}
            <Link href="https://growxdigitech.com" target="_blank" rel="noreferrer" className="font-semibold text-gx-orange hover:underline">
              GrowX Digitech
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
