// admin/login has its own layout to escape the auth-protected parent layout
// This is intentionally minimal — no sidebar, no auth check
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
