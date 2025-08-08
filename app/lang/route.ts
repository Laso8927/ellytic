import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const lang = String(form.get("lang") || "en");
  const res = NextResponse.redirect(new URL(req.headers.get("referer") || "/", req.url));
  res.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}

