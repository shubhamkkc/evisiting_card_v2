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
    <div id="services" className="scroll-mt-20 px-4">
      <h2 className={`mb-6 text-center ${theme.isTheme4 ? theme.typography.sectionTitle : 'text-xl font-bold ' + theme.typography.heading}`}>
        Our Products & Services
      </h2>

      <div className={theme.isTheme4 ? "grid grid-cols-2 gap-3" : "grid gap-6"}>
        {services.map((service, idx) => (
          <div key={idx} className={`overflow-hidden transition-transform hover:-translate-y-1 relative ${theme.isTheme4 ? 'rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-gold)]/15 flex flex-col pt-1' : 'rounded-2xl ' + theme.cardBg}`}>
            {theme.isTheme4 && (
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dim)]" />
            )}
            
            {service.image ? (
              <div 
                className={`relative bg-gray-100 cursor-pointer group ${theme.isTheme4 ? 'aspect-square w-full' : 'w-full h-48'}`}
                onClick={() => onImageClick?.(service.image)}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ) : theme.isTheme4 ? (
              <div className="aspect-square w-full bg-[var(--bg-card)] flex items-center justify-center">
                <span className="text-[var(--gold)] opacity-20 text-4xl">★</span>
              </div>
            ) : null}
            
            <div className={theme.isTheme4 ? "p-3 flex-1 flex flex-col justify-between" : "p-5"}>
              <div>
                <h3 className={`${theme.isTheme4 ? 'text-[13px] font-medium' : 'text-lg font-bold mb-2'} ${theme.typography.heading}`}>
                  {service.title}
                </h3>
                
                {service.description && !theme.isTheme4 && (
                  <p className={`text-sm mb-4 line-clamp-3 ${theme.typography.description}`}>
                    {service.description}
                  </p>
                )}
              </div>
              
              <a
                href={`https://wa.me/${business.whatsapp?.replace(/\D/g, '')}?text=Hi, I would like to enquire about your product/service: *${encodeURIComponent(service.title)}*`}
                target="_blank"
                rel="noreferrer"
                className={`w-full flex items-center justify-center transition-all ${theme.isTheme4 
                  ? 'mt-3 py-1.5 rounded-lg text-[10px] font-bold tracking-[1.5px] uppercase border border-[var(--border-gold)] text-[var(--gold)] bg-transparent hover:bg-[var(--gold)] hover:text-[#0d0d0d]' 
                  : 'py-2.5 rounded-xl font-semibold hover:opacity-90 ' + theme.accentBg}`}
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
