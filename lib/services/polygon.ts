import { restClient } from '@polygon.io/client-js';
import { z } from 'zod';

// Validation schemas
export const groupedDailySchema = z.object({
  T: z.string(),  // Ticker
  v: z.number(),  // Trading volume
  o: z.number(),  // Open price
  c: z.number(),  // Close price
  h: z.number(),  // High price
  l: z.number(),  // Low price
  t: z.number(),  // Timestamp
  n: z.number(),  // Number of transactions
});

export const marketDataSchema = z.object({
  ticker: z.string(),
  name: z.string().optional(),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
  volume: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
});

export const snapshotDaySchema = z.object({
  c: z.number(),
  h: z.number(),
  l: z.number(),
  o: z.number(),
  v: z.number().optional(),
});

export const snapshotTickerSchema = z.object({
  ticker: z.string(),
  day: snapshotDaySchema,
  todaysChange: z.number(),
  todaysChangePerc: z.number(),
  updated: z.number(),
});

export const snapshotResponseSchema = z.object({
  ticker: snapshotTickerSchema,
  status: z.string(),
  request_id: z.string(),
});

export const snapshotAllResponseSchema = z.object({
  status: z.string(),
  tickers: z.array(snapshotTickerSchema),
  request_id: z.string(),
});

export type GroupedDaily = z.infer<typeof groupedDailySchema>;
export type MarketData = z.infer<typeof marketDataSchema>;

// Major indices and their display names
export const MAJOR_STOCKS = {
  'TSLA': 'Tesla',
  'NVDA': 'NVIDIA Corp',
  'MSFT': 'Microsoft Corp',
  'AMZN': 'Amazon Corp',
} as const;

// Initialize the REST client
const rest = restClient(process.env.POLYGON_API_KEY || '');

export class PolygonService {
  private static instance: PolygonService;
  private previousDayData: Map<string, GroupedDaily> = new Map();

  private constructor() {}

  public static getInstance(): PolygonService {
    if (!PolygonService.instance) {
      PolygonService.instance = new PolygonService();
    }
    return PolygonService.instance;
  }

  private async getPreviousTradingDay(): Promise<string> {
    const now = new Date();
    // If it's before market open (9:30 AM ET), use two days ago as the base
    const baseDate = now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() < 30) 
      ? new Date(now.setDate(now.getDate() - 2))
      : new Date(now.setDate(now.getDate() - 1));
    
    // Format as YYYY-MM-DD
    return baseDate.toISOString().split('T')[0];
  }

  async getGroupedDailyData(): Promise<MarketData[]> {
    try {
      // Get snapshots for all major indices using snapshotAllTickers
      const response = await rest.stocks.snapshotAllTickers();

      // Validate response
      const validatedResponse = snapshotAllResponseSchema.parse(response);

      if (!validatedResponse.tickers || validatedResponse.tickers.length === 0) {
        console.warn('No tickers returned from Polygon API');
        return [];
      }

      // Filter for major indices and transform data
      const results = validatedResponse.tickers
        .filter((ticker): ticker is z.infer<typeof snapshotTickerSchema> => 
          ticker.ticker in MAJOR_STOCKS)
        .map(ticker => {
          const day = ticker.day;
          return {
            ticker: ticker.ticker,
            name: MAJOR_STOCKS[ticker.ticker as keyof typeof MAJOR_STOCKS],
            price: day.c,
            change: day.c - day.o,
            changePercent: ((day.c - day.o) / day.o) * 100,
            open: day.o,
            high: day.h,
            low: day.l,
            volume: day.v ?? 0
          };
        });

      return results;
    } catch (error) {
      console.error('Error fetching indices data:', error);
      throw error;
    }
  }

  async getStockDetails(symbol: string): Promise<MarketData | null> {
    try {
      // Check if this is an index
      const indexSymbol = `I:${symbol}`;
      if (indexSymbol in MAJOR_STOCKS) {
        const response = await rest.stocks.snapshotTicker(indexSymbol);
        
        // Validate response
        const validatedResponse = snapshotResponseSchema.parse(response);
        const ticker = validatedResponse.ticker;
        const day = ticker.day;
        
        return {
          ticker: symbol,
          name: MAJOR_STOCKS[indexSymbol as keyof typeof MAJOR_STOCKS],
          price: day.c,
          change: day.c - day.o,
          changePercent: ((day.c - day.o) / day.o) * 100,
          open: day.o,
          high: day.h,
          low: day.l,
          volume: day.v ?? 0
        };
      }

      // If not an index, use aggregates for stocks
      const date = await this.getPreviousTradingDay();
      const response = await rest.stocks.aggregates(
        symbol,
        1,
        'day',
        date,
        date,
        {
          adjusted: true
        }
      );

      // Validate response
      const validatedResponse = groupedDailySchema.parse(response);

      if (!validatedResponse.results || validatedResponse.results.length === 0) {
        return null;
      }

      const data = validatedResponse.results[0];
      
      return {
        ticker: symbol,
        name: symbol,  // For stocks, just use the symbol as name
        price: data.c,
        change: data.c - data.o,
        changePercent: ((data.c - data.o) / data.o) * 100,
        open: data.o,
        high: data.h,
        low: data.l,
        volume: data.v
      };
    } catch (error) {
      console.error('Error fetching details:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const polygonService = PolygonService.getInstance();
