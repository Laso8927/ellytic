import { NextResponse } from "next/server";
import { createSignatureProvider } from "@/lib/signature/factory";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-yousign-signature");
    const body = await req.text();
    
    // Verify webhook signature
    const webhookSecret = process.env.YOUSIGN_WEBHOOK_SECRET;
    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Implement proper HMAC verification
    // const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
    // if (signature !== expectedSignature) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const event = JSON.parse(body);
    
    if (event.event_name === "signature_request.done") {
      const documentId = event.data.id;
      
      // Update database to mark PoA as completed
      // This would typically update a user's record or session
      console.log(`PoA document ${documentId} completed successfully`);
      
      // TODO: Update wizard store or user record with poaAccepted: true
      // This might require storing documentId -> userId mapping
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}