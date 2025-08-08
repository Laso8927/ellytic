import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n';

export default createMiddleware({
  locales: Array.from(locales),
  defaultLocale
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Nur die Root-URL automatisch umleiten, nicht jede Unterseite
  if (pathname === "/") {
    const country = request.geo?.country || "";
    let locale = "en";
    if (country === "DE") locale = "de";
    else if (country === "GR") locale = "el";
    else if (country === "NL") locale = "nl";

    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    // Only run on pages, not on static files
    "/((?!api|_next|favicon.ico).*)",
  ],
}; 