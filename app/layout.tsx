import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'Paper Trader',
  description: 'A simulated trading platform for paper trading',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.variable} h-full`}>
        <div className="flex h-full">
          <Navigation />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
