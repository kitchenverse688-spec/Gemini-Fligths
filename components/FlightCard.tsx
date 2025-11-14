
import React from 'react';
import type { FlightResult } from '../types';

interface FlightCardProps {
  flight: FlightResult;
  onSelect: (flight: FlightResult) => void;
  isSelected: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
};

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelect, isSelected }) => {
  const departureAirport = flight.flightNumber.substring(0,3);
  const arrivalAirport = flight.flightNumber.substring(0,3);

  const cardClasses = `
    bg-white border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer
    ${isSelected ? 'border-blue-500 ring-2 ring-blue-500' : 'border-slate-200'}
  `;

  return (
    <div className={cardClasses} onClick={() => onSelect(flight)}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 md:p-6">
        
        <div className="md:col-span-3 flex items-center space-x-4">
          <img 
            src={flight.airlineLogoUrl} 
            alt={`${flight.airline} logo`} 
            className="h-10 w-10 object-contain rounded-full bg-white p-1 border"
            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${flight.airline.charAt(0)}&background=random&size=128` }}
          />
          <div>
            <p className="font-bold text-slate-800">{flight.airline}</p>
            <p className="text-sm text-slate-500">{flight.flightNumber}</p>
          </div>
        </div>

        <div className="md:col-span-5 flex items-center justify-between md:justify-center text-center">
            <div className="w-1/3">
                <p className="text-xl font-semibold text-slate-900">{formatTime(flight.departure)}</p>
                <p className="text-sm text-slate-500">{departureAirport}</p>
                <p className="text-xs text-slate-400">{formatDate(flight.departure)}</p>
            </div>
            <div className="w-1/3 flex-shrink-0 text-center px-2">
                <div className="relative">
                    <hr className="border-slate-300"/>
                    <i className="fas fa-plane text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1"></i>
                </div>
                <p className="text-xs text-slate-500 mt-1">{flight.duration}</p>
            </div>
            <div className="w-1/3">
                <p className="text-xl font-semibold text-slate-900">{formatTime(flight.arrival)}</p>
                <p className="text-sm text-slate-500">{arrivalAirport}</p>
                <p className="text-xs text-slate-400">{formatDate(flight.arrival)}</p>
            </div>
        </div>

        <div className="md:col-span-1 text-center">
            <p className="text-sm text-slate-600">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
        </div>

        <div className="md:col-span-3 flex flex-col md:flex-row items-center justify-end gap-4 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
            <div className="text-center md:text-right">
                <p className="text-2xl font-bold text-slate-800">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: flight.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(flight.price)}
                </p>
                <p className="text-sm text-slate-500">Total price</p>
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
