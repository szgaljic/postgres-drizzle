import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Paper Trader',
  description: 'A simulated trading platform for paper trading',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

// Add paths that should not show the navigation bar
const publicPaths = ['/', '/login', '/signup']

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the current path
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || '/'
  const isPublicPath = publicPaths.includes(pathname)

  return (
    <html lang="en" className={`h-full ${isPublicPath ? '' : 'bg-gray-50'}`}>
      <body className={`${inter.variable} h-full`}>
        {isPublicPath ? (
          // Public pages (like landing) don't have the navigation and padding
          <main>{children}</main>
        ) : (
          // Authenticated pages have the navigation and padding
          <div className="flex h-full">
            <Navigation />
            <main className="flex-1 p-6">{children}</main>
          </div>
        )}
      </body>
    </html>
  )
}
