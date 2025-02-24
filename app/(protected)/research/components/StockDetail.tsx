import { z } from 'zod';

interface StockDetailProps {
  symbol: string;
}

const stockSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
  previousClose: z.number(),
  open: z.number(),
  volume: z.number(),
  dayRange: z.object({
    low: z.number(),
    high: z.number(),
  }),
  yearRange: z.object({
    low: z.number(),
    high: z.number(),
  }),
});

type StockData = z.infer<typeof stockSchema>;

// Mock data - will be replaced with real data later
const mockStockData: StockData = {
  symbol: 'TSLA',
  name: 'Tesla Inc',
  price: 337.30,
  change: -16.60,
  changePercent: -4.68,
  previousClose: 354.40,
  open: 353.44,
  volume: 74100000,
  dayRange: {
    low: 334.42,
    high: 354.98,
  },
  yearRange: {
    low: 138.80,
    high: 468.54,
  },
};

export function StockDetail({ symbol }: StockDetailProps) {
  // In reality, we would fetch the data here based on the symbol
  const stock = mockStockData;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">{stock.name}</h2>
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow">
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-semibold">${stock.price.toFixed(2)}</span>
            <span className={`text-lg ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
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
              <p className="text-sm text-gray-500">Previous Close</p>
              <p className="font-medium">${stock.previousClose.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Open</p>
              <p className="font-medium">${stock.open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Day's Range</p>
              <p className="font-medium">
                ${stock.dayRange.low.toFixed(2)} - ${stock.dayRange.high.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">52 Week Range</p>
              <p className="font-medium">
                ${stock.yearRange.low.toFixed(2)} - ${stock.yearRange.high.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Volume</p>
              <p className="font-medium">{stock.volume.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900">Ratings & Reports</h2>
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow">
          <div className="space-y-4">
            <div>
              <p className="font-medium">Schwab Equity Rating</p>
              <p className="text-sm text-gray-500">Updated 02/21/2025</p>
              <div className="mt-2 grid grid-cols-5 gap-1">
                {['F', 'D', 'C', 'B', 'A'].map((grade) => (
                  <div
                    key={grade}
                    className={`text-center py-1 text-sm
                      ${grade === 'F' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  >
                    {grade}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium">Morningstar Rating</p>
              <p className="text-sm text-gray-500">Updated 02/19/2025</p>
              <div className="mt-2">★★☆☆☆</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
