import { GET, POST } from "@/auth"
import { db, UsersTable } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Validation schema for Google profile
const googleProfileSchema = z.object({
  sub: z.string(),
  name: z.string(),
  email: z.string().email(),
  picture: z.string().url(),
})

// Extend the GET handler to include profile creation
const handler = async (req: Request) => {
  try {
    const response = await GET(req)
    return response
  } catch (error) {
    console.error('Auth error:', error)
    return new Response(null, { status: 500 })
  }
}

export { handler as GET, POST }
