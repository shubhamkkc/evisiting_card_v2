"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getTheme } from "./themes";
import CardHeader from "./CardHeader";
import ContactButtons from "./ContactButtons";
import SocialLinks from "./SocialLinks";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import GallerySection from "./GallerySection";
import ReviewsSection from "./ReviewsSection";
import EnquiryForm from "./EnquiryForm";
import ShareSection from "./ShareSection";
import BottomNavBar from "./BottomNavBar";
import InstallPWA from "./InstallPWA";
import Link from "next/link";

import Theme4Card from "./Theme4Card";

// Adjust according to the Prisma schema TS definitions
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
  socialLinks?: NonNullable<any>; 
  services?: NonNullable<any>;
  gallery?: NonNullable<any>;
  theme: string;
  themeColor: string;
}

export default function BusinessCard({ business }: { business: Business }) {
  const theme = getTheme(business.theme);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Set custom CSS variable for dynamic accent color based on user selection
    document.documentElement.style.setProperty('--theme-color', business.themeColor);
  }, [business.themeColor]);

  // Handle parsing JSON data gracefully
  const socialData = business.socialLinks && typeof business.socialLinks === 'string' ? JSON.parse(business.socialLinks) : business.socialLinks;
  const servicesData = business.services && typeof business.services === 'string' ? JSON.parse(business.services) : business.services || [];
  const galleryData = business.gallery && typeof business.gallery === 'string' ? JSON.parse(business.gallery) : business.gallery || [];

  if (business.theme === 'theme4') {
    return <Theme4Card business={business} />;
  }

  return (
    <div className={`w-full min-h-screen pb-20 overflow-y-auto relative ${theme.container}`}>
      {business.theme === 'theme4' && <div className="fixed inset-0 pointer-events-none z-[0] bg-grain opacity-30" />}
      
      {/* 1. Header with Cover, Logo, Name, Designation */}
      <CardHeader business={business} theme={theme} />

      <div className="px-4 py-6 space-y-8">
        <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <ContactButtons business={business} theme={theme} />
        </div>

        {/* 3. Social Media Links */}
        {socialData && Object.keys(socialData).length > 0 && (
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <SocialLinks socialLinks={socialData} theme={theme} />
          </div>
        )}

        {/* 4. About Us Section */}
        {business.about && (
          <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <AboutSection business={business} theme={theme} />
          </div>
        )}

        {/* 5. Products/Services */}
        {servicesData.length > 0 && (
          <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <ServicesSection 
              services={servicesData} 
              business={business} 
              theme={theme} 
              onImageClick={(url: string) => setSelectedImage(url)}
            />
          </div>
        )}

        {/* 6. Gallery */}
        {galleryData.length > 0 && (
          <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <GallerySection 
              gallery={galleryData} 
              theme={theme} 
              onImageClick={(url: string) => setSelectedImage(url)}
            />
          </div>
        )}

        {/* Google Reviews Widget */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <ReviewsSection business={business} theme={theme} />
        </div>

        {/* 7. Enquiry Form */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
          <EnquiryForm business={business} theme={theme} />
        </div>

        {/* 8. Share Section */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          <ShareSection business={business} theme={theme} />
        </div>

        {/* 9. Install as App (PWA) */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
          <InstallPWA theme={theme} />
        </div>

        {/* 10. Footer Branding (Homepage Link) */}
        <div className={`pt-12 pb-8 text-center border-t ${business.theme === 'theme4' ? 'border-[var(--border-gold)]/20 bg-[#080808]' : 'border-gray-100'}`}>
          <p className={`${business.theme === 'theme4' ? 'text-[var(--gold)]/60' : 'text-gray-400'} text-[11px] mb-4 uppercase tracking-[0.2em] font-bold`}>
            Create your own digital card
          </p>
          <Link 
            href="/" 
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-extrabold transition-all hover:scale-105 active:scale-95 shadow-lg ${theme.accentBg}`}
          >
            Get Started Now
          </Link>
          <div className={`mt-8 flex flex-col items-center gap-1 ${business.theme === 'theme4' ? 'opacity-60' : 'opacity-40'}`}>
            <span className={`text-[10px] uppercase font-medium tracking-widest ${business.theme === 'theme4' ? 'text-[var(--gold-light)]' : ''}`}>Powered by</span>
            <span className={`text-sm font-black tracking-tight ${business.theme === 'theme4' ? 'text-[var(--gold)] text-lg' : ''}`}>EVisitingCard</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Nav */}
      <BottomNavBar theme={theme} />

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Full screen view" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
