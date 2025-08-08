import { NextRequest, NextResponse } from "next/server";
import { uploadBufferToS3 } from "@/lib/s3";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const category = String(form.get("category") || "misc");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const now = new Date().toISOString().replace(/[:.]/g, "-");
    const key = `${category}/${now}-${file.name}`;
    await uploadBufferToS3({ key, body: buffer, contentType: file.type });
    return NextResponse.json({ ok: true, key });
  } catch (e) {
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}

