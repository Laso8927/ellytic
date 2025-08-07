import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";

const rpID = process.env.WEBAUTHN_RP_ID ?? "localhost";
const origin = (process.env.NEXTAUTH_URL ?? `http://${rpID}:3000`).replace(/\/$/, "");

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const body = await request.json();
  const credential = await prisma.webAuthnCredential.findFirst({ where: { userId: session.user.id as string } });
  if (!credential) return new Response("No credentials", { status: 400 });
  const verification = await verifyAuthenticationResponse({
    response: body,
    expectedChallenge: body.expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialID: Buffer.from(credential.credentialId),
      credentialPublicKey: Buffer.from(credential.publicKey),
      counter: credential.counter,
      transports: credential.transports?.split(',') as any,
    },
  });
  if (!verification.verified) return Response.json({ verified: false });
  await prisma.webAuthnCredential.update({ where: { id: credential.id }, data: { counter: verification.authenticationInfo.newCounter } });
  return Response.json({ verified: true });
}

