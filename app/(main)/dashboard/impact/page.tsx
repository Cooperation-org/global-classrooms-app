'use client';

import React, { useState, useEffect } from 'react';
import { fetchSchools, fetchProjectsBySchool, Project } from '@/app/services/api';
import ImpactCharts from './ImpactCharts';

export default function ImpactPage() {
  const [school, setSchool] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Get first school
        const schoolResponse = await fetchSchools(1, 1);
        if (schoolResponse.results.length > 0) {
          const schoolData = schoolResponse.results[0];
          setSchool(schoolData);
          
          // Get projects for this school
          const projectsResponse = await fetchProjectsBySchool(schoolData.id, 1, 100);
          setProjects(projectsResponse.results);
        } else {
          setError('No school found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load impact data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate cumulative impact
  const calculateCumulativeImpact = () => {
    return projects.reduce((total, project) => {
      return {
        trees_planted: total.trees_planted + (project.total_impact?.trees_planted || 0),
        students_engaged: total.students_engaged + (project.total_impact?.students_engaged || 0),
        waste_recycled: total.waste_recycled + (project.total_impact?.waste_recycled || 0),
      };
    }, { trees_planted: 0, students_engaged: 0, waste_recycled: 0 });
  };

  const stats = [
    {
      label: 'Trees Planted',
      value: calculateCumulativeImpact().trees_planted,
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#E6F4EA"/><path d="M14 21v-4m0 0c-2.5 0-4.5-2-4.5-4.5S11.5 8 14 8s4.5 2 4.5 4.5S16.5 17 14 17Z" stroke="#4BA186" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
      color: 'bg-[#E6F4EA] text-[#4BA186]'
    },
    {
      label: 'Students Engaged',
      value: calculateCumulativeImpact().students_engaged,
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#E6F4EA"/><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" stroke="#4BA186" strokeWidth="2"/></svg>
      ),
      color: 'bg-[#E6F4EA] text-[#4BA186]'
    },
    {
      label: 'Waste Recycled (kg)',
      value: calculateCumulativeImpact().waste_recycled,
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#F3F0FB"/><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="#A78BFA" strokeWidth="2"/></svg>
      ),
      color: 'bg-[#F3F0FB] text-[#A78BFA]'
    },
  ];

  const certificates = [
    { name: 'Water Guardian' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6FCF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading impact data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6FCF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Impact Data</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FCF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Environmental Impact</h1>
        <p className="text-gray-500 mb-8">Track and measure your contribution to sustainability</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-xl flex items-center gap-4 p-6 shadow-sm border border-gray-200 bg-white">
              <div>{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
                <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        
        <ImpactCharts projects={projects} />
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Impact Certificates</h2>
          <div className="divide-y divide-gray-100">
            {certificates.map((cert, i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#E6F4EA] flex items-center justify-center font-bold text-[#4BA186]">{i + 1}</span>
                  <span className="font-medium text-gray-900">{cert.name}</span>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 