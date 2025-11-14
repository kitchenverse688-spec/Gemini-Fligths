import React, { useState, useEffect } from 'react';
import { AMENITIES, STAR_RATINGS } from '../constants';

interface HotelFiltersProps {
  onFilterChange: (filters: { stars: number[]; amenities: string[] }) => void;
}

export const HotelFilters: React.FC<HotelFiltersProps> = ({ onFilterChange }) => {
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    onFilterChange({ stars: selectedStars, amenities: selectedAmenities });
  }, [selectedStars, selectedAmenities, onFilterChange]);

  const handleStarToggle = (star: number) => {
    setSelectedStars(prev => 
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const handleAmenityToggle = (amenityLabel: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityLabel) ? prev.filter(a => a !== amenityLabel) : [...prev, amenityLabel]
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6">
      <h3 className="font-bold text-slate-800 mb-3">Filter Results</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-slate-600 mb-2">Star Rating</h4>
          <div className="flex flex-wrap gap-2">
            {STAR_RATINGS.map(star => (
              <button 
                type="button" 
                key={star} 
                onClick={() => handleStarToggle(star)} 
                className={`px-3 py-1 border rounded-full text-sm transition ${
                  selectedStars.includes(star) 
                    ? 'bg-yellow-400 border-yellow-500 text-white' 
                    : 'bg-white border-slate-300 hover:border-slate-400'
                }`}
              >
                {star} <i className="fas fa-star text-xs"></i>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-slate-600 mb-2">Amenities</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {AMENITIES.map(amenity => (
              <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={selectedAmenities.includes(amenity.label)}
                  onChange={() => handleAmenityToggle(amenity.label)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{amenity.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};