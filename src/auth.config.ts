import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET || "my_super_secret_for_next_auth_123!",
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isPublic = 
        pathname === "/login" || 
        pathname === "/register" || 
        pathname === "/select-company";

      if (isPublic) {
        if (isLoggedIn) {
          const userRole = (auth?.user as any)?.role;
          if (userRole === "SUPER_ADMIN") {
            return Response.redirect(new URL("/super-admin", nextUrl));
          }
          if (userRole === "CLIENT") {
            return Response.redirect(new URL("/portal/dashboard", nextUrl));
          }
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.clientId = (user as any).clientId;
        token.username = (user as any).username;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).clientId = token.clientId as string;
        (session.user as any).username = token.username as string;
      }
      return session;
    },
  },
  providers: [],
};
