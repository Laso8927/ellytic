import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

const rpID = process.env.WEBAUTHN_RP_ID ?? "localhost";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const creds = await prisma.webAuthnCredential.findMany({ where: { userId: session.user.id as string } });
  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: creds.map((c) => ({ id: Buffer.from(c.credentialId), type: "public-key" as const })),
    userVerification: "preferred",
  });
  return Response.json(options);
}

