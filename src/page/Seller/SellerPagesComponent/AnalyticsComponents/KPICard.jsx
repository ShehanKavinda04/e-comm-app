import React from 'react';

const KPICard = ({ title, value, subtext, trend, trendValue, isPositive }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
            </div>
            <div className="mt-4 flex items-center text-xs">
                <span className={`font-medium flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '↑' : '↓'} {trendValue}
                </span>
            </div>
        </div>
    );
};

export default KPICard;
