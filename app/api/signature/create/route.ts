import { NextResponse } from "next/server";
import { createSignatureProvider } from "@/lib/signature/factory";
import { PoAData } from "@/lib/signature/types";

export async function POST(req: Request) {
  try {
    const poaData: PoAData = await req.json();
    
    // Validate required fields
    if (!poaData.fullName || !poaData.email || !poaData.identityNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const provider = createSignatureProvider();
    const document = await provider.createDocument(poaData);
    
    return NextResponse.json({
      success: true,
      documentId: document.id,
      signUrl: document.signUrl,
      status: document.status
    });
  } catch (error) {
    console.error("Signature creation error:", error);
    return NextResponse.json(
      { error: "Failed to create signature document" },
      { status: 500 }
    );
  }
}