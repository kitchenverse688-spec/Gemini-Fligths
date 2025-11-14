export interface Traveler {
  age: number;
}

export interface FlightSearchInput {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  travelers: Traveler[];
  cabinClass: string;
  directOnly: boolean;
  currency: string;
}

export interface FlightResult {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  stops: number;
  duration: string;
  price: number;
  currency: string;
  bookingUrl: string;
  airlineLogoUrl?: string;
}

export interface AiSuggestions {
  alternativeDates: string[];
  nearbyAirports: string[];
  priceTrend: string;
}

export interface FlightData {
  results: FlightResult[];
  aiSuggestions: AiSuggestions;
}

// Hotel Search Types
export interface Room {
  adults: number;
  children: number;
}

export interface HotelSearchInput {
  city: string;
  checkInDate: string;
  checkOutDate: string;
  rooms: Room[];
  stars: number[];
  amenities: string[];
  currency: string;
}

export interface HotelResult {
  name: string;
  address: string;
  stars: number;
  amenities: string[];
  roomType: string;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  bookingUrl: string;
  imageUrl: string;
}

export interface HotelAiSuggestions {
  alternativeHotels: string[];
  priceAlert: string;
}

export interface HotelData {
  results: HotelResult[];
  aiSuggestions: HotelAiSuggestions;
}
