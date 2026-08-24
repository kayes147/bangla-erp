
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
