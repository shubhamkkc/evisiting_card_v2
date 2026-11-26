import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = req.nextUrl;

  const isOwnerRoute =
    pathname.startsWith("/owner/dashboard") ||
    pathname.startsWith("/owner/edit") ||
    pathname.startsWith("/owner/create");
  const isAdminRoute =
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/businesses");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@evisitingcard.com";
  const isAdmin =
    !!user?.email && user.email.toLowerCase() === adminEmail.toLowerCase();

  // Not authenticated
  if (!user) {
    if (isOwnerRoute) {
      return NextResponse.redirect(new URL("/owner/login", req.url));
    }
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Authenticated but wrong area
  if (user && isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/owner/dashboard", req.url));
  }
  if (user && isOwnerRoute && isAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return res;
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
    "/owner/create/:path*",
    "/owner/create",
  ],
};
