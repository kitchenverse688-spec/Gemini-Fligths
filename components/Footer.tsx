
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12 border-t border-slate-200">
      <div className="container mx-auto py-8 px-4 md:px-8 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} Gemini Flights. All rights reserved.</p>
        <p className="text-sm mt-2">Powered by AI, designed for travelers.</p>
      </div>
    </footer>
  );
};
