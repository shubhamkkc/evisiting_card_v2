import { ArrowRight, QrCode, Share2, Smartphone, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const whatsappUrl =
    "https://wa.me/918252744799?text=Hi%2C%20I%20want%20to%20create%20a%20digital%20business%20card%20for%20my%20business.";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                EVisitingCard
              </span>
            </div>
            <div className="flex gap-4 items-center">
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
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-20 px-4 text-center overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              The future of networking is digital
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Create Your Digital <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Business Card</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium">
              Message us on WhatsApp and we will create your digital business card for you. No public self-signup, just direct support and fast setup.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg shadow-xl shadow-green-500/20 hover:bg-green-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Chat on WhatsApp <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/kanhaiya-lal-sons" className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-full font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-center">
                View Demos
              </Link>
            </div>
          </div>
          
          {/* Mock Graphic */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 bottom-0 top-1/2"></div>
            <div className="flex justify-center gap-8 items-end relative perspective-[1000px]">
              <div className="w-[280px] h-[580px] bg-slate-100 rounded-[2.5rem] p-2 border-[6px] border-slate-800 shadow-2xl rotate-[-5deg] translate-y-12">
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative shadow-inner">
                  {/* Mock Theme 1 */}
                  <div className="h-24 bg-blue-600"></div>
                  <div className="w-16 h-16 bg-white border-4 border-white rounded-full mx-auto -mt-8"></div>
                  <div className="mt-6 flex gap-2 justify-center px-4"><div className="w-8 h-8 rounded-full bg-blue-100"></div><div className="w-8 h-8 rounded-full bg-blue-100"></div><div className="w-8 h-8 rounded-full bg-blue-100"></div></div>
                  <div className="mt-6 space-y-2 px-6"><div className="h-3 bg-gray-100 rounded"></div><div className="h-3 bg-gray-100 rounded w-2/3"></div><div className="h-20 bg-gray-50 rounded-xl mt-4"></div></div>
                </div>
              </div>
              <div className="w-[320px] h-[640px] bg-slate-900 rounded-[2.5rem] p-2 border-[6px] border-slate-800 shadow-3xl z-20">
                <div className="w-full h-full bg-gray-950 rounded-[2rem] overflow-hidden relative shadow-inner">
                   {/* Mock Theme 2 */}
                   <div className="h-32 bg-gray-900"></div>
                  <div className="w-20 h-20 bg-gray-800 border-4 border-gray-950 rounded-full mx-auto -mt-10"></div>
                  <div className="mt-10 flex gap-3 justify-center px-4"><div className="w-12 h-12 rounded-full bg-blue-600/20"></div><div className="w-12 h-12 rounded-full bg-blue-600/20"></div><div className="w-12 h-12 rounded-full bg-blue-600/20"></div><div className="w-12 h-12 rounded-full bg-blue-600/20"></div></div>
                  <div className="mt-8 space-y-3 px-6"><div className="h-4 bg-gray-800 rounded"></div><div className="h-4 bg-gray-800 rounded w-3/4"></div><div className="h-32 bg-gray-800/50 rounded-2xl mt-6"></div></div>
                </div>
              </div>
              <div className="hidden sm:block w-[280px] h-[580px] bg-slate-100 rounded-[2.5rem] p-2 border-[6px] border-slate-800 shadow-2xl rotate-[5deg] translate-y-12">
              <div className="w-full h-full bg-gradient-to-b from-purple-50 to-white rounded-[2rem] overflow-hidden relative shadow-inner">
                  {/* Mock Theme 3 */}
                  <div className="h-24 bg-gradient-to-r from-purple-600 to-pink-500"></div>
                  <div className="w-16 h-16 bg-white border-4 border-white rounded-full mx-auto -mt-8"></div>
                  <div className="mt-6 flex gap-2 justify-center px-4"><div className="w-10 h-10 rounded-2xl bg-white shadow-sm"></div><div className="w-10 h-10 rounded-2xl bg-white shadow-sm"></div><div className="w-10 h-10 rounded-2xl bg-white shadow-sm"></div></div>
                  <div className="mt-6 space-y-2 px-6"><div className="h-3 bg-purple-100 rounded"></div><div className="h-3 bg-purple-100 rounded w-2/3"></div><div className="h-24 bg-white shadow-sm border border-purple-50 rounded-2xl mt-4"></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-gray-50 pb-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to network smartly</h2>
              <p className="text-gray-600 text-lg">Your digital card is a mini-website that stores your entire professional identity.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Smartphone className="text-blue-600 w-8 h-8" />, title: "Mobile Optimized", desc: "Designed to look and feel exactly like a native app on any smartphone screen." },
                { icon: <QrCode className="text-purple-600 w-8 h-8" />, title: "Custom QR Code", desc: "Instantly share your card physically with an auto-generated high-resolution QR." },
                { icon: <Share2 className="text-green-600 w-8 h-8" />, title: "One-Click Share", desc: "Send your card directly to WhatsApp, SMS, Email, or let them save your vCard." }
              ].map((f, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-[15px]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold">How it works</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-500 to-blue-100 z-0"></div>
              {[
                { step: "01", title: "Message on WhatsApp", desc: "Send us your business name, contact details, logo, and photos." },
                { step: "02", title: "We Build Your Card", desc: "We create the design, add your branding, and set up your custom card." },
                { step: "03", title: "Start Sharing", desc: "Once ready, you receive your live link and QR code to share instantly." }
              ].map((s, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-white border-8 border-gray-50 shadow-md flex items-center justify-center text-2xl font-black text-blue-600 mb-6">
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-gray-500 px-4">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-gray-950 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4 text-white">Simple, transparent pricing</h2>
              <p className="text-gray-400">Upgrade your networking game forever.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col">
                  <h3 className="text-2xl font-bold mb-2">Basic</h3>
                  <p className="text-gray-400 mb-6">Perfect for individuals</p>
                  <div className="text-4xl font-black mb-8">₹499<span className="text-lg text-gray-500 font-medium">/year</span></div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {['1 Custom Digital Card Link', 'All Contact Fields', 'Social Media Links', 'vCard Download', 'Dynamic QR Code'].map((c, i) => (
                      <li key={i} className="flex gap-3 text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 rounded-xl font-bold bg-green-600 hover:bg-green-700 transition block text-center"
                  >
                    Contact on WhatsApp
                  </Link>
               </div>
               <div className="bg-gradient-to-b from-blue-600 to-blue-900 border border-blue-500 rounded-3xl p-8 flex flex-col relative shadow-2xl shadow-blue-900/50 transform md:-translate-y-4">
                  <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                  <h3 className="text-2xl font-bold mb-2">Pro Business</h3>
                  <p className="text-blue-200 mb-6">For professionals & businesses</p>
                  <div className="text-4xl font-black mb-8">₹999<span className="text-lg text-blue-200 font-medium">/year</span></div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {['Everything in Basic', 'Product & Services Catalog', 'Image Gallery', 'Customer Enquiry Form', '3 Premium Themes', 'NFC Card Integration'].map((c, i) => (
                      <li key={i} className="flex gap-3 text-blue-50">
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 rounded-xl font-bold bg-white text-blue-900 hover:bg-gray-50 transition shadow-xl block text-center"
                  >
                    Contact on WhatsApp
                  </Link>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 font-medium">© {new Date().getFullYear()} EVisitingCard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
