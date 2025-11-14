
import React from 'react';
import type { HotelResult } from '../types';

interface HotelCardProps {
  hotel: HotelResult;
  onSelect: (hotel: HotelResult) => void;
  isSelected: boolean;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <i
          key={i}
          className={`fa-solid fa-star ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`}
        ></i>
      ))}
    </div>
  );
};

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect, isSelected }) => {
  const cardClasses = `
    bg-white border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden 
    flex flex-col md:flex-row cursor-pointer
    ${isSelected ? 'border-blue-500 ring-2 ring-blue-500' : 'border-slate-200'}
  `;

  return (
    <div className={cardClasses} onClick={() => onSelect(hotel)}>
      <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
        <img 
          src={hotel.imageUrl} 
          alt={`Exterior of ${hotel.name}`} 
          className="h-48 w-full object-cover md:h-full"
        />
      </div>
      <div className="flex-grow p-4 md:p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-800">{hotel.name}</h3>
            <StarRating rating={hotel.stars} />
          </div>
          <p className="text-sm text-slate-500 mt-1 flex items-center">
            <i className="fa-solid fa-location-dot mr-2"></i>{hotel.address}
          </p>
          <div className="mt-3">
             <p className="text-sm text-slate-700 font-semibold">{hotel.roomType}</p>
             <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                {hotel.amenities.slice(0, 4).map(amenity => (
                    <span key={amenity} className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">{amenity}</span>
                ))}
             </div>
          </div>
        </div>
        <div className="border-t mt-4 pt-4 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-2xl font-bold text-slate-800">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: hotel.currency, minimumFractionDigits: 0 }).format(hotel.totalPrice)}
                </p>
                <p className="text-sm text-slate-500">Total for stay</p>
            </div>
             <div 
                className={`w-full md:w-auto text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 text-center shadow-sm ${
                    isSelected ? 'bg-blue-600' : 'bg-green-500'
                }`}
            >
                {isSelected ? 'Selected' : 'Select'}
            </div>
        </div>
      </div>
    </div>
  );
};
