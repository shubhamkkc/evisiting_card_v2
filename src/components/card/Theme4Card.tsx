"use client"
import { useState, useEffect, useRef } from "react"
import { motion, Variants, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Twitter, 
  Globe, 
  MessageCircle, 
  Send, 
  Music, 
  Ghost,
  Link as LinkIcon,
  Star,
  Home,
  Info,
  ShoppingBag,
  Image as ImageIcon,
  Download,
  X
} from "lucide-react"
import NextImage from "next/image"

// Using any for variants to bypass complex Framer Motion type resolution issues with functional variants
const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1], 
      delay: i * 0.1 
    }
  })
}

interface Business {
  id: string;
  slug: string;
  businessName: string;
  ownerName?: string | null;
  designation?: string | null;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  googleMapsUrl?: string | null;
  logo?: string | null;
  coverPhoto?: string | null;
  about?: string | null;
  category?: string | null;
  yearEstd?: string | null;
  socialLinks?: any;
  services?: any;
  gallery?: any;
  theme: string;
  themeColor?: string | null;
  googleReviewWidget?: string | null;
}

export default function Theme4Card({ business }: { business: Business }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const reviewRef = useRef<HTMLDivElement>(null);

  // Parsing JSON data if it's a string
  const servicesData = Array.isArray(business.services) ? business.services : (typeof business.services === 'string' ? JSON.parse(business.services) : []);
  const galleryData = Array.isArray(business.gallery) ? business.gallery : (typeof business.gallery === 'string' ? JSON.parse(business.gallery) : []);
  const socialLinksRaw = business.socialLinks && typeof business.socialLinks === 'string' ? JSON.parse(business.socialLinks) : business.socialLinks;

  const vcardUrl = `/api/vcard/${business.slug}`;

  // Normalize social links
  let activeSocials: { platform: string, url: string }[] = [];
  if (socialLinksRaw) {
    if (Array.isArray(socialLinksRaw)) {
      activeSocials = socialLinksRaw.filter(l => l.url);
    } else if (typeof socialLinksRaw === 'object') {
      activeSocials = Object.entries(socialLinksRaw)
        .filter(([_, val]) => val)
        .map(([platform, url]) => ({ platform, url: url as string }));
    }
  }

  // Google Reviews Widget Logic
  useEffect(() => {
    if (!business.googleReviewWidget || !reviewRef.current) return;
    const fragment = document.createRange().createContextualFragment(business.googleReviewWidget);
    reviewRef.current.innerHTML = "";
    reviewRef.current.appendChild(fragment);
  }, [business.googleReviewWidget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi, I am ${formData.name}.%0A%0A${formData.message}%0A%0AMy phone number is ${formData.phone}`;
    window.open(`https://wa.me/${business.whatsapp?.replace(/\D/g, '')}?text=${text}`, "_blank");
  };

  const getImageUrl = (item: any) => {
    if (!item) return "";
    return typeof item === 'string' ? item : (item.url || "");
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook": return <Facebook className="w-5 h-5" />;
      case "instagram": return <Instagram className="w-5 h-5" />;
      case "linkedin": return <Linkedin className="w-5 h-5" />;
      case "youtube": return <Youtube className="w-5 h-5" />;
      case "twitter": return <Twitter className="w-5 h-5" />;
      case "whatsapp": return <MessageCircle className="w-5 h-5" />;
      case "telegram": return <Send className="w-5 h-5" />;
      case "website": return <Globe className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="top" className="min-h-screen bg-[#09090b] text-[#fafaf9] font-sans max-w-lg mx-auto pb-32 shadow-2xl relative overflow-hidden">
      
      <section className="relative h-80 overflow-hidden flex flex-col items-center justify-end pb-12 px-6">
        {/* Cover Photo Backdrop */}
        {business.coverPhoto && (
          <div className="absolute inset-0 z-0">
            <NextImage 
              src={business.coverPhoto} 
              alt="Cover" 
              fill 
              className="object-cover opacity-40 brightness-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
          </div>
        )}

        <div className="absolute inset-0 z-[1] opacity-[0.05]"
          style={{ backgroundImage: "linear-gradient(rgba(212,175,112,1) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,112,1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />

        {/* Ambient glow */}
        <div className="absolute top-[-60px] left-1/2 w-72 h-44 rounded-full pointer-events-none z-[1]"
          style={{ 
            background: "radial-gradient(ellipse, rgba(212,175,112,0.2) 0%, transparent 70%)", 
            animation: "breathe 4s ease-in-out infinite", 
            transform: "translateX(-50%)" 
          }} />

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Badge variant="outline" className="mb-4 border-[rgba(212,175,112,0.4)] text-[#d4af70] bg-[rgba(212,175,112,0.07)] text-[9px] tracking-[2.5px] uppercase rounded-full px-4 py-1.5 backdrop-blur-md">
            ✦ {business.category || "Luxury Experience"}
          </Badge>
        </motion.div>

        {business.yearEstd && (
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-[10px] tracking-[4px] text-[#d4af70] uppercase mb-3 font-medium">
            Est. {business.yearEstd} {business.address && `· ${business.address.split(',').slice(-2, -1)}`}
          </motion.p>
        )}

        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="font-serif text-6xl text-center leading-[0.95] tracking-tight mb-2">
          {business.businessName.split(' ')[0]}<br />
          <em className="text-[#d4af70] not-italic font-normal">{business.businessName.split(' ').slice(1).join(' ')}</em>
        </motion.h1>

        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="text-[11px] text-[#78716c] tracking-[3px] uppercase mt-4 text-center max-w-[80%] leading-relaxed">
          Elegance in every execution <br/> Sophistication redefined
        </motion.p>
      </section>

      {/* ── PROFILE ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
        className="flex items-center gap-6 px-8 py-10">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-[-14px] rounded-full border border-[rgba(212,175,112,0.05)] animate-pulse" />
          <div className="absolute inset-[-7px] rounded-full border border-[rgba(212,175,112,0.15)] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="w-20 h-20 rounded-full border border-[#d4af70] overflow-hidden bg-gradient-to-br from-[#2a1a08] to-[#0f0a04] flex items-center justify-center font-serif text-3xl text-[#d4af70] shadow-[0_0_30px_rgba(212,175,112,0.1)]">
            {business.logo ? (
              <NextImage src={business.logo} alt={business.businessName} width={80} height={80} className="object-cover w-full h-full" />
            ) : (
              business.ownerName?.[0] || business.businessName[0]
            )}
          </div>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-[#fafaf9] tracking-[0.5px] mb-1">{business.ownerName || "Creative Director"}</h2>
          <p className="text-[11px] tracking-[2.5px] text-[#a8a29e] uppercase flex items-center">
            {business.designation || "Owner"} <span className="inline-block w-1 h-1 rounded-full bg-[#d4af70] mx-2" /> Verified
          </p>
        </div>
      </motion.div>

      <div className="mx-8">
        <Separator className="bg-gradient-to-r from-transparent via-[rgba(212,175,112,0.25)] to-transparent h-px border-0" />
      </div>

      {/* ── ACTION GRID ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
        className="grid grid-cols-5 gap-3 px-8 py-8">
        {[
          { icon: <MessageCircle className="w-5 h-5"/>, label: "Chat", href: `https://wa.me/${business.whatsapp?.replace(/\D/g, '')}` },
          { icon: <Globe className="w-5 h-5"/>, label: "Web", href: business.website || "#" },
          { icon: <Star className="w-5 h-5 text-[#d4af70] fill-[#d4af70]/20"/>, label: "Review", href: "#reviews" },
          { icon: <Send className="w-5 h-5"/>, label: "Connect", href: "#social" },
          { icon: <Download className="w-5 h-5"/>, label: "Save", href: vcardUrl },
        ].map(({ icon, label, href }) => (
          <motion.a key={label} href={href} 
            onClick={(e) => href.startsWith('#') && (e.preventDefault(), scrollTo(href.substring(1)))}
            target={label === "Save" || label === "Chat" || label === "Web" ? "_blank" : undefined}
            whileHover={{ y: -4, backgroundColor: "rgba(212,175,112,0.05)" }} whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-[rgba(212,175,112,0.05)] bg-[#18181b]/40 backdrop-blur-sm transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2a1a08] to-[#0f0a04] flex items-center justify-center text-[#d4af70] border border-[rgba(212,175,112,0.1)] shadow-inner">{icon}</div>
            <div className="text-[9px] tracking-[1.5px] text-[#57534e] uppercase font-semibold">{label}</div>
          </motion.a>
        ))}
      </motion.div>

      {/* ── ABOUT ── */}
      {business.about && (
        <motion.section id="about" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          className="px-8 pt-6 pb-8">
          <SectionTitle>Defining Excellence</SectionTitle>
          <Card className="bg-[#18181b] border-[rgba(212,175,112,0.08)] rounded-[2rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#d4af70] to-transparent opacity-50" />
            <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
            <p className="text-[14px] leading-[1.8] text-[#a8a29e] whitespace-pre-line font-light tracking-wide italic quote-decoration relative z-10">
              "{business.about}"
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
              {[["12+", "Awards"], ["850+", "Clients"], ["100%", "Quality"]].map(([num, lbl]) => (
                <div key={lbl} className="text-center bg-[#27272a]/50 rounded-2xl py-5 border border-white/[0.02]">
                  <div className="font-serif text-2xl text-[#d4af70] mb-0.5">{num}</div>
                  <div className="text-[9px] tracking-[2px] text-[#57534e] uppercase font-bold">{lbl}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>
      )}

      {/* ── SERVICES ── */}
      {servicesData.length > 0 && (
        <motion.section id="services" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          className="px-8 pb-8">
          <SectionTitle>Mastery of Service</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            {servicesData.map((svc: any, i: number) => {
              const rawP = (svc.price || '').trim();
              const displayP = /^\d+$/.test(rawP) ? `₹${Number(rawP).toLocaleString('en-IN')}` : rawP;
              const priceVal = displayP.replace(/onwards|from/gi, '').trim();

              return (
              <motion.div key={i} whileHover={{ y: -5 }}>
                <Card className="bg-[#18181b] border-[rgba(212,175,112,0.05)] rounded-[24px] p-0 h-full relative overflow-hidden cursor-pointer group hover:border-[rgba(212,175,112,0.3)] transition-all duration-500 shadow-xl flex flex-col">
                  {svc.image ? (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <NextImage 
                        src={svc.image} 
                        alt={svc.title || svc.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] to-transparent opacity-60" />
                      
                      {/* Top Right Circular Badge */}
                      {svc.price && (
                        <div 
                          className="absolute top-2 right-2 w-[85px] h-[85px] rounded-full border-[1.5px] shadow-[0_4px_15px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center z-10 text-center bg-transparent backdrop-blur-sm"
                          style={{ borderColor: business.themeColor || '#d4af70' }}
                        >
                          <span className="text-[11px] italic leading-[1.2]" style={{ color: business.themeColor || '#d4af70' }}>From</span>
                          <span className="text-[17px] font-black leading-[1.2] pb-0.5" style={{ color: business.themeColor || '#d4af70' }}>{priceVal}</span>
                          <span className="text-[11px] leading-[1.2]" style={{ color: business.themeColor || '#d4af70' }}>Onwards</span>
                        </div>
                      )}
                      
                      {/* Bottom Center Rectangular Badge */}
                      {svc.price && (
                        <div 
                          className="absolute bottom-3 left-[10%] right-[10%] border-[1.5px] bg-transparent backdrop-blur-sm py-1.5 flex items-center justify-center gap-1.5 shadow-lg z-10 rounded-sm"
                          style={{ borderColor: business.themeColor || '#d4af70' }}
                        >
                          <span className="font-bold text-[18px]" style={{ color: business.themeColor || '#d4af70' }}>{priceVal}</span>
                          <span className="text-[16px] font-medium" style={{ color: business.themeColor || '#d4af70' }}>Onwards</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-[#2a1a08] to-[#0f0a04] flex items-center justify-center relative">
                      <Star className="w-8 h-8 text-[#d4af70] opacity-20" />
                      {svc.price && (
                        <div 
                          className="absolute bottom-2 left-2 border-[1.5px] bg-transparent backdrop-blur-sm px-2 py-1 text-[10px] font-bold rounded shadow-lg z-10"
                          style={{ color: business.themeColor || '#d4af70', borderColor: business.themeColor || '#d4af70' }}
                        >
                          {priceVal} Onwards
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6 pt-4 relative flex-1">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#d4af70] to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                    <h3 className="text-[14px] font-serif tracking-wide text-[#fafaf9] mb-2">{svc.title || svc.name}</h3>
                    <p className="text-[11px] text-[#57534e] leading-relaxed line-clamp-3 font-light mb-4">{svc.description}</p>
                    <a href={`https://wa.me/${business.whatsapp?.replace(/\D/g, '')}?text=Hi, I'm interested in your service: ${svc.title || svc.name}`}
                      className="inline-flex w-full items-center justify-center gap-2 py-2.5 rounded-xl font-bold tracking-wide text-white bg-gradient-to-r from-[#d4af70] to-[#b38d47] transition-all hover:opacity-90 shadow-md mt-auto">
                      Enquiry
                    </a>
                  </div>
                </Card>
              </motion.div>
            )})}
          </div>
        </motion.section>
      )}

      {/* ── GALLERY ── */}
      {galleryData.length > 0 && (
        <motion.section id="gallery" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          className="px-8 pb-8">
          <SectionTitle>The Visual Archive</SectionTitle>
          
          {/* Bento Grid High-Profile */}
          <div className="grid grid-cols-[1.5fr_1fr] gap-4 mb-4">
            <motion.div whileHover={{ scale: 1.01 }} onClick={() => setSelectedImage(getImageUrl(galleryData[0]))}
              className="row-span-2 bg-[#18181b] rounded-3xl border border-[rgba(212,175,112,0.1)] min-h-[280px] flex flex-col justify-end p-6 overflow-hidden relative cursor-zoom-in group shadow-2xl">
              {getImageUrl(galleryData[0]) && (
                <NextImage src={getImageUrl(galleryData[0])} 
                       alt="Primary Gallery" fill className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />
              <div className="relative z-10">
                <p className="font-serif text-2xl leading-tight text-[#fafaf9] mb-1">Curation Phase I</p>
                <p className="text-[9px] tracking-[3px] text-[#d4af70] uppercase font-bold">Featured Highlight</p>
              </div>
            </motion.div>
            
            {galleryData.slice(1, 3).map((item: any, i: number) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} onClick={() => setSelectedImage(getImageUrl(item))}
                className="h-32 bg-[#18181b] rounded-2xl border border-[rgba(212,175,112,0.07)] overflow-hidden relative cursor-zoom-in group shadow-lg">
                {getImageUrl(item) && (
                  <NextImage src={getImageUrl(item)} 
                         alt={`Gallery Sub ${i}`} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Extended Grid */}
          {galleryData.length > 3 && (
            <div className="grid grid-cols-3 gap-3">
              {galleryData.slice(3).map((item: any, i: number) => (
                <motion.div key={i} whileHover={{ scale: 1.03 }} onClick={() => setSelectedImage(getImageUrl(item))}
                  className="aspect-square bg-[#18181b] rounded-xl overflow-hidden relative cursor-zoom-in border border-white/[0.03]">
                  {getImageUrl(item) && (
                    <NextImage src={getImageUrl(item)} alt={`Gallery ${i+3}`} fill className="object-cover opacity-70 hover:opacity-100 transition-opacity" />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* ── REVIEWS ── */}
      {business.googleReviewWidget && (
        <motion.section id="reviews" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          className="px-8 pb-8">
          <SectionTitle>Vouching Royalty</SectionTitle>
          <div className="bg-[#18181b]/60 backdrop-blur-md rounded-3xl border border-[rgba(212,175,112,0.1)] p-1 overflow-hidden shadow-2xl relative">
             <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af70]/30 to-transparent" />
             <div ref={reviewRef} className="review-widget-container p-4 min-h-[120px]" />
          </div>
        </motion.section>
      )}

      {/* ── DIGITAL PRESENCE ── */}
      {activeSocials.length > 0 && (
        <motion.section id="social" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          className="px-8 pb-8">
          <SectionTitle>Global Connectivity</SectionTitle>
          <div className="flex flex-wrap justify-center gap-4 py-4">
            {activeSocials.map((link, idx) => (
              <motion.a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -5, backgroundColor: "rgba(212,175,112,0.1)", borderColor: "rgba(212,175,112,0.5)" }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-[#18181b] border border-[rgba(212,175,112,0.1)] text-[#d4af70] shadow-xl transition-all duration-300"
              >
                {getSocialIcon(link.platform)}
              </motion.a>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── ENQUIRY ── */}
      <motion.section id="enquiry" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
        className="px-8 pb-8">
        <SectionTitle>Acquisition & Inquiry</SectionTitle>
        <Card className="bg-[#18181b] border-[rgba(212,175,112,0.08)] rounded-[2.5rem] p-8 shadow-3xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-serif text-2xl text-center mb-6 tracking-wide">Secure Your Slot</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Preferred Name"
                className="w-full bg-[#27272a]/30 border border-[rgba(212,175,112,0.1)] rounded-2xl px-5 py-4 text-sm text-[#fafaf9] placeholder-[#57534e] focus:outline-none focus:border-[#d4af70] transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="tel"
                required
                placeholder="Mobile Connection"
                className="w-full bg-[#27272a]/30 border border-[rgba(212,175,112,0.1)] rounded-2xl px-5 py-4 text-sm text-[#fafaf9] placeholder-[#57534e] focus:outline-none focus:border-[#d4af70] transition-colors"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <textarea
                required
                rows={3}
                placeholder="Luxury Requirements..."
                className="w-full bg-[#27272a]/30 border border-[rgba(212,175,112,0.1)] rounded-2xl px-5 py-4 text-sm text-[#fafaf9] placeholder-[#57534e] focus:outline-none focus:border-[#d4af70] transition-colors resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <button 
                type="submit"
                className="w-full py-5 rounded-2xl border-none cursor-pointer text-[12px] tracking-[4px] uppercase font-black text-[#0a0a0a] transition-all hover:scale-[1.01] active:shadow-inner mt-4 shadow-[0_10px_20px_-10px_rgba(212,175,112,0.4)]"
                style={{ background: "linear-gradient(135deg, #d4af70 0%, #92703a 100%)" }}>
                Establish Protocol
              </button>
            </form>
          </div>
        </Card>
      </motion.section>

      {/* ── INSTALL PWA ── */}
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
        className="px-8 pb-12">
        <Card className="bg-gradient-to-br from-[#2a1a08]/20 to-transparent border border-[rgba(212,175,112,0.1)] rounded-[2rem] p-8 text-center backdrop-blur-sm">
          <Download className="w-8 h-8 text-[#d4af70] mx-auto mb-4" />
          <h4 className="font-serif text-xl mb-2 italic">Luxury in Your Pocket</h4>
          <p className="text-[11px] text-[#78716c] uppercase tracking-widest mb-6 font-bold leading-relaxed">Install as an App for <br/> Instant Exclusive Access</p>
          <Button 
            className="w-full bg-[#18181b] border border-[#d4af70]/30 hover:border-[#d4af70] text-[#d4af70] py-6 rounded-2xl text-[10px] tracking-[3px] uppercase font-extrabold hover:bg-[#1a1208]"
            onClick={() => alert("Installation initiated...")}
          >
            Add to Device
          </Button>
        </Card>
      </motion.div>

      {/* ── BOTTOM NAV ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] h-20 bg-[#18181b]/70 backdrop-blur-xl rounded-[2.5rem] border border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] flex items-center justify-around px-4">
        {[
          { id: "top", label: "Hero", icon: <Home className="w-5 h-5"/> },
          { id: "about", label: "About", icon: <Info className="w-5 h-5"/> },
          { id: "services", label: "Store", icon: <ShoppingBag className="w-5 h-5"/> },
          { id: "gallery", label: "Media", icon: <ImageIcon className="w-5 h-5"/> },
          { id: "enquiry", label: "Consult", icon: <Send className="w-5 h-5"/> },
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => item.id === "top" ? window.scrollTo({ top: 0, behavior: "smooth" }) : scrollTo(item.id)}
            className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-all duration-300 group">
            <div className="text-[#d4af70] group-hover:scale-110 transition-transform">{item.icon}</div>
            <span className="text-[9px] tracking-[1px] uppercase font-bold text-[#fafaf9]/80">{item.label}</span>
          </button>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
        className="mx-8 pb-10">
        <div className="bg-[#18181b] border border-[rgba(212,175,112,0.1)] rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d4af70]/40 to-transparent" />
          <div className="text-center">
             <p className="text-[10px] tracking-[5px] text-[#57534e] uppercase font-black mb-3">Crafted with Prestige</p>
             <p className="font-serif text-3xl text-[#d4af70] tracking-tighter opacity-90">EVisitingCard</p>
          </div>
          <Separator className="bg-white/[0.03] w-full" />
          <motion.a href="/" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-[#d4af70] to-[#92703a] rounded-full text-[10px] tracking-[3px] uppercase font-black text-[#0a0a0a] no-underline shadow-lg">
            Create Your Essence
          </motion.a>
        </div>
      </motion.div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/98 flex items-center justify-center p-6 backdrop-blur-lg"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-[#d4af70] hover:scale-110 transition-transform">
              <X className="w-10 h-10" />
            </button>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl h-[80vh]">
              <NextImage src={selectedImage} alt="Fullscreen View" fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .review-widget-container { color: #d4af70 !important; }
        .review-widget-container * { border-color: rgba(212,175,112,0.1) !important; background-color: transparent !important; color: #a8a29e !important; }
        .review-widget-container img { filter: sepia(0.5) contrast(1.2) brightness(0.8); border-radius: 50% !important; border: 1px solid #d4af70 !important; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
      `}</style>

    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#d4af70]" />
      <span className="text-[11px] tracking-[5px] text-[#d4af70] uppercase font-sans font-black whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-[#d4af70] to-transparent opacity-20" />
    </div>
  )
}
