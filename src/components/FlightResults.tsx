import React, { useState, useMemo } from 'react';
import type { FlightData, FlightResult } from '../types';
import { FlightCard } from './FlightCard';
import { AiSuggestionsCard } from './AiSuggestionsCard';
import { FlightFilters } from './FlightFilters';

interface FlightResultsProps {
  data: FlightData;
  onSelectFlight: (flight: FlightResult) => void;
  selectedFlight: FlightResult | null;
}

type SortKey = 'price' | 'duration' | 'departure';

interface FlightFiltersState {
  stops: number[];
  airlines: string[];
}

export const FlightResults: React.FC<FlightResultsProps> = ({ data, onSelectFlight, selectedFlight }) => {
  const [sortKey, setSortKey] = useState<SortKey>('price');
  const [filters, setFilters] = useState<FlightFiltersState>({ stops: [], airlines: [] });

  const filteredAndSortedResults = useMemo(() => {
    let results = [...data.results];

    // Apply filters
    if (filters.stops.length > 0) {
      results = results.filter(r => filters.stops.includes(r.stops));
    }
    if (filters.airlines.length > 0) {
      results = results.filter(r => filters.airlines.includes(r.airline));
    }

    // Apply sorting
    return results.sort((a, b) => {
      switch (sortKey) {
        case 'price':
          return a.price - b.price;
        case 'duration': {
            const getMinutes = (duration: string) => {
                const parts = duration.match(/(\d+)h\s*(\d+)m/);
                if (!parts) return 0;
                return parseInt(parts[1]) * 60 + parseInt(parts[2]);
            }
            return getMinutes(a.duration) - getMinutes(b.duration);
        }
        case 'departure':
          return new Date(a.departure).getTime() - new Date(b.departure).getTime();
        default:
          return 0;
      }
    });
  }, [data.results, sortKey, filters]);

  return (
    <div>
      <AiSuggestionsCard suggestions={data.aiSuggestions} />
      
      <div className="my-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Flight Options</h2>
            <div className="flex items-center space-x-2 bg-slate-200 p-1 rounded-lg">
                <SortButton label="Cheapest" sortValue="price" activeSort={sortKey} setSort={setSortKey} />
                <SortButton label="Fastest" sortValue="duration" activeSort={sortKey} setSort={setSortKey} />
                <SortButton label="Earliest" sortValue="departure" activeSort={sortKey} setSort={setSortKey} />
            </div>
        </div>
        
        <FlightFilters results={data.results} onFilterChange={setFilters} />

        <p className="text-sm text-slate-500 mb-4">Showing {filteredAndSortedResults.length} of {data.results.length} flights. Click one to select.</p>
        <div className="space-y-4">
          {filteredAndSortedResults.length > 0 ? (
            filteredAndSortedResults.map((result, index) => (
              <FlightCard 
                key={index} 
                flight={result}
                onSelect={onSelectFlight}
                isSelected={selectedFlight?.flightNumber === result.flightNumber && selectedFlight?.departure === result.departure} 
              />
            ))
          ) : (
            <div className="text-center py-10 px-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <i className="fa-solid fa-filter-circle-xmark text-4xl text-slate-400 mb-3"></i>
              <h3 className="text-lg font-semibold text-slate-700">No Flights Match Your Filters</h3>
              <p className="text-slate-500 mt-1">Try adjusting your filters to see more results.</p>
            </div>
          )}
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