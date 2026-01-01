import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ProductPerformanceChart = ({ data }) => {
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

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-6">
                <h3 className="text-gray-700 font-medium text-sm">Top Performance Product</h3>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">{totalUnits.toLocaleString()} Units</h2>
                </div>
                <span className="text-green-500 text-xs font-medium">Last 7 Days ↑ +12.5%</span>
            </div>

            <div style={{ width: '100%', height: 200 }}>
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
