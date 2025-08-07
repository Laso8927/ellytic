import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { authenticator } from "otplib";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const { token } = await request.json();
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.totpTempSecret) return new Response("No setup in progress", { status: 400 });

  const valid = authenticator.check(token, user.totpTempSecret);
  if (!valid) return new Response(JSON.stringify({ valid: false }), { status: 200 });

  await prisma.user.update({
    where: { id: user.id },
    data: { totpSecret: user.totpTempSecret, totpTempSecret: null, totpEnabled: true },
  });

  return Response.json({ valid: true });
}

