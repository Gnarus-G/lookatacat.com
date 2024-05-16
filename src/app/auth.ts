import Nodemailer from "@auth/core/providers/nodemailer";
import { db } from "drizzle";
import {
  Accounts,
  Invitee,
  Sessions,
  Users,
  VerificationTokens,
} from "drizzle/schema";
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user }) {
      const invitees = await db.select().from(Invitee);
      if (!invitees.find((i) => i.email === user.email))
        throw "You're not invited!";
      return true;
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: Users,
    accountsTable: Accounts,
    sessionsTable: Sessions,
    verificationTokensTable: VerificationTokens,
  }),
  providers: [
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],

  /* pages: { */
  /*   error: "/auth/error", */
  /*   signIn: "/auth/signIn", */
  /*   verifyRequest: "/auth/verify-request", */
  /* }, */
});
