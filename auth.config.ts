import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { z } from "zod"
import { db, UsersTable } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'

// Validation schema for Google profile
const googleProfileSchema = z.object({
  sub: z.string(),
  name: z.string(),
  email: z.string().email(),
  picture: z.string().url(),
})

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
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google' || !profile) {
        console.error('Only Google authentication is supported');
        return false;
      }

      try {
        // Validate profile data
        const validatedProfile = googleProfileSchema.parse({
          sub: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
        });

        // Check if user exists
        const existingUser = await db
          .select()
          .from(UsersTable)
          .where(eq(UsersTable.googleId, validatedProfile.sub))
          .then((res) => res[0]);

        if (!existingUser) {
          // Create new user
          await db.insert(UsersTable).values({
            googleId: validatedProfile.sub,
            name: validatedProfile.name,
            email: validatedProfile.email,
            image: validatedProfile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error('Error in Google sign in:', error);
        return false;
      }
    },
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
