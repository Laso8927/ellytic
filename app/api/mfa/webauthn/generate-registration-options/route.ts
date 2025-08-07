import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { generateRegistrationOptions } from "@simplewebauthn/server";

const rpName = process.env.WEBAUTHN_RP_NAME ?? "Ellytic";
const rpID = process.env.WEBAUTHN_RP_ID ?? "localhost";
const origin = (process.env.NEXTAUTH_URL ?? `http://${rpID}:3000`).replace(/\/$/, "");

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) return new Response("Unauthorized", { status: 401 });
  const userId = session.user.id as string;
  const credentials = await prisma.webAuthnCredential.findMany({ where: { userId } });
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: userId,
    userName: session.user.email,
    attestationType: "none",
    excludeCredentials: credentials.map((c) => ({ id: Buffer.from(c.credentialId), type: "public-key" as const })),
    authenticatorSelection: { residentKey: "preferred", userVerification: "preferred" },
  });
  return Response.json(options);
}

