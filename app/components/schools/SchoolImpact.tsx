'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project } from '@/app/services/api';

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

export function SchoolImpact({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Impact</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No impact data</h3>
          <p className="text-gray-500">Impact metrics will appear once projects are completed.</p>
        </div>
      </div>
    );
  }

  // Calculate total impact from all projects
  const totalImpact = projects.reduce((acc, project) => {
    if (project.total_impact) {
      acc.trees_planted += project.total_impact.trees_planted || 0;
      acc.students_engaged += project.total_impact.students_engaged || 0;
      acc.waste_recycled += project.total_impact.waste_recycled || 0;
    }
    return acc;
  }, { trees_planted: 0, students_engaged: 0, waste_recycled: 0 });

  // Create impact metrics for display
  const impactMetrics = [
    {
      title: 'Trees Planted',
      value: totalImpact.trees_planted,
      unit: 'trees',
      lastYearChange: '+12%',
      color: '#4BA186'
    },
    {
      title: 'Students Engaged',
      value: totalImpact.students_engaged,
      unit: 'students',
      lastYearChange: '+8%',
      color: '#60A5FA'
    },
    {
      title: 'Waste Recycled',
      value: totalImpact.waste_recycled,
      unit: 'kg',
      lastYearChange: '+15%',
      color: '#A78BFA'
    }
  ];

  // Generate mock chart data for visualization
  const chartData = months.map((month, index) => {
    const dataPoint: Record<string, string | number> = { month };
    impactMetrics.forEach((metric, metricIndex) => {
      // Generate some mock data for the chart
      const baseValue = metric.value / 6; // Distribute across 6 months
      const variation = (Math.random() - 0.5) * 0.3; // Add some variation
      dataPoint[`metric${metricIndex}`] = Math.max(0, Math.round(baseValue * (1 + variation)));
    });
    return dataPoint;
  });

  const colors = ['#4BA186', '#60A5FA', '#A78BFA'];

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Impact</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {impactMetrics.map((metric, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="mb-2 text-base font-semibold text-gray-900">{metric.title}</div>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-bold text-gray-900">{metric.value.toLocaleString()}</span>
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