import './globals.css'
import { Inter } from 'next/font/google'

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
    <html lang="en" className="h-full">
      <body className={`${inter.variable} h-full`}>
        {children}
      </body>
    </html>
  )
}
