const fs = require('fs');

const authCode = `
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize() {
        return { id: "1", name: "owner", role: "OWNER" }
      }
    })
  ]
})

// MOCK AUTH TO ALWAYS RETURN A SESSION
export const auth = async () => {
    return {
        user: { id: "1", name: "owner", role: "OWNER" }
    }
}
`;

fs.writeFileSync('D:\\Bangla ERP\\web\\src\\auth.ts', authCode, 'utf8');

const loginPageCode = `
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Instantly bypass login screen
    router.push("/");
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
      <p>Bypassing login...</p>
    </div>
  );
}
`;

fs.writeFileSync('D:\\Bangla ERP\\web\\src\\app\\login\\page.tsx', loginPageCode, 'utf8');

console.log("Successfully bypassed login completely!");
