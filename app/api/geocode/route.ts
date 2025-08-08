import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Simple proxy to Nominatim for city lookup -> returns region, country, postcode
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q) return NextResponse.json({ error: "missing_q" }, { status: 400 });

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", q);

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "Ellytic/1.0 (+contact@ellytic.com)" },
    cache: "no-store",
  });
  const data = await res.json();
  const item = Array.isArray(data) && data[0];
  if (!item?.address) return NextResponse.json({ found: false });
  const a = item.address;
  return NextResponse.json({
    found: true,
    city: a.city || a.town || a.village || "",
    region: a.state || a.county || "",
    postcode: a.postcode || "",
    country: a.country || "",
    country_code: a.country_code || "",
  });
}

