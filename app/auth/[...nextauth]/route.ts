import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    // Google provider only when credentials are present
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    // Local development credentials provider (opt-in via ENABLE_DEV_LOGIN=1)
    ...(process.env.ENABLE_DEV_LOGIN === "1"
      ? [
          CredentialsProvider({
            name: "Dev Login",
            credentials: {
              email: { label: "Email", type: "email", placeholder: "dev@example.com" },
            },
            async authorize(credentials) {
              const email = (credentials?.email || "dev@example.com").toString();
              // Return minimal user; PrismaAdapter will create/find DB user as needed
              return { id: email, name: "Dev User", email } as any;
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, user }) {
      // Expose MFA flags to client
      if (session.user) {
        // @ts-expect-error augment runtime
        session.user.id = user.id;
        // @ts-expect-error augment runtime
        session.user.totpEnabled = (user as any).totpEnabled ?? false;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };