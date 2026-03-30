// This is the root layout for /owner/* routes.
// It does NOT do auth checking — auth is handled by middleware
// and the (authenticated) group layout.
export default function OwnerRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
