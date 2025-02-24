import { NextRequest, NextResponse } from 'next/server';
import { polygonService } from '@/lib/services/polygon';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const details = await polygonService.getStockDetails(params.symbol);
    
    if (!details) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: details });
  } catch (error) {
    console.error('Error in stock details API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock details' },
      { status: 500 }
    );
  }
}
