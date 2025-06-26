'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Sample chart data - in a real app, this would come from an API
const chartData = [
  { month: 'Jan', trees: 15, water: 180, co2: 65 },
  { month: 'Feb', trees: 22, water: 220, co2: 78 },
  { month: 'Mar', trees: 28, water: 280, co2: 92 },
  { month: 'Apr', trees: 35, water: 320, co2: 105 },
  { month: 'May', trees: 27, water: 245, co2: 89 },
];

// Trend data for line chart
const trendData = [
  { month: 'Jan', cumulative: 15 },
  { month: 'Feb', cumulative: 37 },
  { month: 'Mar', cumulative: 65 },
  { month: 'Apr', cumulative: 100 },
  { month: 'May', cumulative: 127 },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ImpactCharts() {
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Impact Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTrees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4BA186" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4BA186" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="trees" 
                stackId="1"
                stroke="#4BA186" 
                fill="url(#colorTrees)"
                name="Trees Planted"
              />
              <Area 
                type="monotone" 
                dataKey="water" 
                stackId="1"
                stroke="#60A5FA" 
                fill="url(#colorWater)"
                name="Water Saved (L)"
              />
              <Area 
                type="monotone" 
                dataKey="co2" 
                stackId="1"
                stroke="#A78BFA" 
                fill="url(#colorCO2)"
                name="CO2 Reduced (kg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Cumulative Impact Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#4BA186" 
                strokeWidth={3}
                dot={{ fill: '#4BA186', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#4BA186', strokeWidth: 2, fill: '#fff' }}
                name="Total Trees Planted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
} 