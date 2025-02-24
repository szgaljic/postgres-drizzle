import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type SessionUser = {
  id: number
  name: string
  email: string
  image: string
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('session_token')
  
  if (!sessionToken) {
    return null
  }

  // TODO: Validate session token and return user data
  // This will be implemented when we add Google SSO
  return null
}

export async function requireAuth() {
  const session = await getSession()
  
  if (!session) {
    redirect('/')
  }

  return session
}
