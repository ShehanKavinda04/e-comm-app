import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data, totalRevenue }) => {

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 text-white text-xs rounded p-2 shadow-lg">
                    <p className="label">{`${label}: Rs.${payload[0].value.toLocaleString()} `}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-4">
                <h3 className="text-gray-700 font-medium text-sm">Sales Over Time</h3>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">Rs.{totalRevenue ? totalRevenue.toLocaleString() : '0'}</h2>
                    <span className="text-green-500 text-xs font-medium">↑ +12.5%</span>
                </div>
                <p className="text-xs text-gray-400">Last 7 Days</p>
            </div>

            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2} fill="url(#colorValue)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} interval={0} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesChart;
