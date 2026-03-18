"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function EnquiryForm({ business, theme }: { business: any; theme: any }) {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi, I am ${formData.name}.%0A%0A${formData.message}%0A%0AMy phone number is ${formData.phone}`;
    
    if (business.whatsapp) {
      window.open(`https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=${text}`, "_blank");
    } else if (business.email) {
      window.location.href = `mailto:${business.email}?subject=Enquiry from ${formData.name}&body=${text}`;
    }
  };

  return (
    <div id="enquiry" className={`p-6 rounded-2xl ${theme.cardBg} scroll-mt-20 my-8`}>
      <h2 className={`text-xl mb-4 font-bold text-center ${theme.typography.heading}`}>
        Send Enquiry
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            required
            placeholder="Your Name"
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--theme-color)] transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div>
          <input
            type="tel"
            required
            placeholder="Your Mobile Number"
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--theme-color)] transition-all"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        
        <div>
          <textarea
            required
            rows={4}
            placeholder="Your Message..."
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--theme-color)] transition-all resize-none"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
        </div>
        
        <button
          type="submit"
          className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm ${theme.accentBg}`}
        >
          Send Message <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
