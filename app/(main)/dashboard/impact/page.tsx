'use client'
import React, { useMemo } from 'react';
import { useProjects, useSchools } from '@/app/hooks/useSWR';

// Define project interface
interface Project {
  id: string;
  title: string;
  status: string;
  lead_school: string;
  lead_school_name?: string;
  total_impact?: {
    trees_planted?: number;
    students_engaged?: number;
    waste_recycled?: number;
  };
}

export default function ImpactPage() {
  // Use SWR hooks for data fetching
  const { projects, isLoading: projectsLoading, error: projectsError } = useProjects(1, 1000);
  const { schools, isLoading: schoolsLoading, error: schoolsError } = useSchools(1, 1000);

  // Check if any data is loading
  const isLoading = projectsLoading || schoolsLoading;
  
  // Check if there are any errors
  const error = projectsError || schoolsError;

  // Calculate impact metrics
  const impactMetrics = useMemo(() => {
    if (!projects) return {
      totalTreesPlanted: 0,
      totalStudentsEngaged: 0,
      totalWasteRecycled: 0,
      totalProjects: 0,
      completedProjects: 0,
      activeProjects: 0,
      totalSchools: 0,
      participatingSchools: 0
    };

    const totalTreesPlanted = projects.reduce((sum: number, project: Project) => 
      sum + (project.total_impact?.trees_planted || 0), 0);
    
    const totalStudentsEngaged = projects.reduce((sum: number, project: Project) => 
      sum + (project.total_impact?.students_engaged || 0), 0);
    
    const totalWasteRecycled = projects.reduce((sum: number, project: Project) => 
      sum + (project.total_impact?.waste_recycled || 0), 0);
    
    const totalProjects = projects.length;
    const completedProjects = projects.filter((p: Project) => p.status === 'completed').length;
    const activeProjects = projects.filter((p: Project) => p.status === 'active' || p.status === 'published').length;
    
    const totalSchools = schools?.length || 0;
    const participatingSchools = new Set(projects.map((p: Project) => p.lead_school)).size;

    return {
      totalTreesPlanted,
      totalStudentsEngaged,
      totalWasteRecycled,
      totalProjects,
      completedProjects,
      activeProjects,
      totalSchools,
      participatingSchools
    };
  }, [projects, schools]);

  // Handle authentication errors
  if (error && (error as { status?: number })?.status === 401) {
    // Don't redirect immediately, let the SWR fetcher handle it
    console.log('Authentication error detected in impact page');
    return (
      <div className="w-full max-w-5xl py-8 px-4">
            <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-red-600 mb-4">Please log in to access this page.</p>
          <button 
            onClick={() => window.location.href = '/signin'}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading impact data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Global Impact</h1>
          <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'Failed to load impact data'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Try Again
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              <div>
            <h1 className="text-3xl font-bold text-gray-900">Global Impact</h1>
            <p className="mt-2 text-gray-600">
              Track the environmental impact of our global classroom community
            </p>
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 5a2 2 0 012-2h8a2 2 0 012 2v2H7V5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trees Planted</p>
                <p className="text-2xl font-bold text-gray-900">{impactMetrics.totalTreesPlanted.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students Engaged</p>
                <p className="text-2xl font-bold text-gray-900">{impactMetrics.totalStudentsEngaged.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Waste Recycled</p>
                <p className="text-2xl font-bold text-gray-900">{impactMetrics.totalWasteRecycled.toLocaleString()} kg</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Schools Participating</p>
                <p className="text-2xl font-bold text-gray-900">{impactMetrics.participatingSchools}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Project Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Projects</span>
                <span className="text-lg font-semibold text-gray-900">{impactMetrics.totalProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Projects</span>
                <span className="text-lg font-semibold text-green-600">{impactMetrics.activeProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed Projects</span>
                <span className="text-lg font-semibold text-blue-600">{impactMetrics.completedProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-lg font-semibold text-gray-900">
                  {impactMetrics.totalProjects > 0 
                    ? Math.round((impactMetrics.completedProjects / impactMetrics.totalProjects) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Community Growth</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Schools</span>
                <span className="text-lg font-semibold text-gray-900">{impactMetrics.totalSchools}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Participating Schools</span>
                <span className="text-lg font-semibold text-green-600">{impactMetrics.participatingSchools}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Participation Rate</span>
                <span className="text-lg font-semibold text-gray-900">
                  {impactMetrics.totalSchools > 0 
                    ? Math.round((impactMetrics.participatingSchools / impactMetrics.totalSchools) * 100)
                    : 0}%
                </span>
                </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Students per Project</span>
                <span className="text-lg font-semibold text-gray-900">
                  {impactMetrics.totalProjects > 0 
                    ? Math.round(impactMetrics.totalStudentsEngaged / impactMetrics.totalProjects)
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Impact */}
        {projects && projects.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Impact</h2>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project: Project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.lead_school_name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-600">
                        🌳 {project.total_impact?.trees_planted || 0} trees
                      </span>
                      <span className="text-blue-600">
                        👥 {project.total_impact?.students_engaged || 0} students
                      </span>
                      <span className="text-purple-600">
                        ♻️ {project.total_impact?.waste_recycled || 0} kg
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 