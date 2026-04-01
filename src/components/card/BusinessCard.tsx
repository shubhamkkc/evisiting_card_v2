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
import EnquiryForm from "./EnquiryForm";
import ShareSection from "./ShareSection";
import BottomNavBar from "./BottomNavBar";
import InstallPWA from "./InstallPWA";
import Link from "next/link";

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

  return (
    <div className={`w-full min-h-screen pb-20 overflow-y-auto ${theme.container}`}>
      {/* 1. Header with Cover, Logo, Name, Designation */}
      <CardHeader business={business} theme={theme} />

      <div className="px-4 py-6 space-y-8">
        {/* 2. Contact Action Buttons */}
        <ContactButtons business={business} theme={theme} />

        {/* 3. Social Media Links */}
        {socialData && Object.keys(socialData).length > 0 && (
          <SocialLinks socialLinks={socialData} theme={theme} />
        )}

        {/* 4. About Us Section */}
        {business.about && (
          <AboutSection business={business} theme={theme} />
        )}

        {/* 5. Products/Services */}
        {servicesData.length > 0 && (
          <ServicesSection 
            services={servicesData} 
            business={business} 
            theme={theme} 
            onImageClick={(url: string) => setSelectedImage(url)}
          />
        )}

        {/* 6. Gallery */}
        {galleryData.length > 0 && (
          <GallerySection 
            gallery={galleryData} 
            theme={theme} 
            onImageClick={(url: string) => setSelectedImage(url)}
          />
        )}

        {/* 7. Enquiry Form */}
        <EnquiryForm business={business} theme={theme} />

        {/* 8. Share Section */}
        <ShareSection business={business} theme={theme} />

        {/* 9. Install as App (PWA) */}
        <InstallPWA theme={theme} />

        {/* 10. Footer Branding (Homepage Link) */}
        <div className="pt-12 pb-8 text-center border-t border-gray-100">
          <p className="text-gray-400 text-[11px] mb-4 uppercase tracking-[0.2em] font-bold">
            Create your own digital card
          </p>
          <Link 
            href="/" 
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-extrabold transition-all hover:scale-105 active:scale-95 shadow-lg ${theme.accentBg}`}
          >
            Get Started Now
          </Link>
          <div className="mt-8 flex flex-col items-center gap-1 opacity-40">
            <span className="text-[10px] uppercase font-medium tracking-widest">Powered by</span>
            <span className="text-sm font-black tracking-tight">EVisitingCard</span>
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
