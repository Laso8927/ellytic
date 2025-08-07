import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { verifyRegistrationResponse } from "@simplewebauthn/server";

const rpID = process.env.WEBAUTHN_RP_ID ?? "localhost";
const origin = (process.env.NEXTAUTH_URL ?? `http://${rpID}:3000`).replace(/\/$/, "");

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const body = await request.json();
  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: body.expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });
  if (!verification.verified || !verification.registrationInfo) {
    return new Response(JSON.stringify({ verified: false }), { status: 200 });
  }
  const { credentialPublicKey, credentialID, counter, credentialBackedUp, credentialDeviceType } = verification.registrationInfo;
  await prisma.webAuthnCredential.create({
    data: {
      userId: session.user.id as string,
      credentialId: Buffer.from(credentialID),
      publicKey: Buffer.from(credentialPublicKey),
      counter,
      credentialBackedUp,
      credentialDeviceType,
    },
  });
  return Response.json({ verified: true });
}

