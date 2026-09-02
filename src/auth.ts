import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = String(credentials.username).toLowerCase().trim();
        const password = String(credentials.password).trim();

        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user) return null;

        // Compare plain text or bcrypt hash
        let isMatch = user.password === password;
        if (!isMatch && user.password.startsWith("$2")) {
          isMatch = await bcrypt.compare(password, user.password);
        }

        // Allow both 123 and 1234 for demo/test accounts so users never get locked out
        if (!isMatch && (user.username === "owner" || user.username === "manager")) {
          if (password === "123" || password === "1234") {
            isMatch = true;
          }
        }

        if (!isMatch) return null;

        return {
          id: user.id,
          name: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET || "bangla-erp-secret-key-1234567890",
});
