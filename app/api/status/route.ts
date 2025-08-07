export async function GET() {
  return new Response(JSON.stringify({
    afm: "In Review",
    bank: "Submitted",
    translation: "Completed"
  }), { status: 200 });
} 