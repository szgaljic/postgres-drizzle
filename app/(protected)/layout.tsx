import { requireAuth } from '@/lib/session'
import Navigation from '@/components/Navigation'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect to / if user is not authenticated
  await requireAuth()

  return (
    <div className="flex h-full">
      <Navigation />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
