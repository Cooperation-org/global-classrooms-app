'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SchoolImpactMetric } from '@/app/data/mockSchools';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

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

export function SchoolImpact({ impact }: { impact: SchoolImpactMetric[] }) {
  if (!impact || impact.length === 0) return null;

  // Transform data for Recharts
  const chartData = months.map((month, index) => {
    const dataPoint: Record<string, string | number> = { month };
    impact.forEach((metric, metricIndex) => {
      dataPoint[`metric${metricIndex}`] = metric.chart[index];
    });
    return dataPoint;
  });

  const colors = ['#4BA186', '#60A5FA', '#A78BFA', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Impact</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {impact.map((metric, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="mb-2 text-base font-semibold text-gray-900">{metric.title}</div>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
              {metric.unit && <span className="text-lg text-gray-500 font-medium">{metric.unit}</span>}
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Last Year <span className="text-green-600 font-semibold">{metric.lastYearChange}</span>
            </div>
            {/* Proper bar chart using Recharts */}
            <div className="h-20 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    hide
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey={`metric${i}`} 
                    fill={colors[i % colors.length]}
                    radius={[2, 2, 0, 0]}
                    name={metric.title}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              {months.map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 