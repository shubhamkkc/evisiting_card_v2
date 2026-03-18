import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // Protect specific admin routes to avoid redirect loops on /admin/login
  matcher: [
    "/admin/dashboard/:path*", 
    "/admin/dashboard", 
    "/admin/businesses/:path*",
    "/admin/businesses"
  ],
};
