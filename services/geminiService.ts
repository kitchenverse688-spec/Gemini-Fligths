import { GoogleGenAI, Type } from "@google/genai";
import type { FlightSearchInput, FlightData, HotelSearchInput, HotelData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const flightResponseSchema = {
    type: Type.OBJECT,
    properties: {
        results: {
            type: Type.ARRAY,
            description: "A list of flight search results.",
            items: {
                type: Type.OBJECT,
                properties: {
                    airline: { type: Type.STRING, description: "Airline name, e.g., 'Emirates', 'Lufthansa'." },
                    flightNumber: { type: Type.STRING, description: "Flight number, e.g., 'EK856'." },
                    departure: { type: Type.STRING, description: "Departure date and time in ISO 8601 format." },
                    arrival: { type: Type.STRING, description: "Arrival date and time in ISO 8601 format." },
                    stops: { type: Type.INTEGER, description: "Number of stops. 0 for direct." },
                    duration: { type: Type.STRING, description: "Total flight duration, e.g., '2h 15m'." },
                    price: { type: Type.NUMBER, description: "Total price for all travelers." },
                    currency: { type: Type.STRING, description: "Currency code, e.g., 'USD', 'EUR'." },
                    bookingUrl: { type: Type.STRING, description: "A plausible but fake booking URL." },
                    airlineLogoUrl: { type: Type.STRING, description: "A URL to a plausible airline logo image. Use `https://logo.clearbit.com/{airlinename}.com`" }
                },
                 required: ["airline", "flightNumber", "departure", "arrival", "stops", "duration", "price", "currency", "bookingUrl", "airlineLogoUrl"]
            },
        },
        aiSuggestions: {
            type: Type.OBJECT,
            description: "AI-powered suggestions to help the user find better deals.",
            properties: {
                alternativeDates: {
                    type: Type.ARRAY,
                    description: "A list of nearby dates that might have cheaper fares.",
                    items: { type: Type.STRING }
                },
                nearbyAirports: {
                    type: Type.ARRAY,
                    description: "A list of nearby airport codes that might be cheaper.",
                    items: { type: Type.STRING }
                },
                priceTrend: {
                    type: Type.STRING,
                    description: "A short, insightful tip about price trends for this route."
                }
            },
            required: ["alternativeDates", "nearbyAirports", "priceTrend"]
        }
    },
    required: ["results", "aiSuggestions"]
};


export const fetchFlightData = async (input: FlightSearchInput): Promise<FlightData> => {
    const travelerDetails = input.travelers.map(t => `${t.age} years old`).join(', ');
    const returnDateInfo = input.returnDate ? `returning on ${input.returnDate}` : 'one-way trip';
    const directFlightInfo = input.directOnly ? 'Only show direct flights.' : 'Include flights with stops.';

    const prompt = `
        You are a flight search API. Generate a realistic but fictional list of flight options based on the following criteria.
        Ensure the data is varied and plausible for a real-world scenario.
        Return the data in the exact JSON format specified by the schema.

        Search Criteria:
        - From: ${input.from}
        - To: ${input.to}
        - Departure Date: ${input.departureDate}
        - Return Date: ${returnDateInfo}
        - Travelers: ${input.travelers.length} (${travelerDetails})
        - Cabin Class: ${input.cabinClass}
        - Currency: ${input.currency}
        - ${directFlightInfo}
        
        Mandatory Instructions:
        1.  Generate between 5 and 10 flight results.
        2.  Prices should be realistic for the specified route, cabin class, number of travelers, and currency (${input.currency}).
        3.  Flight numbers and times should be plausible.
        4.  Provide helpful and relevant AI suggestions, including 2 alternative dates, 2 nearby airports (if applicable), and a concise price trend analysis.
        5.  The 'bookingUrl' should be a fake but valid-looking URL to the airline's website.
        6.  The 'airlineLogoUrl' should use the format 'https://logo.clearbit.com/{lowercase_airline_name}.com', for example 'https://logo.clearbit.com/emirates.com'.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: flightResponseSchema,
                temperature: 0.7
            },
        });
        
        const jsonText = response.text.trim();
        const data: FlightData = JSON.parse(jsonText);
        return data;
    } catch (error) {
        console.error("Error fetching flight data from Gemini:", error);
        throw new Error("Failed to generate flight data. The AI model may be temporarily unavailable.");
    }
};

const hotelResponseSchema = {
    type: Type.OBJECT,
    properties: {
        results: {
            type: Type.ARRAY,
            description: "A list of hotel search results.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Hotel name, e.g., 'Grand Hyatt', 'Marriott'." },
                    address: { type: Type.STRING, description: "Full hotel address." },
                    stars: { type: Type.INTEGER, description: "Star rating from 1 to 5." },
                    amenities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key amenities available." },
                    roomType: { type: Type.STRING, description: "Type of room, e.g., 'Deluxe King', 'Standard Double'." },
                    pricePerNight: { type: Type.NUMBER, description: "Price per night in the specified currency." },
                    totalPrice: { type: Type.NUMBER, description: "Total price for the entire stay for all rooms." },
                    currency: { type: Type.STRING, description: "Currency code, e.g., 'USD', 'EUR'." },
                    bookingUrl: { type: Type.STRING, description: "A plausible but fake booking URL." },
                    imageUrl: { type: Type.STRING, description: "A URL to a plausible hotel image. Use a placeholder service like `https://place.hotellook.com/640/480/{city}.jpg`." }
                },
                required: ["name", "address", "stars", "amenities", "roomType", "pricePerNight", "totalPrice", "currency", "bookingUrl", "imageUrl"]
            },
        },
        aiSuggestions: {
            type: Type.OBJECT,
            description: "AI-powered suggestions for the hotel search.",
            properties: {
                alternativeHotels: {
                    type: Type.ARRAY,
                    description: "A list of alternative hotel names that might offer better value.",
                    items: { type: Type.STRING }
                },
                priceAlert: {
                    type: Type.STRING,
                    description: "A short tip about price trends or booking advice for this city."
                }
            },
            required: ["alternativeHotels", "priceAlert"]
        }
    },
    required: ["results", "aiSuggestions"]
};


