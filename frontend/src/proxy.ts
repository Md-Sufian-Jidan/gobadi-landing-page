import { NextRequest, NextResponse } from "next/server";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  const decoded = decodeJwtPayload(token);
  const role = decoded?.role as string;

  // Admin roles: "admin" or "super_admin"
  const isAdmin = ["admin", "super_admin"].includes(role);

  const adminRoutes = [
    "/dashboard",
    "/dashboard/admin-access",
    "/dashboard/animal-list",
    "/dashboard/notifications",
    "/dashboard/user-list",
    "/dashboard/user-list/farmers",
    "/dashboard/user-list/doctors",
    "/dashboard/settings",
  ];

  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // If accessing admin routes, user must have admin role
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
