import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country") || "";
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    let locale = "en";
    if (country === "DE") locale = "de";
    else if (country === "NL") locale = "nl";
    else if (country === "GR") locale = "el";

    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return NextResponse.next();
}