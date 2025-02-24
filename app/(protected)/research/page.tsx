'use client';

import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResearchOverview } from './components/ResearchOverview';
import { StockDetail } from './components/StockDetail';

export default function ResearchPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-gray-900">Research</h1>
      <div className="mt-6">
        <SearchBar onSymbolSelect={setSelectedSymbol} />
        
        <div className="mt-6">
          {selectedSymbol ? (
            <StockDetail symbol={selectedSymbol} />
          ) : (
            <ResearchOverview />
          )}
        </div>
      </div>
    </div>
  );
}
