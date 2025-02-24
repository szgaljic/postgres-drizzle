import { NextResponse } from 'next/server';
import { polygonService } from '@/lib/services/polygon';

// Major indices symbols
const MAJOR_INDICES = [
  'DJI',   // Dow Jones Industrial Average
  'IXIC',  // NASDAQ Composite
  'SPX',   // S&P 500
  'RUT',   // Russell 2000
];

export async function GET() {
  try {
    const marketData = await polygonService.getGroupedDailyData();
    
    // Add caching headers - cache for 1 minute
    return new NextResponse(JSON.stringify({ data: marketData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error in market API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
