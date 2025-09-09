import React from 'react';

interface StaticPageProps {
    title: string;
    children: React.ReactNode;
}

const StaticPage: React.FC<StaticPageProps> = ({ title, children }) => (
    <div className="container mx-auto px-6 py-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
            <div className="prose max-w-none text-gray-700">
                {children}
            </div>
        </div>
    </div>
);

export default StaticPage;
