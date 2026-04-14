import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, Image, Share2, Link2 } from "lucide-react";
import AutoScrollingIframe from "@/components/AutoScrollingIframe";

export const metadata: Metadata = {
  title: "Digital Business Card for Photographers India | EVisitingCard",
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
    canonical: "https://evistingcard.shop/for-photographers",
  },
  openGraph: {
    title: "Digital Business Card for Photographers India | EVisitingCard",
    description:
      "Digital visiting card for photographers and studios across India. Show your portfolio, gallery & contact in one link. Starting ₹499/year.",
    url: "https://evistingcard.shop/for-photographers",
    type: "website",
  },
};

const whatsappUrl =
  "https://wa.me/918252744799?text=Hi%2C%20I%20am%20a%20photographer%20and%20want%20a%20digital%20business%20card%20for%20my%20studio.";

const features = [
  {
    icon: <Camera className="w-7 h-7 text-purple-500" />,
    title: "Showcase Your Work",
    desc: "Upload your best shots to a stunning gallery that clients can browse right from their phones.",
  },
  {
    icon: <Image className="w-7 h-7 text-blue-500" />,
    title: "Portfolio in Your Pocket",
    desc: "Your entire portfolio — portraits, weddings, events — organized and shareable in seconds.",
  },
  {
    icon: <Share2 className="w-7 h-7 text-green-500" />,
    title: "One Link, Everything",
    desc: "Share one link on Instagram, WhatsApp, or in-person via QR. Clients land on your full profile.",
  },
  {
    icon: <Link2 className="w-7 h-7 text-pink-500" />,
    title: "Social Media Integration",
    desc: "Connect your Instagram, YouTube, Facebook — all neatly linked from a single digital card.",
  },
];

export default function ForPhotographersPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              EVisitingCard
            </Link>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-full shadow-sm shadow-green-500/30 hover:bg-green-700 transition-colors"
            >
              Chat on WhatsApp
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="pt-20 pb-16 px-4 text-center bg-gradient-to-b from-purple-50 via-white to-white overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
              Built for photographers &amp; studios across India
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Digital Business Card for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                Photographers
              </span>{" "}
              in India
            </h1>

            <p className="text-xl text-gray-500 mb-4 max-w-2xl mx-auto font-medium">
              Share your portfolio, gallery, contact, and social links — all in one link.
            </p>
            <p className="text-base text-gray-400 mb-10 max-w-xl mx-auto">
              We design and set up your card in 24 hours. Starting at just ₹499/year.
            </p>

            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg shadow-xl shadow-green-500/20 hover:bg-green-700 hover:-translate-y-1 transition-all"
            >
              Get My Photographer Card <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Live Demo */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-600 text-sm font-medium mb-4">
                <span className="flex h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
                Live Example
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                See it in action — First Beat Studio
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                A photography studio already using EVisitingCard. Their entire profile, gallery, and contact — in one shareable link.
              </p>
            </div>

            <div className="flex justify-center">
              <Link
                href="https://evistingcard.shop/first-beat-studio"
                target="_blank"
                rel="noreferrer"
                className="block w-full max-w-[300px] h-[600px] bg-slate-900 rounded-[2.5rem] p-2 border-[6px] border-slate-800 shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden shadow-inner">
                  <AutoScrollingIframe
                    src="https://evistingcard.shop/first-beat-studio"
                    title="First Beat Studio — Digital Business Card Preview"
                  />
                </div>
              </Link>
            </div>

            <div className="text-center mt-8">
              <Link
                href="https://evistingcard.shop/first-beat-studio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:underline text-sm"
              >
                View Full Card <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why photographers love EVisitingCard
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Everything a photographer needs — nothing they don&apos;t.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-100 transition-all"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-5">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to grow your photography business?
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-xl mx-auto">
              Message us on WhatsApp. We&apos;ll set up your digital card in 24 hours — starting at just ₹499/year.
            </p>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-full font-bold text-lg shadow-xl hover:bg-gray-50 hover:-translate-y-1 transition-all"
            >
              Get Started on WhatsApp <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EVisitingCard. Digital business cards for photographers across India.
          </p>
        </div>
      </footer>
    </div>
  );
}
