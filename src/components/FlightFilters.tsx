import React, { useMemo, useState, useEffect } from 'react';
import type { FlightResult } from '../types';

interface FlightFiltersProps {
  results: FlightResult[];
  onFilterChange: (filters: { stops: number[]; airlines: string[] }) => void;
}

export const FlightFilters: React.FC<FlightFiltersProps> = ({ results, onFilterChange }) => {
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);

  const airlines = useMemo(() => {
    const airlineSet = new Set(results.map(r => r.airline));
    return Array.from(airlineSet).sort();
  }, [results]);

  useEffect(() => {
    onFilterChange({ stops: selectedStops, airlines: selectedAirlines });
  }, [selectedStops, selectedAirlines, onFilterChange]);

  const handleStopToggle = (stopCount: number) => {
    setSelectedStops(prev => 
      prev.includes(stopCount) ? prev.filter(s => s !== stopCount) : [...prev, stopCount]
    );
  };

  const handleAirlineToggle = (airline: string) => {
    setSelectedAirlines(prev =>
      prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6">
      <h3 className="font-bold text-slate-800 mb-3">Filter Results</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-slate-600 mb-2">Stops</h4>
          <div className="space-y-1">
            {[0, 1, 2].map(stopCount => (
              <label key={stopCount} className="flex items-center space-x-2 cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={selectedStops.includes(stopCount)} 
                  onChange={() => handleStopToggle(stopCount)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{stopCount === 0 ? 'Direct' : `${stopCount} stop${stopCount > 1 ? 's' : ''}`}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-slate-600 mb-2">Airlines</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {airlines.map(airline => (
              <label key={airline} className="flex items-center space-x-2 cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={selectedAirlines.includes(airline)} 
                  onChange={() => handleAirlineToggle(airline)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{airline}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};