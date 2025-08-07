import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const secret = authenticator.generateSecret();
  const label = `Ellytic:${session.user.email}`;
  const issuer = "Ellytic";
  const otpAuth = authenticator.keyuri(session.user.email, issuer, secret);
  const qr = await QRCode.toDataURL(otpAuth);

  await prisma.user.update({ where: { id: user.id }, data: { totpTempSecret: secret } });

  return Response.json({ qr, otpAuth });
}

