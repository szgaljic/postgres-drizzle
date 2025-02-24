'use client';

import { HomeIcon, UserGroupIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Accounts', href: '/accounts', icon: UserGroupIcon },
  { name: 'Trade', href: '/trade', icon: CurrencyDollarIcon },
  { name: 'Research', href: '/research', icon: ChartBarIcon },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex h-full">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-[#0f172a] pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-white">Paper Trader</h1>
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      } mr-3 h-6 w-6 flex-shrink-0`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
