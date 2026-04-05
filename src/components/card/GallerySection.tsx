import Image from "next/image";

export default function GallerySection({
  gallery,
  theme,
  onImageClick
}: {
  gallery: any[];
  theme: any;
  onImageClick?: (url: string) => void;
}) {
  if (!gallery || gallery.length === 0) return null;

  return (
    <div id="gallery" className="scroll-mt-20">
      <h2 className={`mb-6 text-center ${theme.isTheme4 ? theme.typography.sectionTitle : 'text-xl font-bold ' + theme.typography.heading}`}>
        Our Gallery
      </h2>

      <div className={theme.isTheme4 ? "grid grid-cols-3 gap-1.5" : "grid grid-cols-2 gap-3"}>
        {gallery.map((item, idx) => {
          if (!item) return null;
          const imageUrl = typeof item === 'string' ? item : (item.url || "");
          if (!imageUrl) return null;

          return (
            <div
              key={idx}
              className={`relative aspect-square overflow-hidden shadow-sm bg-gray-100 cursor-pointer group ${theme.isTheme4 ? 'rounded-lg border border-[var(--border-gold)]/20' : 'rounded-xl'}`}
              onClick={() => onImageClick?.(imageUrl)}
            >
              <Image
                src={imageUrl}
                alt={`Gallery Image ${idx + 1}`}
                fill
                className={`object-cover transition-transform duration-500 ${theme.isTheme4 ? 'group-hover:scale-105' : 'group-hover:scale-110'}`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
