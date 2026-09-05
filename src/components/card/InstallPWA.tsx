"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallPWA({ theme }: { theme: any }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          console.log('SW registered:', reg);
        }).catch((err) => {
          console.error('SW registration failed:', err);
        });
      });
    }

    // 2. Capture the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsReady(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    setDeferredPrompt(null);
    setIsReady(false);
  };

  // If the browser doesn't trigger the prompt (e.g., iPhone), we might not show the button
  // OR we can show a tooltip for iOS instructions.
  if (!isReady) return null;

  return (
    <div className="mt-8">
      <button
        onClick={handleInstallClick}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${theme?.button || 'bg-blue-600 text-white hover:bg-blue-700'}`}
        style={{ backgroundColor: 'var(--theme-color)' }}
      >
        <Download className="w-5 h-5" />
        Save as App (Install)
      </button>
      <p className="text-center text-xs text-gray-500 mt-2">
        Install this card as an app for easy access anytime.
      </p>
    </div>
  );
}
