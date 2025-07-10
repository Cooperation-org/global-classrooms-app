'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Project } from '@/app/services/api';

interface ImpactChartsProps {
  projects: Project[];
}

// Generate chart data from projects
const generateChartData = (projects: Project[]) => {
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
    monthlyData[monthKey].waste += project.total_impact?.waste_recycled || 0;
  });

  // Convert to array format for charts
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    trees: data.trees,
    students: data.students,
    waste: data.waste
  }));
};

// Generate cumulative trend data
const generateTrendData = (projects: Project[]) => {
  const sortedProjects = projects.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  
  let cumulative = 0;
  return sortedProjects.map((project, index) => {
    cumulative += project.total_impact?.trees_planted || 0;
    const date = new Date(project.created_at);
    return {
      project: `Project ${index + 1}`,
      cumulative,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });
};

// Generate pie chart data for impact distribution
const generatePieData = (projects: Project[]) => {
  const totalTrees = projects.reduce((sum, project) => sum + (project.total_impact?.trees_planted || 0), 0);
  const totalStudents = projects.reduce((sum, project) => sum + (project.total_impact?.students_engaged || 0), 0);
  const totalWaste = projects.reduce((sum, project) => sum + (project.total_impact?.waste_recycled || 0), 0);
  
  return [
    { name: 'Trees Planted', value: totalTrees, color: '#4BA186' },
    { name: 'Students Engaged', value: totalStudents, color: '#60A5FA' },
    { name: 'Waste Recycled', value: totalWaste, color: '#A78BFA' }
  ].filter(item => item.value > 0);
};

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
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ImpactCharts({ projects }: ImpactChartsProps) {
  const chartData = generateChartData(projects);
  const trendData = generateTrendData(projects);
  const pieData = generatePieData(projects);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Impact Over Time</h2>
        {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTrees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4BA186" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4BA186" stopOpacity={0.1}/>
                </linearGradient>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1}/>
                </linearGradient>
                  <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="students" 
                stackId="1"
                stroke="#60A5FA" 
                  fill="url(#colorStudents)"
                  name="Students Engaged"
              />
              <Area 
                type="monotone" 
                  dataKey="waste" 
                stackId="1"
                stroke="#A78BFA" 
                  fill="url(#colorWaste)"
                  name="Waste Recycled (kg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No impact data available
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Cumulative Impact Trend</h2>
        {trendData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                  dataKey="project" 
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
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No project data available
          </div>
        )}
      </div>

      {pieData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Impact Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
} 