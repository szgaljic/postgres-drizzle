import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add routes that don't require authentication
const publicRoutes = ['/', '/login', '/api/auth']

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected-page)
  const path = request.nextUrl.pathname

  // If it's a public route, don't check for authentication
  if (publicRoutes.some(route => path.startsWith(route))) {
    const response = NextResponse.next()
    response.headers.set('x-pathname', path)
    return response
  }

  // Check if user is authenticated
  const sessionToken = request.cookies.get('session_token')

  // If not authenticated, redirect to home page
  if (!sessionToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // If authenticated, allow the request and set pathname header
  const response = NextResponse.next()
  response.headers.set('x-pathname', path)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|hero.jpg).*)',
  ],
}
