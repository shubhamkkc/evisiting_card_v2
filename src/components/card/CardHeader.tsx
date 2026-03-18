import Image from "next/image";

export default function CardHeader({ business, theme }: { business: any; theme: any }) {
  return (
    <div className={`relative ${theme.headerBg} pb-6`}>
      {/* Cover Photo */}
      <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
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
      </div>

      {/* Logo */}
      <div className="relative -mt-16 flex justify-center w-full">
        <div className={`w-32 h-32 rounded-full border-4 ${theme.container.includes('bg-gray-950') ? 'border-gray-950' : 'border-white'} overflow-hidden bg-white shadow-lg flex items-center justify-center`}>
          {business.logo ? (
            <Image
              src={business.logo}
              alt={business.businessName}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-4xl font-bold text-gray-400">
              {business.businessName.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="text-center mt-4 px-4">
        <h1 className={`text-2xl ${theme.typography.heading}`}>
          {business.businessName}
        </h1>
        {business.ownerName && (
          <p className={`mt-1 font-medium ${theme.accentText}`}>
            {business.ownerName}
          </p>
        )}
        {business.designation && (
          <p className={`text-sm ${theme.typography.meta}`}>
            {business.designation}
          </p>
        )}
        {business.category && (
          <span className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${theme.badge}`}>
            {business.category}
          </span>
        )}
      </div>
    </div>
  );
}
