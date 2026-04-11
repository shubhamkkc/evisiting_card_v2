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
        {services.map((service, idx) => {
          const rawP = (service.price || '').trim();
          const displayP = /^\d+$/.test(rawP) ? `₹${Number(rawP).toLocaleString('en-IN')}` : rawP;
          const priceVal = displayP.replace(/onwards|from/gi, '').trim();

          return (
          <div key={idx} className={`overflow-hidden transition-transform hover:-translate-y-1 relative ${theme.isTheme4 ? 'rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-gold)]/15 flex flex-col pt-1' : 'rounded-2xl ' + theme.cardBg}`}>
            {theme.isTheme4 && (
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dim)]" />
            )}
            
            {service.image ? (
              <div 
                className={`relative bg-gray-100 cursor-pointer group overflow-hidden ${theme.isTheme4 ? 'aspect-square w-full' : 'w-full h-48'}`}
                onClick={() => onImageClick?.(service.image)}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Top Right Circular Badge */}
                {service.price && (
                  <div 
                    className="absolute top-2 right-2 w-[85px] h-[85px] rounded-full border-[1.5px] shadow-xl flex flex-col items-center justify-center z-10 bg-transparent backdrop-blur-sm"
                    style={{ borderColor: business.themeColor || '#d4af70' }}
                  >
                    <span className="text-[11px] italic leading-[1.2]" style={{ color: business.themeColor || '#d4af70' }}>From</span>
                    <span className="text-[17px] font-black leading-[1.2] pb-0.5" style={{ color: business.themeColor || '#d4af70' }}>{priceVal}</span>
                    <span className="text-[11px] leading-[1.2]" style={{ color: business.themeColor || '#d4af70' }}>Onwards</span>
                  </div>
                )}
                
                {/* Bottom Center Rectangular Badge */}
                {/* {service.price && (
                  <div 
                    className="absolute bottom-3 left-[10%] right-[10%] border-[1.5px] bg-transparent backdrop-blur-sm py-1.5 flex items-center justify-center gap-1.5 shadow-lg z-10 rounded-sm"
                    style={{ borderColor: business.themeColor || '#d4af70' }}
                  >
                    <span className="font-bold text-[18px]" style={{ color: business.themeColor || '#d4af70' }}>{priceVal}</span>
                    <span className="text-[16px] font-medium" style={{ color: business.themeColor || '#d4af70' }}>Onwards</span>
                  </div>
                )} */}
              </div>
            ) : theme.isTheme4 ? (
              <div className="aspect-square w-full bg-[var(--bg-card)] flex items-center justify-center relative">
                <span className="text-[var(--gold)] opacity-20 text-4xl">★</span>
                {service.price && (
                  <div 
                    className="absolute bottom-2 left-2 border-[1.5px] bg-transparent backdrop-blur-sm px-2 py-1 text-[10px] font-bold rounded shadow-lg z-10"
                    style={{ color: business.themeColor || '#d4af70', borderColor: business.themeColor || '#d4af70' }}
                  >
                    {priceVal} Onwards
                  </div>
                )}
              </div>
            ) : null}
            
            <div className={theme.isTheme4 ? "p-3 flex-1 flex flex-col justify-between" : "p-5"}>
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className={`${theme.isTheme4 ? 'text-[13px] font-medium mb-0' : 'text-lg font-bold mb-0'} ${theme.typography.heading}`}>
                    {service.title}
                  </h3>
                  {service.price && !service.image && !theme.isTheme4 && (
                    <span 
                      className="shrink-0 border-[1.5px] bg-transparent text-xs font-bold rounded shadow-sm px-2 py-0.5"
                      style={{ color: business.themeColor || '#d4af70', borderColor: business.themeColor || '#d4af70' }}
                    >
                      {priceVal} Onwards
                    </span>
                  )}
                </div>
                
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
                className={`w-full flex items-center justify-center transition-all mt-4 py-2.5 rounded-xl font-bold text-white shadow-md ${theme.isTheme4 ? 'bg-gradient-to-r from-[#d4af70] to-[#b38d47] hover:opacity-90' : 'bg-gradient-to-r from-[#d4af70] to-[#b38d47] hover:opacity-90'}`}
              >
                Enquiry
              </a>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
