// app/api/auth/[...nextauth]/route.ts or wherever you're using this
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Emails from "./models/Emails";
import { connectToDatabase } from "./lib/mongoose";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      try {
        await connectToDatabase();
        const email = user?.email;
        if (!email) return false;
        const list = await Emails.findOne();
        const isWhitelisted = list?.emails.includes(email.toLowerCase());
        return isWhitelisted;
      } catch (err) {
        console.error("SignIn check failed:", err);
        return false;
      }
    },
  },
});
