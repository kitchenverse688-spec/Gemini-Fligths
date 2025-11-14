
import React from 'react';
import type { AiSuggestions } from '../types';

interface AiSuggestionsCardProps {
  suggestions: AiSuggestions;
}

export const AiSuggestionsCard: React.FC<AiSuggestionsCardProps> = ({ suggestions }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center mr-4">
            <i className="fa-solid fa-lightbulb"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-800">AI Smart Suggestions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700">
        
        <div className="flex items-start">
            <i className="fa-solid fa-calendar-alt text-blue-500 mt-1 mr-3"></i>
            <div>
                <h4 className="font-semibold mb-1">Alternative Dates</h4>
                <p className="text-sm">Flying on <span className="font-medium">{suggestions.alternativeDates.join(' or ')}</span> might be cheaper.</p>
            </div>
        </div>
        
        <div className="flex items-start">
             <i className="fa-solid fa-map-marked-alt text-blue-500 mt-1 mr-3"></i>
            <div>
                <h4 className="font-semibold mb-1">Nearby Airports</h4>
                <p className="text-sm">Consider flying from/to <span className="font-medium">{suggestions.nearbyAirports.join(' or ')}</span> for more options.</p>
            </div>
        </div>

        <div className="flex items-start">
             <i className="fa-solid fa-chart-line text-blue-500 mt-1 mr-3"></i>
            <div>
                <h4 className="font-semibold mb-1">Price Trend</h4>
                <p className="text-sm">{suggestions.priceTrend}</p>
            </div>
        </div>

      </div>
    </div>
  );
};
