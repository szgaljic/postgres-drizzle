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
    
    // Only handle callback requests
    if (req.url.includes('/callback')) {
      const searchParams = new URL(req.url).searchParams
      const code = searchParams.get('code')
      
      if (code) {
        // Get profile from session token
        const profile = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
          headers: {
            Authorization: `Bearer ${code}`,
          },
        }).then(res => res.json())
        
        try {
          const validatedProfile = googleProfileSchema.parse(profile)
          
          // Check if user exists
          const existingUser = await db
            .select()
            .from(UsersTable)
            .where(eq(UsersTable.googleId, validatedProfile.sub))
            .then((res) => res[0])
            
          if (!existingUser) {
            // Create new user
            await db.insert(UsersTable).values({
              googleId: validatedProfile.sub,
              name: validatedProfile.name,
              email: validatedProfile.email,
              image: validatedProfile.picture,
            })
          }
        } catch (error) {
          console.error('Error creating user profile:', error)
        }
      }
    }
    
    return response
  } catch (error) {
    console.error('Auth error:', error)
    return new Response(null, { status: 500 })
  }
}

export { handler as GET, POST }