export const fetchHotelData = async (input: HotelSearchInput): Promise<HotelData> => {
    const roomDetails = input.rooms.map((r, i) => `Room ${i+1}: ${r.adults} adults, ${r.children} children`).join('; ');
    const starFilter = input.stars.length > 0 ? `Only show hotels with star ratings in [${input.stars.join(', ')}].` : 'No star rating filter.';
    const amenityFilter = input.amenities.length > 0 ? `Must include amenities: ${input.amenities.join(', ')}.` : 'No specific amenities required.';
    
    const prompt = `
        You are a hotel booking API. Generate a realistic but fictional list of hotel options based on the following criteria.
        Ensure the data is varied and plausible for a real-world scenario.
        Return the data in the exact JSON format specified by the schema.

        Search Criteria:
        - City: ${input.city}
        - Check-in Date: ${input.checkInDate}
        - Check-out Date: ${input.checkOutDate}
        - Rooms & Guests: ${input.rooms.length} room(s) (${roomDetails})
        - Filters: 
          - ${starFilter}
          - ${amenityFilter}
        - Currency: ${input.currency}
        
        Mandatory Instructions:
        1.  Generate between 5 and 10 hotel results that match the criteria.
        2.  Prices must be realistic for the specified city, dates, star rating, and currency (${input.currency}).
        3.  Calculate 'totalPrice' correctly based on 'pricePerNight', number of nights, and number of rooms.
        4.  Provide helpful AI suggestions, including 2 alternative hotels and a concise price alert.
        5.  The 'bookingUrl' should be a fake but valid-looking URL to a booking website.
        6.  The 'imageUrl' should use the format 'https://place.hotellook.com/640/480/${input.city.toLowerCase().replace(/[\s,.]/g, '')}.jpg' to get a relevant image.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: hotelResponseSchema,
                temperature: 0.8
            },
        });
        
        const jsonText = response.text.trim();
        const data: HotelData = JSON.parse(jsonText);
        // Post-process image URLs to add randomness, as the model can't execute Math.random()
        data.results.forEach(result => {
            result.imageUrl = `https://place.hotellook.com/640/480/${input.city.toLowerCase().replace(/[\s,.]/g, '')}.jpg?seed=${Math.floor(Math.random() * 1000)}`;
        });
        return data;
    } catch (error) {
        console.error("Error fetching hotel data from Gemini:", error);
        throw new Error("Failed to generate hotel data. The AI model may be temporarily unavailable.");
    }
};
