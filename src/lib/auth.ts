import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { hashEmail } from "@/lib/identity";

/**
 * NextAuth — email magic link only. Independent from TalkAIQ.
 *
 * On first sign-in we create an Associate record and seed the AssociateIdentity
 * row with an email hash so we can look the associate up without ever joining
 * plaintext email against aggregates (seed §4.2).
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  pages: {
    signIn: "/channel/signup",
    verifyRequest: "/channel/signup?check=email",
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as { id?: string }).id = user.id;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.email) return;
      const emailHash = hashEmail(user.email);
      await db.associate.create({
        data: {
          userId: user.id,
          identity: {
            create: { emailHash },
          },
        },
      });
    },
  },
};
