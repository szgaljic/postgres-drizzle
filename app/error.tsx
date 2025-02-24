'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log any errors to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
          <Button variant="outline" onClick={() => reset()}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}
