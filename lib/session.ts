import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export type SessionUser = {
  id: number
  name: string
  email: string
  image: string
}

export async function getSession() {
  const session = await auth()
  return session?.user || null
}

export async function requireAuth() {
  const session = await getSession()
  
  if (!session) {
    redirect('/')
  }

  return session
}
