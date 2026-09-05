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
    <div id="enquiry" className={theme.isTheme4 ? `p-6 rounded-xl border border-[var(--border-gold)]/30 ${theme.cardBg} scroll-mt-20 my-8` : `p-6 rounded-2xl ${theme.cardBg} scroll-mt-20 my-8 shadow-sm`}>
      <h2 className={`mb-6 text-center ${theme.isTheme4 ? theme.typography.sectionTitle : 'text-xl font-bold ' + theme.typography.heading}`}>
        Send Enquiry
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            required
            placeholder="Your Name"
            className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-all ${theme.isTheme4 
              ? 'bg-[var(--bg-card)] border border-[var(--border-gold)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--gold)]' 
              : 'bg-white/50 border border-gray-200 focus:ring-2 focus:ring-[var(--theme-color)]'}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div>
          <input
            type="tel"
            required
            placeholder="Your Mobile Number"
            className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-all ${theme.isTheme4 
              ? 'bg-[var(--bg-card)] border border-[var(--border-gold)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--gold)]' 
              : 'bg-white/50 border border-gray-200 focus:ring-2 focus:ring-[var(--theme-color)]'}`}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        
        <div>
          <textarea
            required
            rows={4}
            placeholder="Your Message..."
            className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-all resize-none ${theme.isTheme4 
              ? 'bg-[var(--bg-card)] border border-[var(--border-gold)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--gold)]' 
              : 'bg-white/50 border border-gray-200 focus:ring-2 focus:ring-[var(--theme-color)]'}`}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
        </div>
        
        <button
          type="submit"
          className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${theme.isTheme4 ? "bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dim)] text-[#0d0d0d] tracking-[2px] uppercase text-[11px]" : theme.accentBg}`}
        >
          Send Message <Send className={theme.isTheme4 ? "w-4 h-4 text-[#0d0d0d]" : "w-4 h-4"} />
        </button>
      </form>
    </div>
  );
}
