
import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country") || "";
  let locale = "en";
  if (country === "DE") locale = "de";
  else if (country === "GR") locale = "el";
  else if (country === "NL") locale = "nl";
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}
