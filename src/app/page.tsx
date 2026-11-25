import { ArrowRight, QrCode, Share2, Smartphone, CheckCircle2, Palette, MessageCircle, Star, BadgePercent } from "lucide-react";
import Link from "next/link";
import AutoScrollingIframe from "@/components/AutoScrollingIframe";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "GrowX Digital Card",
  "url": "https://card.growxdigitech.com",
  "description": "Digital business card service by GrowX Digitech for businesses worldwide",
  "priceRange": "₹499/year or $9/year",
  "areaServed": "Worldwide",
  "serviceType": "Digital Business Card",
};

export default function Home() {
  const whatsappUrl =
    "https://wa.me/918252744799?text=Hi%2C%20I%20want%20to%20create%20a%20digital%20business%20card%20for%20my%20business.";

  return (
    <div className="min-h-screen bg-gx-night font-gx-body text-white">
      {/* Navbar — GrowX Digitech wordmark */}
      <nav className="sticky top-0 z-50 border-b border-gx-hairline bg-gx-night/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex flex-shrink-0 flex-col leading-none">
              <span className="font-gx-display text-xl font-bold tracking-tight sm:text-2xl">
                Grow<span className="text-gx-orange">X</span> Digital Card
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white/50">
                By GrowX Digitech
              </span>
            </div>
            <div className="flex items-center gap-4">
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
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="overflow-hidden px-4 pt-24 pb-20 text-center">
          <div className="mx-auto max-w-4xl">
            <p className="mb-8 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              <span className="relative flex size-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gx-orange opacity-60"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-gx-orange"></span>
              </span>
              Digital Visiting Card · By GrowX Digitech
            </p>
            <h1 className="mb-8 font-gx-display text-5xl font-bold tracking-tight md:text-7xl">
              Create Your{" "}
              <span className="inline-block rounded-md bg-gx-lime px-3 text-gx-night">Digital</span>{" "}
              <br className="hidden md:block" />
              Business Card
            </h1>
            <p className="mx-auto mb-4 max-w-2xl text-xl font-medium text-white/70">
              Message us on WhatsApp and we will create your digital business card for you. No public self-signup, just direct support and fast setup.
            </p>
            <p className="mx-auto mb-10 max-w-2xl text-base text-white/50">
              We create digital business cards for local businesses — electricians, photographers, CA firms, shops, and more, worldwide.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-gx-night shadow-xl transition-all hover:bg-gx-lime"
              >
                Chat on WhatsApp <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="#demos" className="flex items-center justify-center rounded-lg border border-white/10 bg-white/10 px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/20">
                View Demos
              </Link>
            </div>
          </div>

          {/* Mock Graphic */}
          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="relative flex flex-col items-center justify-center gap-12 perspective-[1000px] md:flex-row md:items-end md:gap-8">
              <Link href="/first-beat-studio" className="z-10 block h-[580px] w-full max-w-[280px] transform cursor-pointer rounded-[2.5rem] border-[6px] border-white/15 bg-gx-canvas p-2 shadow-2xl transition-all duration-300 hover:z-30 md:w-[280px] md:translate-y-12 md:rotate-[5deg] md:hover:rotate-1 md:hover:translate-y-6 md:hover:scale-105">
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white shadow-inner">
                  <AutoScrollingIframe src="/first-beat-studio" title="First Beat Studio Preview" />
                </div>
              </Link>
              <Link href="/snehaa-mehndi-art" className="z-10 block h-[580px] w-full max-w-[280px] transform cursor-pointer rounded-[2.5rem] border-[6px] border-white/15 bg-gx-canvas p-2 shadow-2xl transition-all duration-300 hover:z-30 md:w-[280px] md:translate-y-12 md:rotate-[-5deg] md:hover:-rotate-1 md:hover:translate-y-6 md:hover:scale-105">
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white shadow-inner">
                  <AutoScrollingIframe src="/snehaa-mehndi-art" title="Snehaa Mehndi Art Preview" />
                </div>
              </Link>
              <Link href="/kanhaiya-lal-sons" className="z-20 block h-[640px] w-full max-w-[320px] cursor-pointer rounded-[2.5rem] border-[6px] border-white/15 bg-gx-canvas p-2 shadow-2xl transition-all duration-300 hover:z-30 md:w-[320px] md:hover:-translate-y-4 md:hover:scale-105">
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white shadow-inner">
                  <AutoScrollingIframe src="/kanhaiya-lal-sons" title="Kanhaiya Lal & Sons Preview" />
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* Live Demos */}
        {/* <section id="demos" className="py-24 bg-gx-night">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-gx-hairline text-white/70 text-sm font-medium mb-4">
                <span className="flex h-2 w-2 rounded-full bg-gx-orange animate-pulse"></span>
                Live Examples
              </div>
              <h2 className="font-gx-display text-3xl md:text-4xl font-bold mb-4">See GrowX Digital Card in action</h2>
              <p className="text-white/70 text-lg">Check out these real digital business cards proudly powered by us.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Snehaa Mehndi Art", slug: "snehaa-mehndi-art", category: "Artist / Service", color: "from-pink-500 to-rose-500" },
                { name: "Kanhaiya Lal & Sons", slug: "kanhaiya-lal-sons", category: "Jewellery", color: "from-amber-500 to-orange-500" },
                { name: "Brothers Digital Dental Art", slug: "brothersdigitaldentalart", category: "Dental Clinic", color: "from-blue-500 to-cyan-500" }
              ].map((demo, i) => (
                <Link key={i} href={`/${demo.slug}`} className="group block overflow-hidden rounded-3xl border border-gx-hairline bg-gx-canvas shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`h-32 bg-gradient-to-r ${demo.color} relative`}>
                     <div className="absolute -bottom-8 left-6 w-16 h-16 bg-gx-night rounded-2xl shadow-md flex items-center justify-center border-4 border-gx-night overflow-hidden text-2xl font-black text-white/40">
                        {demo.name.charAt(0)}
                     </div>
                  </div>
                  <div className="pt-12 pb-8 px-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-gx-orange transition-colors">{demo.name}</h3>
                    <p className="text-white/60 mt-1">{demo.category}</p>
                    <div className="mt-6 flex items-center text-gx-orange font-medium text-sm group-hover:translate-x-1 transition-transform">
                      View Digital Card <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section> */}

        {/* Features */}
        <section className="bg-gx-canvas py-24 pb-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="mb-4 font-gx-display text-3xl font-bold">Everything you need to network smartly</h2>
              <p className="text-lg text-white/70">Your digital card is a mini-website that stores your entire professional identity.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: <Smartphone className="h-8 w-8 text-gx-orange" />, title: "Mobile Optimized", desc: "Designed to look and feel exactly like a native app on any smartphone screen." },
                { icon: <QrCode className="h-8 w-8 text-gx-violet" />, title: "Custom QR Code", desc: "Instantly share your card physically with an auto-generated high-resolution QR." },
                { icon: <Share2 className="h-8 w-8 text-gx-lime" />, title: "One-Click Share", desc: "Send your card directly to WhatsApp, SMS, Email, or let them save your vCard." }
              ].map((f, i) => (
                <div key={i} className="rounded-3xl border border-gx-hairline bg-gx-night p-8 shadow-sm transition-all hover:shadow-xl">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                    {f.icon}
                  </div>
                  <h3 className="mb-3 font-gx-display text-xl font-bold">{f.title}</h3>
                  <p className="text-[15px] leading-relaxed text-white/70">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why GrowX Digital Card */}
        <section className="border-t border-gx-hairline py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gx-hairline bg-white/5 px-3 py-1 text-sm font-medium text-white/70">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-gx-orange"></span>
                Why GrowX Digital Card
              </p>
              <h2 className="mb-4 font-gx-display text-3xl font-bold">Not another template. A card built around your business.</h2>
              <p className="text-lg text-white/70">Big card apps give you a form to fill. We give you a finished card — and four things they don&apos;t.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {[
                { icon: <Palette className="h-8 w-8 text-gx-orange" />, title: "Your logo sets the theme", desc: "Upload your logo and your card's colours are generated from it automatically. No template that looks like everyone else's — your card looks like your brand." },
                { icon: <MessageCircle className="h-8 w-8 text-gx-lime" />, title: "WhatsApp, done for you", desc: "We set up your WhatsApp button, enquiry form and contact links for you. You don't touch a single setting — message us and it's ready in 24 hours." },
                { icon: <Star className="h-8 w-8 text-gx-orange" />, title: "Google Review machine", desc: "Your QR code takes customers straight to your Google Review page. Every scan is a chance at another 5-star review — more reviews, more calls, no extra app." },
                { icon: <BadgePercent className="h-8 w-8 text-gx-lime" />, title: "₹499/year. That's it.", desc: "Big apps charge $6–8 every single month. One GrowX card costs ₹499 a year in India — about $9 a year anywhere else — with everything included. No monthly bill, ever." },
              ].map((f, i) => (
                <div key={i} className="rounded-3xl border border-gx-hairline bg-gx-canvas p-8 shadow-sm transition-all hover:shadow-xl">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                    {f.icon}
                  </div>
                  <h3 className="mb-3 font-gx-display text-xl font-bold">{f.title}</h3>
                  <p className="text-[15px] leading-relaxed text-white/70">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t border-gx-hairline py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-20 text-center">
              <h2 className="font-gx-display text-3xl font-bold">How it works</h2>
            </div>

            <div className="relative grid gap-12 md:grid-cols-3">
              <div className="absolute top-[60px] right-[15%] left-[15%] z-0 hidden h-0.5 bg-gradient-to-r from-gx-orange/10 via-gx-orange to-gx-orange/10 md:block"></div>
              {[
                { step: "01", title: "Message on WhatsApp", desc: "Send us your business name, contact details, logo, and photos." },
                { step: "02", title: "We Build Your Card", desc: "We create the design, add your branding, and set up your custom card." },
                { step: "03", title: "Start Sharing", desc: "Once ready, you receive your live link and QR code to share instantly." }
              ].map((s, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-8 border-gx-night bg-gx-canvas text-2xl font-black text-gx-orange shadow-md">
                    {s.step}
                  </div>
                  <h3 className="mb-3 font-gx-display text-xl font-bold">{s.title}</h3>
                  <p className="px-4 text-white/70">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-gx-canvas py-24 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="mb-4 font-gx-display text-3xl font-bold text-white">Simple, transparent pricing</h2>
              <p className="text-white/70">Upgrade your networking game forever.</p>
            </div>

            <div className="mx-auto max-w-lg">
               <div className="relative flex flex-col rounded-3xl border border-gx-hairline bg-gx-night p-8 shadow-2xl">
                  <div className="absolute top-0 right-8 -translate-y-1/2 transform rounded-full bg-gx-orange px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Most Popular</div>
                  <h3 className="mb-2 font-gx-display text-2xl font-bold">Standard</h3>
                  <p className="mb-6 text-white/70">Everything you need to grow your business</p>
                  <div className="mb-8 text-4xl font-black">₹499<span className="text-lg font-medium text-white/60">/year</span></div>
                  <p className="mb-8 -mt-4 text-sm text-white/60">Outside India: <span className="font-bold text-white">$9/year</span> — same card, same features.</p>
                  <ul className="mb-8 flex-1 space-y-4">
                    {[
                      '1 Custom Digital Card Link',
                      'All Contact Fields',
                      'Social Media Links',
                      'vCard Download',
                      'Dynamic QR Code',
                      'Product & Services Catalog (up to 10 services)',
                      'Image Gallery (up to 30 images)',
                      'Customer Enquiry Form',
                      'Premium Themes',
                      'NFC Card Integration'
                    ].map((c, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/85">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gx-lime" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-lg bg-white py-4 text-center font-bold uppercase tracking-wide text-gx-night shadow-xl transition hover:bg-gx-lime"
                  >
                    Contact on WhatsApp
                  </Link>
               </div>
            </div>
          </div>
        </section>
        {/* Compare */}
        <section className="border-t border-gx-hairline py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 font-gx-display text-3xl font-bold">How GrowX compares</h2>
              <p className="text-lg text-white/70">Same idea as the big apps. One flat yearly price — and the setup done for you.</p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-gx-hairline">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm sm:text-base">
                <thead>
                  <tr className="bg-gx-canvas text-white">
                    <th className="px-4 py-4 font-gx-display font-bold sm:px-6">What you get</th>
                    <th className="bg-gx-orange px-4 py-4 font-gx-display font-bold text-white sm:px-6">GrowX Digital Card</th>
                    <th className="px-4 py-4 font-gx-display font-bold sm:px-6">Blinq</th>
                    <th className="px-4 py-4 font-gx-display font-bold sm:px-6">HiHello</th>
                    <th className="px-4 py-4 font-gx-display font-bold sm:px-6">Popl</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr className="border-t border-gx-hairline">
                    <td className="px-4 py-4 font-semibold text-white sm:px-6">Price per year</td>
                    <td className="bg-gx-orange/10 px-4 py-4 font-bold text-white sm:px-6">₹499 / $9</td>
                    <td className="px-4 py-4 sm:px-6">From ~$88/yr (Premium, billed yearly)</td>
                    <td className="px-4 py-4 sm:px-6">From $72/yr (Professional, billed yearly)</td>
                    <td className="px-4 py-4 sm:px-6">From ~$77/yr (Pro, billed yearly)</td>
                  </tr>
                  <tr className="border-t border-gx-hairline bg-gx-canvas/50">
                    <td className="px-4 py-4 font-semibold text-white sm:px-6">Free tier</td>
                    <td className="bg-gx-orange/10 px-4 py-4 sm:px-6">One simple plan — no free tier</td>
                    <td className="px-4 py-4 sm:px-6">Yes — 2 cards</td>
                    <td className="px-4 py-4 sm:px-6">Yes — 2–4 cards</td>
                    <td className="px-4 py-4 sm:px-6">Yes — 1 card</td>
                  </tr>
                  <tr className="border-t border-gx-hairline">
                    <td className="px-4 py-4 font-semibold text-white sm:px-6">Card colours from your logo</td>
                    <td className="bg-gx-orange/10 px-4 py-4 font-bold text-white sm:px-6">Yes — automatic</td>
                    <td className="px-4 py-4 sm:px-6">Manual colours (Premium)</td>
                    <td className="px-4 py-4 sm:px-6">Custom colours &amp; fonts (Professional)</td>
                    <td className="px-4 py-4 sm:px-6">Manual branding (Pro+)</td>
                  </tr>
                  <tr className="border-t border-gx-hairline bg-gx-canvas/50">
                    <td className="px-4 py-4 font-semibold text-white sm:px-6">WhatsApp setup</td>
                    <td className="bg-gx-orange/10 px-4 py-4 font-bold text-white sm:px-6">Done for you</td>
                    <td className="px-4 py-4 sm:px-6">DIY — you set it up</td>
                    <td className="px-4 py-4 sm:px-6">DIY — you set it up</td>
                    <td className="px-4 py-4 sm:px-6">DIY — you set it up</td>
                  </tr>
                  <tr className="border-t border-gx-hairline">
                    <td className="px-4 py-4 font-semibold text-white sm:px-6">Google Review QR</td>
                    <td className="bg-gx-orange/10 px-4 py-4 font-bold text-white sm:px-6">Yes — QR goes straight to your review page</td>
                    <td className="px-4 py-4 sm:px-6">Not listed</td>
                    <td className="px-4 py-4 sm:px-6">Not listed</td>
                    <td className="px-4 py-4 sm:px-6">Not listed</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-center text-sm text-white/50">
              Competitor prices from their public pricing pages, checked November 2026 — they change. GrowX price is flat: ₹499/year in India, $9/year anywhere else. Indian options like QRCodeChimp and BizDuniya focus on QR codes; GrowX gives you the full card, your branding, and the setup done for you.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-gx-hairline bg-gx-night py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="font-medium text-white/50">© {new Date().getFullYear()} GrowX Digital Card. All rights reserved.</p>
          <p className="mt-2 text-sm text-white/50">
            A product of{" "}
            <Link href="https://growxdigitech.com" target="_blank" rel="noreferrer" className="font-semibold text-gx-orange hover:underline">
              GrowX Digitech
            </Link>
          </p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
