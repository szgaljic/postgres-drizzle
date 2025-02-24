import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export type { Session } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      name: string
      email: string
      image: string
    }
  }
}

export const { 
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth(authConfig)
