export default function AboutSection({ business, theme }: { business: any; theme: any }) {
  return (
    <div id="about" className="scroll-mt-20">
      <h2 className={`mb-6 text-center ${theme.isTheme4 ? theme.typography.sectionTitle : 'text-xl font-bold ' + theme.typography.heading}`}>
        About Us
      </h2>

      <div className={`overflow-hidden ${theme.isTheme4 ? 'rounded-xl border border-[var(--border-gold)]' : 'p-6 rounded-2xl ' + theme.cardBg}`}>
        <p className={`${theme.isTheme4 ? 'p-6 text-sm italic border-b border-[var(--border-gold)]/30' : 'whitespace-pre-line text-[15px] mb-6'} ${theme.typography.description}`}>
          {business.about}
        </p>

        <div className={theme.isTheme4 ? 'divide-y divide-[var(--border-gold)]/20' : 'space-y-3 pt-4 border-t border-gray-100/10'}>
          <div className={`flex justify-between items-center text-sm ${theme.isTheme4 ? 'px-6 py-4 bg-transparent' : ''}`}>
            <span className={theme.isTheme4 ? 'text-[var(--text-muted)] text-[11px] uppercase tracking-wider' : theme.typography.meta}>Company Name</span>
            <span className={theme.isTheme4 ? 'text-[var(--text-primary)] font-medium text-[12px]' : `font-medium ${theme.typography.heading}`}>{business.businessName}</span>
          </div>
          
          {business.category && (
            <div className={`flex justify-between items-center text-sm ${theme.isTheme4 ? 'px-6 py-4 bg-[var(--gold)]/5' : ''}`}>
              <span className={theme.isTheme4 ? 'text-[var(--text-muted)] text-[11px] uppercase tracking-wider' : theme.typography.meta}>Nature of Business</span>
              <span className={theme.isTheme4 ? 'text-[var(--text-primary)] font-medium text-[12px]' : `font-medium ${theme.typography.heading}`}>{business.category}</span>
            </div>
          )}

          {business.yearEstd && (
            <div className={`flex justify-between items-center text-sm ${theme.isTheme4 ? 'px-6 py-4 bg-transparent' : ''}`}>
              <span className={theme.isTheme4 ? 'text-[var(--text-muted)] text-[11px] uppercase tracking-wider' : theme.typography.meta}>Year Established</span>
              <span className={theme.isTheme4 ? 'text-[var(--text-primary)] font-medium text-[12px]' : `font-medium ${theme.typography.heading}`}>{business.yearEstd}</span>
            </div>
          )}
          
          {business.address && (
            <div className={`flex justify-between text-sm ${theme.isTheme4 ? 'px-6 py-4 bg-[var(--gold)]/5' : 'mt-3 pt-3 border-t border-gray-100/10'}`}>
              <span className={theme.isTheme4 ? 'text-[var(--text-muted)] text-[11px] uppercase tracking-wider w-1/3' : `w-1/3 ${theme.typography.meta}`}>Address</span>
              <span className={theme.isTheme4 ? 'text-[var(--text-primary)] font-medium text-[12px] w-2/3 text-right' : `w-2/3 text-right font-medium text-[13px] ${theme.typography.heading}`}>
                {business.address}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
