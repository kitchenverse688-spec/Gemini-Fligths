import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { FlightResults } from './components/FlightResults';
import { fetchFlightData, fetchHotelData } from './services/geminiService';
import type { FlightSearchInput, HotelSearchInput, FlightData, HotelData, FlightResult, HotelResult } from './types';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { HotelResults } from './components/HotelResults';
import { TripSummaryCard } from './components/TripSummaryCard';
import { ErrorCard } from './components/ErrorCard';

export interface TripSearchInput {
  flightInput: FlightSearchInput;
  hotelInput: HotelSearchInput;
}

const App: React.FC = () => {
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [isFlightLoading, setIsFlightLoading] = useState<boolean>(false);
  const [flightError, setFlightError] = useState<string | null>(null);

  const [hotelData, setHotelData] = useState<HotelData | null>(null);
  const [isHotelLoading, setIsHotelLoading] = useState<boolean>(false);
  const [hotelError, setHotelError] = useState<string | null>(null);

  const [selectedFlight, setSelectedFlight] = useState<FlightResult | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelResult | null>(null);


  const handleTripSearch = useCallback(async ({ flightInput, hotelInput }: TripSearchInput) => {
    setIsFlightLoading(true);
    setIsHotelLoading(true);
    setFlightError(null);
    setHotelError(null);
    setFlightData(null);
    setHotelData(null);
    setSelectedFlight(null);
    setSelectedHotel(null);

    try {
      const [flightResult, hotelResult] = await Promise.allSettled([
        fetchFlightData(flightInput),
        fetchHotelData(hotelInput)
      ]);

      if (flightResult.status === 'fulfilled') {
        setFlightData(flightResult.value);
      } else {
        console.error("Flight fetch error:", flightResult.reason);
        const errorMessage = flightResult.reason instanceof Error ? flightResult.reason.message : 'An unexpected error occurred fetching flights.';
        setFlightError(errorMessage);
      }
      
      if (hotelResult.status === 'fulfilled') {
        setHotelData(hotelResult.value);
      } else {
        console.error("Hotel fetch error:", hotelResult.reason);
        const errorMessage = hotelResult.reason instanceof Error ? hotelResult.reason.message : 'An unexpected error occurred fetching hotels.';
        setHotelError(errorMessage);
      }
    } finally {
      setIsFlightLoading(false);
      setIsHotelLoading(false);
    }
  }, []);

  const handleSelectFlight = (flight: FlightResult) => {
    setSelectedFlight(flight);
  };

  const handleSelectHotel = (hotel: HotelResult) => {
    setSelectedHotel(hotel);
  };

  const isLoading = isFlightLoading || isHotelLoading;
  const hasAnyData = flightData || hotelData;
  const hasAnyError = flightError || hotelError;
  const hasSearched = hasAnyData || hasAnyError;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Find Your Next Adventure</h1>
          <p className="text-slate-500 mb-8">AI-powered search for flights and hotels.</p>
          <SearchForm 
            onTripSearch={handleTripSearch}
            isLoading={isLoading} 
          />
        </div>

        <div className="mt-12">
          {isLoading && <LoadingSpinner />}
          
          {!isLoading && hasSearched && (
            <>
              {flightError && hotelError ? (
                <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
                    <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
                    <h3 className="text-xl font-semibold text-red-800">Trip Search Failed</h3>
                    <p className="text-red-600 mt-2">We couldn't fetch results for your trip.</p>
                    <div className="text-left mt-4 max-w-lg mx-auto bg-red-100 p-4 rounded-lg border border-red-200">
                        <p className="font-semibold text-red-700">Flight Error:</p>
                        <p className="text-sm text-red-600">{flightError}</p>
                        <p className="font-semibold text-red-700 mt-2">Hotel Error:</p>
                        <p className="text-sm text-red-600">{hotelError}</p>
                    </div>
                </div>
              ) : (
                <>
                  {(selectedFlight || selectedHotel) && (
                      <TripSummaryCard 
                        selectedFlight={selectedFlight} 
                        selectedHotel={selectedHotel} 
                      />
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 mt-8">
                      <div>
                          {flightData ? (
                              <FlightResults 
                                  data={flightData} 
                                  onSelectFlight={handleSelectFlight}
                                  selectedFlight={selectedFlight}
                              />
                          ) : flightError ? (
                              <ErrorCard title="Flight Search Failed" message={flightError} />
                          ) : null}
                      </div>
                      <div>
                          {hotelData ? (
                              <HotelResults 
                                  data={hotelData}
                                  onSelectHotel={handleSelectHotel}
                                  selectedHotel={selectedHotel}
                              />
                          ) : hotelError ? (
                              <ErrorCard title="Hotel Search Failed" message={hotelError} />
                          ) : null }
                      </div>
                  </div>
                </>
              )}
            </>
          )}

          {!isLoading && !hasSearched && (
             <div className="text-center py-16 px-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <i className="fa-solid fa-plane-up text-5xl text-blue-500 mb-4"></i>
                <h2 className="text-2xl font-bold text-slate-700">Ready for Takeoff?</h2>
                <p className="text-slate-500 mt-2">Enter your flight details to discover trip options curated by our AI.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;