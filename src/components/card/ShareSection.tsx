"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Share2, Copy, Check, Download } from "lucide-react";
import Image from "next/image";

export default function ShareSection({ business, theme }: { business: any; theme: any }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [cardUrl, setCardUrl] = useState("");

  useEffect(() => {
    // Generate QR Code that points to the business card URL
    const url = `${window.location.origin}/${business.slug}`;
    setCardUrl(url);

    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: business.themeColor,
        light: '#FFFFFF'
      }
    })
    .then(url => setQrCodeUrl(url))
    .catch(err => console.error(err));
  }, [business.slug, business.themeColor]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const shareViaWhatsApp = () => {
    const text = `Hello! Check out my Digital Business Card:%0A${cardUrl}`;
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div id="share" className="scroll-mt-20 py-8 border-t border-gray-200">
      <h2 className={`text-xl mb-6 font-bold text-center ${theme.typography.heading}`}>
        Share Card
      </h2>
      
      <div className={`p-6 rounded-2xl mx-auto flex flex-col items-center ${theme.cardBg}`}>
        {qrCodeUrl ? (
          <div className="bg-white p-3 rounded-xl shadow-sm mb-6 pointer-events-none">
            <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} className="rounded-lg" />
          </div>
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-100 animate-pulse rounded-xl mb-6" />
        )}
        
        <div className="flex gap-4 w-full">
          <button
            onClick={copyLink}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${copied ? theme.badge : theme.buttonOutline}`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy "}
          </button>
          
          <button
            onClick={shareViaWhatsApp}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white transition-opacity hover:opacity-90 ${theme.accentBg}`}
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
