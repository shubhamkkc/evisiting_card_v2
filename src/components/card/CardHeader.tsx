import Image from "next/image";

export default function CardHeader({ business, theme }: { business: any; theme: any }) {
  return (
    <div className={`relative ${theme.headerBg} ${theme.isTheme4 ? 'pb-2' : 'pb-6'}`}>
      {/* Cover Photo */}
      <div className={`w-full ${theme.isTheme4 ? 'h-64' : 'h-48'} bg-gray-200 relative overflow-hidden`}>
        {business.coverPhoto ? (
          <Image
            src={business.coverPhoto}
            alt="Cover"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-300" />
        )}
        {/* Dark Overlay for Theme 4 */}
        {theme.isTheme4 && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-90" />
        )}
      </div>

      {/* Est. Info for Theme 4 */}
      {theme.isTheme4 && (
        <div className="absolute top-4 left-0 right-0 text-center z-10 px-4">
          <p className="text-[var(--gold)] text-[10px] font-bold tracking-[3px] uppercase drop-shadow-md">
            Est. {business.yearEstd || '2020'} · {business.address?.split(',').slice(-2).join(',').trim() || 'Patna, Bihar'}
          </p>
        </div>
      )}

      {/* Logo */}
      <div className={`relative ${theme.isTheme4 ? '-mt-20' : '-mt-16'} flex justify-center w-full z-20`}>
        <div className={`${theme.isTheme4 ? 'w-36 h-36 border-2 border-[var(--gold)]' : 'w-32 h-32 border-4'} rounded-full overflow-hidden ${theme.isTheme4 ? 'bg-[var(--bg-card)]' : (theme.container.includes('bg-gray-950') ? 'border-gray-950 bg-white' : 'border-white bg-white')} shadow-lg flex items-center justify-center`}>
          {business.logo ? (
            <Image
              src={business.logo}
              alt={business.businessName}
              width={144}
              height={144}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className={`text-4xl font-bold ${theme.isTheme4 ? 'text-[var(--gold)]' : 'text-gray-400'}`}>
              {business.businessName.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className={`text-center ${theme.isTheme4 ? 'mt-6' : 'mt-4'} px-4`}>
        <h1 className={`${theme.isTheme4 ? 'text-3xl' : 'text-2xl'} ${theme.typography.heading}`}>
          {business.businessName}
        </h1>
        
        {/* Divider for Theme 4 */}
        {theme.isTheme4 && (
          <div className="h-[1px] w-48 mx-auto my-4 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-50" />
        )}

        <div className={theme.isTheme4 ? 'flex items-center justify-center gap-2' : ''}>
          {business.ownerName && (
            <p className={`${theme.isTheme4 ? 'text-[11px] uppercase tracking-[2px]' : 'mt-1 font-medium'} ${theme.accentText}`}>
              {business.ownerName}
            </p>
          )}
          {theme.isTheme4 && business.ownerName && business.designation && <span className="text-[var(--gold)]">·</span>}
          {business.designation && (
            <p className={`${theme.isTheme4 ? 'text-[11px] uppercase tracking-[2px]' : 'text-sm'} ${theme.typography.meta}`}>
              {business.designation}
            </p>
          )}
        </div>

        {business.category && (
          <span className={`inline-block mt-4 px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${theme.badge}`}>
            {business.category}
          </span>
        )}
      </div>
    </div>
  );
}
