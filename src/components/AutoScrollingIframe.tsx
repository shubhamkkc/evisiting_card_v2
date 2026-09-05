"use client";

import { useEffect, useRef } from "react";

export default function AutoScrollingIframe({ src, title }: { src: string; title: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let animationFrameId: number;
    let direction = 1;
    let scrolling = false;

    const startScrolling = () => {
      try {
        const win = iframe.contentWindow;
        if (!win) return;
        const doc = win.document;
        if (!doc || !doc.body) return;
        
        scrolling = true;
        let lastTime = performance.now();
        let scrollPos = win.scrollY || doc.documentElement.scrollTop;
        
        const scrollStep = (time: number) => {
          if (!scrolling) return;
          
          const delta = time - lastTime;
          lastTime = time;
          
          // roughly 30px per second (0.03 px per ms)
          scrollPos += direction * (delta * 0.04);
          win.scrollTo(0, scrollPos);

          const maxScroll = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight) - win.innerHeight;

          if (maxScroll <= 0) return; // Nothing to scroll

          if (direction === 1 && scrollPos >= maxScroll - 1) {
             scrolling = false;
             direction = -1;
             timeoutId = setTimeout(startScrolling, 2000); // Pause at bottom
          } else if (direction === -1 && scrollPos <= 1) {
             scrolling = false;
             direction = 1;
             timeoutId = setTimeout(startScrolling, 2000); // Pause at top
          } else {
             animationFrameId = requestAnimationFrame(scrollStep);
          }
        };
        
        animationFrameId = requestAnimationFrame(scrollStep);
      } catch (e) {
        // cross-origin error or not mounted properly, silently ignore
      }
    };

    const handleLoad = () => {
       timeoutId = setTimeout(startScrolling, 2000);
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      scrolling="no"
      className="w-full h-full border-0 pointer-events-none"
      title={title}
      tabIndex={-1}
    />
  );
}
