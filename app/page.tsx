import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import Table from '@/components/table'
import TablePlaceholder from '@/components/table-placeholder'
import ExpandingArrow from '@/components/expanding-arrow'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Portfolio Summary</h2>
          <p className="mt-2 text-sm text-gray-500">Coming soon...</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <p className="mt-2 text-sm text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  )
}
