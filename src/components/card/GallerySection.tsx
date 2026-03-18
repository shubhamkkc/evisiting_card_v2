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
      <h2 className={`text-xl mb-6 text-center ${theme.typography.heading}`}>
        Our Gallery
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {gallery.map((item, idx) => {
          if (!item) return null;
          const imageUrl = typeof item === 'string' ? item : (item.url || "");
          if (!imageUrl) return null;

          return (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden shadow-sm bg-gray-100 cursor-pointer group"
              onClick={() => onImageClick?.(imageUrl)}
            >
              <Image
                src={imageUrl}
                alt={`Gallery Image ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
