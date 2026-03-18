import Image from "next/image";

export default function ServicesSection({ 
  services, 
  business, 
  theme,
  onImageClick 
}: { 
  services: any[]; 
  business: any; 
  theme: any;
  onImageClick?: (url: string) => void;
}) {
  if (!services || services.length === 0) return null;

  return (
    <div id="services" className="scroll-mt-20">
      <h2 className={`text-xl mb-6 text-center ${theme.typography.heading}`}>
        Our Products & Services
      </h2>

      <div className="grid gap-6">
        {services.map((service, idx) => (
          <div key={idx} className={`overflow-hidden rounded-2xl ${theme.cardBg} transition-transform hover:-translate-y-1`}>
            {service.image && (
              <div 
                className="w-full h-48 relative bg-gray-100 cursor-pointer group"
                onClick={() => onImageClick?.(service.image)}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
              </div>
            )}
            
            <div className="p-5">
              <h3 className={`text-lg font-bold mb-2 ${theme.typography.heading}`}>
                {service.title}
              </h3>
              
              {service.description && (
                <p className={`text-sm mb-4 line-clamp-3 ${theme.typography.description}`}>
                  {service.description}
                </p>
              )}
              
              <a
                href={`https://wa.me/${business.whatsapp?.replace(/\D/g, '')}?text=Hi, I would like to enquire about your product/service: *${encodeURIComponent(service.title)}*`}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center transition-opacity hover:opacity-90 ${theme.accentBg}`}
              >
                Enquiry
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
