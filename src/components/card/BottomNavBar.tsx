"use client";

import { Home, Info, ShoppingBag, Image as ImageIcon, Send } from "lucide-react";

export default function BottomNavBar({ theme }: { theme: any }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "top", label: "Home", icon: <Home className="w-5 h-5 mb-1" /> },
    { id: "about", label: "About", icon: <Info className="w-5 h-5 mb-1" /> },
    { id: "services", label: "Services", icon: <ShoppingBag className="w-5 h-5 mb-1" /> },
    { id: "gallery", label: "Gallery", icon: <ImageIcon className="w-5 h-5 mb-1" /> },
    { id: "enquiry", label: "Enquiry", icon: <Send className="w-5 h-5 mb-1" /> },
  ];

  return (
    <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[72px] flex items-center justify-around z-50 border-t pb-safe pointer-events-auto ${theme.headerBg} shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] backdrop-blur-md`}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => item.id === "top" ? window.scrollTo({ top: 0, behavior: "smooth" }) : scrollTo(item.id)}
          className={`flex flex-col items-center justify-center w-16 h-full transition-colors active:opacity-70 ${theme.accentText}`}
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
