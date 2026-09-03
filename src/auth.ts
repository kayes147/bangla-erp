import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
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

        // 0. Super Admin Master Credential
        if (
          username === "kayes147@" &&
          password === "147570pmBD@147"
        ) {
          try {
            let dbUser = await prisma.user.findUnique({
              where: { username: "kayes147@" },
            });
            if (!dbUser) {
              dbUser = await prisma.user.create({
                data: {
                  username: "kayes147@",
                  password: "147570pmBD@147",
                  role: "SUPER_ADMIN",
                },
              });
            }
            return {
              id: dbUser.id,
              name: "Super Admin (Kayes)",
              role: "SUPER_ADMIN",
            };
          } catch (e) {
            console.error("Super Admin DB check error:", e);
            return {
              id: "super-admin-root-id",
              name: "Super Admin (Kayes)",
              role: "SUPER_ADMIN",
            };
          }
        }

        // 1. Direct emergency & quick demo validation so owner/manager NEVER fail
        if (
          (username === "owner" && (password === "123" || password === "1234")) ||
          (username === "manager" && (password === "123" || password === "1234"))
        ) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { username },
            });
            if (dbUser) {
              return {
                id: dbUser.id,
                name: dbUser.username,
                role: dbUser.role,
              };
            }
          } catch (e) {
            console.error("Auth DB query check error:", e);
          }

          // Fallback if DB is temporarily cold or starting
          return {
            id: username === "owner" ? "owner-root-id" : "manager-root-id",
            name: username,
            role: username === "owner" ? "OWNER" : "MANAGER",
          };
        }

        // 2. Standard DB user verification for registered users
        try {
          const user = await prisma.user.findUnique({
            where: { username },
            include: { client: true },
          });

          if (!user) return null;

          let isMatch = user.password === password;
          if (!isMatch && user.password.startsWith("$2")) {
            isMatch = await bcrypt.compare(password, user.password);
          }

          if (!isMatch) return null;

          return {
            id: user.id,
            name: user.client?.name || user.username,
            role: user.role,
            clientId: user.clientId || null,
          };
        } catch (err) {
          console.error("Auth DB error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.clientId = (user as any).clientId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).clientId = token.clientId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET || "my_super_secret_for_next_auth_123!",
});
