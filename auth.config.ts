import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { z } from "zod"

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    })
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isOnResearch = nextUrl.pathname.startsWith("/research")
      const isOnTrade = nextUrl.pathname.startsWith("/trade")
      const isOnAccounts = nextUrl.pathname.startsWith("/accounts")
      
      if (isOnDashboard || isOnResearch || isOnTrade || isOnAccounts) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }
      return true
    },
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.sub
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  }
}
