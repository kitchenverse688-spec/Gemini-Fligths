import React from 'react';
import type { FlightResult, HotelResult } from '../types';

interface TripSummaryCardProps {
  selectedFlight: FlightResult | null;
  selectedHotel: HotelResult | null;
}

const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
    }).format(amount);
};

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({ selectedFlight, selectedHotel }) => {
    const flightPrice = selectedFlight?.price || 0;
    const hotelPrice = selectedHotel?.totalPrice || 0;
    const currency = selectedFlight?.currency || selectedHotel?.currency || 'USD';
    const totalPrice = flightPrice + hotelPrice;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 mb-8 sticky top-24 z-40">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Trip</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                {/* Flight Selection */}
                <div className="col-span-1">
                    <h3 className="font-semibold text-slate-700 mb-2 flex items-center"><i className="fas fa-plane mr-2 text-blue-500"></i>Flight</h3>
                    {selectedFlight ? (
                        <div>
                            <p className="text-sm text-slate-600 truncate">{selectedFlight.airline} ({selectedFlight.flightNumber})</p>
                            <p className="text-lg font-bold text-slate-800 mt-1">{formatPrice(selectedFlight.price, selectedFlight.currency)}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">No flight selected</p>
                    )}
                </div>

                {/* Hotel Selection */}
                <div className="col-span-1">
                    <h3 className="font-semibold text-slate-700 mb-2 flex items-center"><i className="fas fa-hotel mr-2 text-blue-500"></i>Hotel</h3>
                    {selectedHotel ? (
                         <div>
                            <p className="text-sm text-slate-600 truncate">{selectedHotel.name}</p>
                            <p className="text-lg font-bold text-slate-800 mt-1">{formatPrice(selectedHotel.totalPrice, selectedHotel.currency)}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">No hotel selected</p>
                    )}
                </div>
                
                {/* Total */}
                <div className="col-span-1 bg-blue-50 p-4 rounded-lg text-center md:text-left">
                     <h3 className="font-semibold text-slate-700 mb-1">Total Price</h3>
                     <p className="text-2xl font-extrabold text-blue-600">{formatPrice(totalPrice, currency)}</p>
                </div>

                {/* Booking Buttons */}
                <div className="col-span-1 flex flex-col space-y-2">
                    <button 
                        onClick={() => selectedFlight && window.open(selectedFlight.bookingUrl, '_blank', 'noopener,noreferrer')}
                        disabled={!selectedFlight}
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:bg-slate-300 disabled:cursor-not-allowed shadow"
                    >
                        <i className="fas fa-plane-departure"></i>
                        <span>Book Flight</span>
                    </button>
                    <button 
                        onClick={() => selectedHotel && window.open(selectedHotel.bookingUrl, '_blank', 'noopener,noreferrer')}
                        disabled={!selectedHotel}
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:bg-slate-300 disabled:cursor-not-allowed shadow"
                    >
                        <i className="fas fa-hotel"></i>
                        <span>Book Hotel</span>
                    </button>
                </div>
            </div>
        </div>
    );
};