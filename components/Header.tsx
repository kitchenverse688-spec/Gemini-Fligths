
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
             <i className="fas fa-plane-departure text-3xl text-blue-600"></i>
            <span className="text-2xl font-bold text-slate-800">Gemini Flights</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">My Alerts</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Profile</a>
            <button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md">
              Sign In
            </button>
          </nav>
           <button className="md:hidden text-slate-700">
             <i className="fas fa-bars text-2xl"></i>
           </button>
        </div>
      </div>
    </header>
  );
};
