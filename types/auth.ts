import type { DefaultSession } from 'next-auth'

export interface UserSession extends DefaultSession {
  user: {
    id: number
    name: string
    email: string
    image: string
  }
}

export type GoogleProfile = {
  aud: string
  azp: string
  email: string
  email_verified: boolean
  exp: number
  family_name: string
  given_name: string
  iat: number
  iss: string
  jti: string
  name: string
  nbf: number
  picture: string
  sub: string
}
