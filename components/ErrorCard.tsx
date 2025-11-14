import React from 'react';

interface ErrorCardProps {
    title: string;
    message: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ title, message }) => (
    <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg h-full flex flex-col justify-center">
        <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
        <h3 className="text-xl font-semibold text-red-800">{title}</h3>
        <p className="text-red-600 mt-2 whitespace-pre-wrap">{message}</p>
    </div>
);
