import { useState } from 'react';
import { z } from 'zod';

interface SearchBarProps {
  onSymbolSelect: (symbol: string) => void;
}

const symbolSchema = z.string().min(1).max(5).toUpperCase();

export function SearchBar({ onSymbolSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validSymbol = symbolSchema.parse(query);
      onSymbolSelect(validSymbol);
    } catch (error) {
      console.error('Invalid symbol');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      <h2 className="text-lg font-medium text-gray-900">Research Platform</h2>
      <p className="mt-2 text-sm text-gray-500">Search for stocks and market data</p>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter symbol or name"
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </form>
    </div>
  );
}
