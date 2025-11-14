
import React, { useState, useEffect } from 'react';
import type { FlightSearchInput, Traveler, HotelSearchInput, Room } from '../types';
import { CABIN_CLASSES, CURRENCIES, AIRPORTS, AMENITIES, STAR_RATINGS } from '../constants';
import type { TripSearchInput } from '../App';

interface SearchFormProps {
  onTripSearch: (searchInput: TripSearchInput) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onTripSearch, isLoading }) => {
    const [searchType, setSearchType] = useState<'flights' | 'hotels'>('flights');
    
    // Unified State
    const [from, setFrom] = useState('KWI');
    const [to, setTo] = useState('DXB');
    const [departureDate, setDepartureDate] = useState('2025-12-10');
    const [returnDate, setReturnDate] = useState('2025-12-15');
    const [currency, setCurrency] = useState('KWD');

    // Flight-specific State
    const [isOneWay, setIsOneWay] = useState(false);
    const [travelers, setTravelers] = useState<Traveler[]>([{ age: 30 }]);
    const [cabinClass, setCabinClass] = useState(CABIN_CLASSES[0]);
    const [directOnly, setDirectOnly] = useState(false);
    
    // Hotel-specific State
    const [city, setCity] = useState('Dubai, AE');
    const [rooms, setRooms] = useState<Room[]>([{ adults: 2, children: 0 }]);
    const [stars, setStars] = useState<number[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);

    // Sync state from flights to hotels
    useEffect(() => {
        const destinationAirport = AIRPORTS.find(a => a.code === to);
        setCity(destinationAirport ? destinationAirport.name : to);
    }, [to]);
    
    useEffect(() => {
        if(isOneWay && returnDate) {
            setReturnDate('');
        } else if (!isOneWay && !returnDate) {
            // Set a default return date if switching back to round trip
            const depDate = new Date(departureDate);
            depDate.setDate(depDate.getDate() + 5);
            setReturnDate(depDate.toISOString().split('T')[0]);
        }
    }, [isOneWay, departureDate, returnDate]);

    // Handlers for flight form
    const handleAddTraveler = () => setTravelers([...travelers, { age: 30 }]);
    const handleRemoveTraveler = (index: number) => {
        if (travelers.length > 1) setTravelers(travelers.filter((_, i) => i !== index));
    };
    const handleTravelerAgeChange = (index: number, age: string) => {
        const newTravelers = [...travelers];
        newTravelers[index] = { age: parseInt(age, 10) || 0 };
        setTravelers(newTravelers);
    };
    const swapLocations = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
    }
    
    // Handlers for hotel form
    const handleAddRoom = () => setRooms([...rooms, { adults: 1, children: 0 }]);
    const handleRemoveRoom = (index: number) => {
        if (rooms.length > 1) setRooms(rooms.filter((_, i) => i !== index));
    };
    const handleRoomChange = (index: number, field: 'adults' | 'children', value: string) => {
        const newRooms = [...rooms];
        newRooms[index] = { ...newRooms[index], [field]: Math.max(0, parseInt(value, 10) || 0) };
        setRooms(newRooms);
    };
    const handleStarToggle = (star: number) => setStars(prev => prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]);
    const handleAmenityToggle = (amenityId: string) => setAmenities(prev => prev.includes(amenityId) ? prev.filter(a => a !== amenityId) : [...prev, amenityId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const flightInput: FlightSearchInput = {
            from, to, departureDate, 
            returnDate: isOneWay ? undefined : returnDate,
            travelers, cabinClass, directOnly, currency
        };
        const hotelInput: HotelSearchInput = {
            city, checkInDate: departureDate, checkOutDate: returnDate,
            rooms, stars, amenities, currency
        };
        onTripSearch({ flightInput, hotelInput });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6 border-b border-slate-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button type="button" onClick={() => setSearchType('flights')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-base transition-colors ${searchType === 'flights' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                       <i className="fa-solid fa-plane mr-2"></i> Flights
                    </button>
                    <button type="button" onClick={() => setSearchType('hotels')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-base transition-colors ${searchType === 'hotels' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                       <i className="fa-solid fa-hotel mr-2"></i> Hotels
                    </button>
                </nav>
            </div>

            {searchType === 'flights' && (
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="relative col-span-1 md:col-span-2 lg:col-span-2 flex items-center">
                        <div className="w-1/2">
                            <label htmlFor="from" className="block text-sm font-medium text-slate-600 mb-1">From</label>
                            <div className="relative">
                                <i className="fa-solid fa-plane-departure absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"></i>
                                <select id="from" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white" required>
                                    {AIRPORTS.map(airport => (<option key={airport.code} value={airport.code}>{airport.name} ({airport.code})</option>))}
                                </select>
                                <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                            </div>
                        </div>
                        <button type="button" onClick={swapLocations} className="p-2 mt-4 bg-slate-100 hover:bg-blue-100 rounded-full z-10 mx-[-14px] border-4 border-white text-slate-500 hover:text-blue-600 transition-transform duration-300 hover:rotate-180">
                            <i className="fa-solid fa-exchange-alt"></i>
                        </button>
                        <div className="w-1/2">
                            <label htmlFor="to" className="block text-sm font-medium text-slate-600 mb-1">To</label>
                            <div className="relative">
                                <i className="fa-solid fa-plane-arrival absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"></i>
                                <select id="to" value={to} onChange={(e) => setTo(e.target.value)} className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white" required>
                                    {AIRPORTS.map(airport => (<option key={airport.code} value={airport.code}>{airport.name} ({airport.code})</option>))}
                                </select>
                                <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="departureDate" className="block text-sm font-medium text-slate-600 mb-1">Departure</label>
                        <input type="date" id="departureDate" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
                    </div>
                    <div>
                        <label htmlFor="returnDate" className="block text-sm font-medium text-slate-600 mb-1">Return</label>
                        <input type="date" id="returnDate" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" disabled={isOneWay} />
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                    <div className="flex items-center">
                        <input id="oneWay" type="checkbox" checked={isOneWay} onChange={(e) => setIsOneWay(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="oneWay" className="ml-2 block text-sm text-gray-900">One-way trip</label>
                    </div>
                    <div className="flex items-center">
                        <input id="directOnly" type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="directOnly" className="ml-2 block text-sm text-gray-900">Direct flights only</label>
                    </div>
                    <div>
                        <label htmlFor="cabinClass" className="sr-only">Cabin Class</label>
                        <select id="cabinClass" value={cabinClass} onChange={(e) => setCabinClass(e.target.value)} className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500">
                            {CABIN_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-slate-600 mb-2">Travelers</h3>
                    <div className="space-y-2">
                        {travelers.map((traveler, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <label className="text-sm text-slate-500 w-20">Traveler {index + 1}</label>
                                <input type="number" value={traveler.age} onChange={(e) => handleTravelerAgeChange(index, e.target.value)} className="w-24 p-1 border border-slate-300 rounded-md text-sm" placeholder="Age" min="0"/>
                                {travelers.length > 1 && (<button type="button" onClick={() => handleRemoveTraveler(index)} className="text-red-500 hover:text-red-700"><i className="fas fa-times-circle"></i></button>)}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={handleAddTraveler} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-semibold">+ Add Traveler</button>
                </div>
              </div>
            )}

            {searchType === 'hotels' && (
               <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                            <label htmlFor="city" className="block text-sm font-medium text-slate-600 mb-1">Destination</label>
                            <input type="text" id="city" value={city} onChange={e => setCity(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-slate-100" required readOnly/>
                        </div>
                        <div>
                            <label htmlFor="checkin" className="block text-sm font-medium text-slate-600 mb-1">Check-in</label>
                            <input type="date" id="checkin" value={departureDate} onChange={e => setDepartureDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                        <div>
                            <label htmlFor="checkout" className="block text-sm font-medium text-slate-600 mb-1">Check-out</label>
                            <input type="date" id="checkout" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" disabled={isOneWay} required />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-600 mb-2">Rooms & Guests</h3>
                        {rooms.map((room, index) => (
                            <div key={index} className="flex items-center gap-4 mb-2 p-2 bg-slate-50 rounded-md">
                                <span className="font-semibold text-sm text-slate-600">Room {index + 1}</span>
                                <label className="text-sm">Adults <input type="number" min="1" value={room.adults} onChange={e => handleRoomChange(index, 'adults', e.target.value)} className="w-16 p-1 border rounded-md" /></label>
                                <label className="text-sm">Children <input type="number" min="0" value={room.children} onChange={e => handleRoomChange(index, 'children', e.target.value)} className="w-16 p-1 border rounded-md" /></label>
                                {rooms.length > 1 && <button type="button" onClick={() => handleRemoveRoom(index)} className="text-red-500"><i className="fas fa-trash"></i></button>}
                            </div>
                        ))}
                        <button type="button" onClick={handleAddRoom} className="text-sm text-blue-600 font-semibold mt-1">+ Add Room</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-slate-600 mb-2">Star Rating</h3>
                            <div className="flex space-x-2">
                                {STAR_RATINGS.map(star => (<button type="button" key={star} onClick={() => handleStarToggle(star)} className={`px-3 py-1 border rounded-full text-sm transition ${stars.includes(star) ? 'bg-yellow-400 border-yellow-500 text-white' : 'bg-white border-slate-300'}`}>{star} <i className="fas fa-star text-xs"></i></button>))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <h3 className="text-sm font-medium text-slate-600 mb-2">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {AMENITIES.map(amenity => (<label key={amenity.id} className="flex items-center space-x-2 cursor-pointer text-sm"><input type="checkbox" checked={amenities.includes(amenity.id)} onChange={() => handleAmenityToggle(amenity.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span>{amenity.label}</span></label>))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <label htmlFor="currency" className="text-sm font-medium text-slate-600 mr-2">Currency</label>
                  <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                  </select>
                </div>
                 <button type="submit" disabled={isLoading} className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:bg-slate-400 disabled:cursor-not-allowed h-[48px] shadow-lg hover:shadow-xl">
                    {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Searching...</span>
                    </>
                    ) : (
                    <>
                        <i className="fas fa-search"></i>
                        <span>Search Trip</span>
                    </>
                    )}
                </button>
            </div>
        </form>
    );
};
