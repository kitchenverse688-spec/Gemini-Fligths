
import React, { useState, useMemo } from 'react';
import type { HotelData, HotelResult } from '../types';
import { HotelCard } from './HotelCard';
import { HotelAiSuggestionsCard } from './HotelAiSuggestionsCard';

interface HotelResultsProps {
  data: HotelData;
  onSelectHotel: (hotel: HotelResult) => void;
  selectedHotel: HotelResult | null;
}

type SortKey = 'price' | 'rating';

export const HotelResults: React.FC<HotelResultsProps> = ({ data, onSelectHotel, selectedHotel }) => {
  const [sortKey, setSortKey] = useState<SortKey>('price');

  const sortedResults = useMemo(() => {
    return [...data.results].sort((a, b) => {
      switch (sortKey) {
        case 'price':
          return a.totalPrice - b.totalPrice;
        case 'rating':
          return b.stars - a.stars;
        default:
          return 0;
      }
    });
  }, [data.results, sortKey]);

  return (
    <div>
      <HotelAiSuggestionsCard suggestions={data.aiSuggestions} />
      
      <div className="my-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Hotel Options</h2>
            <div className="flex items-center space-x-2 bg-slate-200 p-1 rounded-lg">
                <SortButton label="Cheapest" sortValue="price" activeSort={sortKey} setSort={setSortKey} />
                <SortButton label="Best Rating" sortValue="rating" activeSort={sortKey} setSort={setSortKey} />
            </div>
        </div>
        <p className="text-sm text-slate-500 mb-4">Found {sortedResults.length} hotels. Click one to select.</p>
        <div className="space-y-4">
          {sortedResults.map((result, index) => (
            <HotelCard 
                key={index} 
                hotel={result}
                onSelect={onSelectHotel}
                isSelected={selectedHotel?.name === result.name && selectedHotel?.address === result.address} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface SortButtonProps {
    label: string;
    sortValue: SortKey;
    activeSort: SortKey;
    setSort: (key: SortKey) => void;
}

const SortButton: React.FC<SortButtonProps> = ({ label, sortValue, activeSort, setSort }) => {
    const isActive = activeSort === sortValue;
    return (
        <button 
            onClick={() => setSort(sortValue)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-300'
            }`}
        >
            {label}
        </button>
    );
}
