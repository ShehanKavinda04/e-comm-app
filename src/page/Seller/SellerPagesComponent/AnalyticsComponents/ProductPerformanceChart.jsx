import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ProductPerformanceChart = ({ data, days }) => {
    const totalUnits = data ? data.reduce((acc, item) => acc + item.value, 0) : 0;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 text-white text-xs rounded p-2 shadow-lg">
                    <p className="label">{`${payload[0].value} Units`}</p>
                </div>
            );
        }
        return null;
    };

    const hasData = data && data.length > 0;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-6">
                <h3 className="text-gray-700 font-medium text-sm">Top Performance Product</h3>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">{totalUnits.toLocaleString()} Units</h2>
                    {hasData && <span className="text-green-500 text-xs font-medium">↑ Trending</span>}
                </div>
                <span className="text-gray-400 text-xs font-medium">Last {days} Days</span>
            </div>

            <div style={{ width: '100%', height: 200 }} className="relative">
                {!hasData && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-xs text-gray-400">No product performance data available</p>
                    </div>
                )}
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} interval={0} />
                        <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} barSize={90} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProductPerformanceChart;
