
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    const messages = [
        "Analyzing flight patterns...",
        "Consulting with our AI travel agent...",
        "Scanning for the best deals across the globe...",
        "Just a moment, finding your perfect trip...",
        "Our AI is working its magic..."
    ];
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(messages[Math.floor(Math.random() * messages.length)]);
        }, 2500);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="text-center p-8">
            <div className="relative inline-block">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                <i className="fas fa-plane text-blue-500 text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-700 transition-opacity duration-500">{message}</p>
        </div>
    );
};
