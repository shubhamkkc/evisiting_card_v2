import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET ?? "fallback-dev-secret-do-not-use-in-prod" });
  const { pathname } = req.nextUrl;

  const isOwnerRoute = pathname.startsWith("/owner/dashboard") || pathname.startsWith("/owner/edit");
  const isAdminRoute = pathname.startsWith("/admin/dashboard") || pathname.startsWith("/admin/businesses");

  // Not authenticated
  if (!token) {
    if (isOwnerRoute) {
      return NextResponse.redirect(new URL("/owner/login", req.url));
    }
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Authenticated but wrong role
  if (token && isOwnerRoute && token.role !== "owner") {
    // Admin accessing owner route → redirect to admin dashboard
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/owner/login", req.url));
  }

  if (token && isAdminRoute && token.role !== "admin") {
    return NextResponse.redirect(new URL("/owner/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/dashboard",
    "/admin/businesses/:path*",
    "/admin/businesses",
    "/owner/dashboard/:path*",
    "/owner/dashboard",
    "/owner/edit/:path*",
    "/owner/edit",
  ],
};
