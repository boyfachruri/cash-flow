import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value || null;
  const userData = req.cookies.get("user")?.value || null;
  const user = userData ? JSON.parse(userData) : null;

  // Jika tidak ada token, redirect ke login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Jika role bukan admin, dan mencoba akses halaman admin, redirect ke dashboard
  if (req.nextUrl.pathname.startsWith("/main/user-list") && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/main/dashboard", req.url));
  }

  return NextResponse.next();
}

// Tentukan path yang akan diproses oleh middleware
export const config = {
  matcher: ["/main/user-list", "/main/dashboard"], // Tambahkan halaman yang perlu dicek
};
