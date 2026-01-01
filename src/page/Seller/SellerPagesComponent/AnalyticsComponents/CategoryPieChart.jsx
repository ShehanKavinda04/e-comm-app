import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CategoryPieChart = ({ data, totalRevenue }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white text-xs rounded p-2 shadow-lg">
          <p className="label">{`${payload[0].name}: ${parseInt(payload[0].value).toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative">
      <div className="w-full text-left mb-2">
        <h3 className="text-gray-700 font-medium text-sm">Sales by Category</h3>
      </div>

      <div style={{ width: '100%', height: 250, position: 'relative' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data && data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {/* Legend handled custom below for exact match */}
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-2xl font-bold text-gray-900">Rs.{totalRevenue ? totalRevenue.toLocaleString() : '0'}</span>
          <span className="text-gray-500 text-xs">Total</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 w-full mt-[-20px]">
        {data && data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
            <span className="text-xs text-gray-600">{item.name} ({totalRevenue > 0 ? ((item.value / totalRevenue) * 100).toFixed(0) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPieChart;
