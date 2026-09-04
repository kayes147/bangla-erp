import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
            const [dbUser, biz] = await Promise.all([
              prisma.user.findUnique({ where: { username } }),
              prisma.businessProfile.findFirst(),
            ]);
            if (dbUser) {
              const displayName = (dbUser.role === "OWNER" && biz?.ownerName) 
                ? biz.ownerName 
                : dbUser.username;
              return {
                id: dbUser.id,
                name: displayName,
                username: dbUser.username,
                role: dbUser.role,
              };
            }
          } catch (e) {
            console.error("Auth DB query check error:", e);
          }

          // Fallback if DB is temporarily cold or starting
          return {
            id: username === "owner" ? "owner-root-id" : "manager-root-id",
            name: username === "owner" ? "Hasibul Islam" : username,
            username: username,
            role: username === "owner" ? "OWNER" : "MANAGER",
          };
        }

        // 2. Standard DB user verification for registered users
        try {
          const [user, biz] = await Promise.all([
            prisma.user.findUnique({
              where: { username },
              include: { client: true },
            }),
            prisma.businessProfile.findFirst(),
          ]);

          if (!user) return null;

          let isMatch = user.password === password;
          if (!isMatch && user.password.startsWith("$2")) {
            isMatch = await bcrypt.compare(password, user.password);
          }

          if (!isMatch) return null;

          let resolvedName = user.client?.name || user.username;
          if (user.role === "OWNER" && biz?.ownerName) {
            resolvedName = biz.ownerName;
          }

          return {
            id: user.id,
            name: resolvedName,
            username: user.username,
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
});
