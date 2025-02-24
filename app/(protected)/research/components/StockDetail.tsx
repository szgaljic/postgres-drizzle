'use client';

import { useEffect, useState } from 'react';
import { marketDataSchema } from '@/lib/services/polygon';
import type { MarketData } from '@/lib/services/polygon';

interface StockDetailProps {
  symbol: string;
}

export function StockDetail({ symbol }: StockDetailProps) {
  const [stockData, setStockData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`/api/stocks/${encodeURIComponent(symbol)}`);
        const json = await response.json();
        
        if (!response.ok) {
          throw new Error(json.error || 'Failed to fetch stock data');
        }

        // Validate the response data
        const validatedData = marketDataSchema.parse(json.data);
        setStockData(validatedData);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stockData) {
    return (
      <div className="text-red-600">
        <h2 className="text-lg font-medium">Error Loading Stock Data</h2>
        <p className="mt-2">{error || 'Stock data not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">{stockData.name || stockData.ticker}</h2>
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow">
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-semibold">
              ${stockData.price.toFixed(2)}
            </span>
            <span className={`text-lg ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
            </span>
          </div>

          <div className="mt-6 h-96 flex items-center justify-center text-gray-500">
            Chart coming soon
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900">Key Statistics</h2>
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Open</p>
              <p className="font-medium">${stockData.open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">High</p>
              <p className="font-medium">${stockData.high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Low</p>
              <p className="font-medium">${stockData.low.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Volume</p>
              <p className="font-medium">{stockData.volume.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
