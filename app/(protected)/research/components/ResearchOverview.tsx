import { z } from 'zod';

const indexSchema = z.object({
  name: z.string(),
  value: z.number(),
  change: z.number(),
  changePercent: z.number(),
});

type IndexData = z.infer<typeof indexSchema>;

// Mock data - will be replaced with real data later
const mockIndices: IndexData[] = [
  { name: 'DJIA', value: 43428.02, change: 0.00, changePercent: 0.00 },
  { name: 'NASDAQ', value: 19924.01, change: 0.00, changePercent: 0.00 },
  { name: 'S&P 500', value: 6013.13, change: 0.00, changePercent: 0.00 },
  { name: 'Russell 2000', value: 2195.35, change: 0.00, changePercent: 0.00 },
];

export function ResearchOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Market Overview</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockIndices.map((index) => (
            <div 
              key={index.name}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{index.name}</h3>
                  <p className="text-2xl font-semibold mt-1">
                    {index.value.toLocaleString(undefined, {
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
