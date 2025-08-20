'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project } from '@/app/services/api';

interface PublicImpactChartsProps {
  projects: Project[];
}

// Generate chart data from projects or mock data
const generateChartData = (projects: Project[]) => {
  if (!projects || projects.length === 0) {
    // Mock data consistent with landing page totals (3500 trees, 150 students)
    return [
      { month: 'Jan', trees: 200, students: 10, waste: 50 },
      { month: 'Feb', trees: 450, students: 18, waste: 80 },
      { month: 'Mar', trees: 780, students: 35, waste: 120 },
      { month: 'Apr', trees: 1200, students: 55, waste: 180 },
      { month: 'May', trees: 2100, students: 90, waste: 250 },
      { month: 'Jun', trees: 3500, students: 150, waste: 300 }
    ];
  }

  // Group projects by month (using created_at date)
  const monthlyData: { [key: string]: { trees: number; students: number; waste: number } } = {};
  
  projects.forEach(project => {
    const date = new Date(project.created_at);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { trees: 0, students: 0, waste: 0 };
    }
    
    monthlyData[monthKey].trees += project.total_impact?.trees_planted || 0;
    monthlyData[monthKey].students += project.total_impact?.students_engaged || 0;
    monthlyData[monthKey].waste += (project.total_impact?.waste_recycled || 0) / 1000; // Convert to tons for chart
  });

  // Convert to array format for charts
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    trees: data.trees,
    students: data.students, // Keep actual student numbers
    waste: Math.round(data.waste)
  }));
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => {
          let displayValue = entry.value;
          let unit = '';
          
          if (entry.dataKey === 'trees') {
            unit = ' trees';
          } else if (entry.dataKey === 'students') {
            unit = ' students';
          } else if (entry.dataKey === 'waste') {
            unit = ' kg';
          }
          
          return (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {displayValue.toLocaleString()}{unit}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function PublicImpactCharts({ projects }: PublicImpactChartsProps) {
  const chartData = generateChartData(projects);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Impact Over Time</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTrees" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
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
              name="Trees Planted"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTrees)"
            />
            <Area 
              type="monotone" 
              dataKey="students"
              name="Students (x100)"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorStudents)"
            />
            <Area 
              type="monotone" 
              dataKey="waste"
              name="Waste Recycled"
              stroke="#8B5CF6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorWaste)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Chart Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-700">Trees Planted</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-gray-700">Students Engaged (scaled)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-gray-700">Waste Recycled (tons)</span>
        </div>
      </div>
    </div>
  );
}
