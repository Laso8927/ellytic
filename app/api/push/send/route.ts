import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import webpush from "web-push";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const mail = process.env.VAPID_CONTACT ?? "mailto:admin@example.com";
  if (!pub || !priv) return new Response("VAPID keys missing", { status: 500 });
  webpush.setVapidDetails(mail, pub, priv);
  const subs = await prisma.pushSubscription.findMany({ where: { userId: session.user.id as string } });
  await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification(
        {
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth },
        } as any,
        JSON.stringify({ title: "Ellytic", body: "Approve login?" })
      )
    )
  );
  return Response.json({ ok: true });
}

