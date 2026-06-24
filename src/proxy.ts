import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/instructor", "/admin", "/cms", "/learn"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isFallbackLesson =
    pathname.includes("/fallback-") && pathname.includes("-lesson-");
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !isFallbackLesson && !req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname.startsWith("/admin") || pathname.startsWith("/cms")) && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/instructor") && !["INSTRUCTOR", "ADMIN"].includes(req.auth?.user?.role ?? "")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
