export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return new Response("Bad Request", { status: 400 });
    }
    // TODO: integrate email provider or persist to DB; for now just log
    console.log("CONTACT", { name, email, message });
    return Response.json({ ok: true });
  } catch {
    return new Response("Server Error", { status: 500 });
  }
}

