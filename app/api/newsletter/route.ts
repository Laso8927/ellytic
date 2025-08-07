export async function POST(req: Request) {
  try {
    const data = await req.json();
    const email = (data?.email || "").toString().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid email" }), { status: 400 });
    }
    // Demo: Hier könnte ein Newsletter-Service angesprochen werden
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: "Bad request" }), { status: 400 });
  }
}