import { NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
  }
  // Simpler Demo-Save (nur für Dev/Testing!)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadPath = path.join("/tmp", file.name);
  await writeFile(uploadPath, buffer);

  return new Response(JSON.stringify({ success: true, file: file.name }), { status: 200 });
} 