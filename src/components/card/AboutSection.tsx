export default function AboutSection({ business, theme }: { business: any; theme: any }) {
  return (
    <div id="about" className="scroll-mt-20">
      <h2 className={`text-xl mb-4 text-center ${theme.typography.heading}`}>
        About Us
      </h2>

      <div className={`p-6 rounded-2xl ${theme.cardBg}`}>
        <p className={`whitespace-pre-line text-[15px] mb-6 ${theme.typography.description}`}>
          {business.about}
        </p>

        <div className="space-y-3 pt-4 border-t border-gray-100/10">
          <div className="flex justify-between items-center text-sm">
            <span className={theme.typography.meta}>Company Name</span>
            <span className={`font-medium ${theme.typography.heading}`}>{business.businessName}</span>
          </div>
          
          {business.category && (
            <div className="flex justify-between items-center text-sm">
              <span className={theme.typography.meta}>Nature of Business</span>
              <span className={`font-medium ${theme.typography.heading}`}>{business.category}</span>
            </div>
          )}

          {business.yearEstd && (
            <div className="flex justify-between items-center text-sm">
              <span className={theme.typography.meta}>Year Established</span>
              <span className={`font-medium ${theme.typography.heading}`}>{business.yearEstd}</span>
            </div>
          )}
          
          {business.address && (
            <div className="flex justify-between text-sm mt-3 pt-3 border-t border-gray-100/10">
              <span className={`w-1/3 ${theme.typography.meta}`}>Address</span>
              <span className={`w-2/3 text-right font-medium text-[13px] ${theme.typography.heading}`}>
                {business.address}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
