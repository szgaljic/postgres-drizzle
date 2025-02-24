'use client';

import { useSWR } from 'swr';
import { marketDataSchema } from '@/lib/services/polygon';
import type { MarketData } from '@/lib/services/polygon';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch market data');
  }
  const json = await response.json();
  return json.data.map((item: unknown) => marketDataSchema.parse(item));
};

export function ResearchOverview() {
  const { data: marketData, error, isLoading } = useSWR<MarketData[]>('/api/market', fetcher, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: false, // Don't revalidate on window focus
  });

  if (error) {
    return (
      <div className="text-red-500">
        Error loading market data: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-lg font-medium text-gray-900">Market Overview</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!marketData || marketData.length === 0) {
    return <div>No market data available</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Market Overview</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.map((index) => (
            <div 
              key={index.ticker}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{index.name || index.ticker}</h3>
                  <p className="text-2xl font-semibold mt-1">
                    {index.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className={`text-right ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <p>{index.change.toFixed(2)}</p>
                  <p>({index.changePercent.toFixed(2)}%)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
            <div className="h-96 flex items-center justify-center text-gray-500">
              Chart coming soon
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
            <h3 className="font-medium text-gray-900 mb-4">Market Reports</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Weekly Highlights</p>
                <p className="text-gray-500">Latest report 02/21/2025</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Large Cap Pick List</p>
                <p className="text-gray-500">Latest report 02/01/2025</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Mid Cap Pick List</p>
                <p className="text-gray-500">Latest report 02/01/2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
