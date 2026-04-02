import { useEffect, useRef } from "react";

export default function ReviewsSection({ business }: { business: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!business.googleReviewWidget) return;
    if (!containerRef.current) return;

    // Inject the widget script
    const fragment = document.createRange().createContextualFragment(business.googleReviewWidget);
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(fragment);

    // Setup an observer to watch for broken images injected by the script
    const handleBrokenImages = () => {
      if (!containerRef.current) return;
      const images = containerRef.current.querySelectorAll("img");
      images.forEach((img) => {
        // Handle images that already failed or will fail
        if (img.src && (img.naturalWidth === 0 || img.complete === false)) {
          img.onerror = () => {
            img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(img.alt || "Reviewer")}&background=random&color=fff`;
            img.style.borderRadius = "50%";
          };
          // Trigger the error if naturally empty
          if (img.naturalWidth === 0 && img.complete) {
            img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(img.alt || "Reviewer")}&background=random&color=fff`;
          }
        }
      });
    };

    // Run every 1 second for 5 seconds to catch delayed injections
    const interval = setInterval(handleBrokenImages, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [business.googleReviewWidget]);

  if (!business.googleReviewWidget) {
    return null;
  }

  return (
    <div className="mt-8 px-4">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden p-2">
        <div 
          className="w-full review-widget-container"
          ref={containerRef}
          style={{ minHeight: "100px" }}
        />
      </div>

      <style jsx global>{`
        .review-widget-container img {
           object-fit: cover !important;
        }
        /* Hide Jotform branding / extra space if needed */
        .review-widget-container div[style*="margin-top"] {
           margin-top: 0 !important;
        }
      `}</style>
    </div>
  );
}
