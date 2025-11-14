import React from 'react';
import type { HotelAiSuggestions } from '../types';

interface HotelAiSuggestionsCardProps {
  suggestions: HotelAiSuggestions;
}

export const HotelAiSuggestionsCard: React.FC<HotelAiSuggestionsCardProps> = ({ suggestions }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center mr-4">
            <i className="fa-solid fa-lightbulb"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-800">AI Smart Suggestions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700">
        
        <div className="flex items-start">
            <i className="fa-solid fa-hotel text-blue-500 mt-1 mr-3"></i>
            <div>
                <h4 className="font-semibold mb-1">Alternative Hotels</h4>
                <p className="text-sm">For better value, you could also consider: <span className="font-medium">{suggestions.alternativeHotels.join(' or ')}</span>.</p>
            </div>
        </div>

        <div className="flex items-start">
             <i className="fa-solid fa-tags text-blue-500 mt-1 mr-3"></i>
            <div>
                <h4 className="font-semibold mb-1">Price Alert</h4>
                <p className="text-sm">{suggestions.priceAlert}</p>
            </div>
        </div>

      </div>
    </div>
  );
};
