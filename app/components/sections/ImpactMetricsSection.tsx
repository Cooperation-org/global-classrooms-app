'use client'
import React, { useMemo } from 'react';
import { usePublicProjects, usePublicSchools } from '@/app/hooks/useSWR';
import { Project } from '@/app/services/api';
import PublicImpactCharts from './PublicImpactCharts';
import RecentImpactSection from './RecentImpactSection';

// Mock data for fallback
const mockImpactData = {
  totalTreesPlanted: 2500,
  totalStudentsEngaged: 15000,
  totalWasteRecycled: 50000, // in kg
  totalProjects: 125,
  completedProjects: 67,
  activeProjects: 58,
  totalSchools: 200,
  participatingSchools: 150
};

const ImpactMetricsSection: React.FC = () => {
  // Use public SWR hooks for data fetching (no authentication required)
  const { projects: apiProjects, isLoading: projectsLoading, error: projectsError } = usePublicProjects(1, 1000);
  const { schools: apiSchools, isLoading: schoolsLoading, error: schoolsError } = usePublicSchools(1, 1000);
  
  // Check if any data is loading
  const isLoading = projectsLoading || schoolsLoading;
  
  // Check if there are any errors
  const error = projectsError || schoolsError;

  // Use API projects for charts and recent impact
  const projects = apiProjects || [];

  // Calculate impact metrics from API data or use fallback
  const impactMetrics = useMemo(() => {
    // If we have API data, use it; otherwise use mock data
    if (apiProjects && apiProjects.length > 0) {
      const totalTreesPlanted = apiProjects.reduce((sum: number, project: Project) => 
        sum + (project.total_impact?.trees_planted || 0), 0);
      
      const totalStudentsEngaged = apiProjects.reduce((sum: number, project: Project) => 
        sum + (project.total_impact?.students_engaged || 0), 0);
      
      const totalWasteRecycled = apiProjects.reduce((sum: number, project: Project) => 
        sum + (project.total_impact?.waste_recycled || 0), 0);
      
      const totalProjects = apiProjects.length;
      const completedProjects = apiProjects.filter((p: Project) => p.status === 'completed').length;
      const activeProjects = apiProjects.filter((p: Project) => p.status === 'active' || p.status === 'published').length;
      
      const totalSchools = apiSchools?.length || 0;
      const participatingSchools = new Set(apiProjects.map((p: Project) => p.lead_school)).size;

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
    }
    
    // Fallback to mock data
    return mockImpactData;
  }, [apiProjects, apiSchools]);

  // Show demo data notice if API failed but we have fallback data
  const showDemoNotice = error && (!apiProjects || apiProjects.length === 0);

  if (isLoading) {
    return (
      <section id="metrics" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="metrics" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Demo Data Notice */}
        {/* {showDemoNotice && (
          <div className="mb-12 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-blue-400 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-blue-800 font-semibold">Demo Impact Data</h4>
                <p className="text-blue-700 text-sm">We&apos;re showing sample impact metrics. Sign in to view live data from our network.</p>
              </div>
            </div>
          </div>
        )} */}

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Global Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Together, we&apos;re creating meaningful environmental change across schools worldwide. 
            Here&apos;s the measurable impact we&apos;ve achieved so far.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Trees Planted */}
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.5 2.5L16 4.5 13.5 7l2.5 2.5L14 11.5 11.5 9 14 6.5 11.5 4 14 1.5zm7 14l2.5 2.5L19 20.5 16.5 23l2.5 2.5L17 27.5 14.5 25 17 22.5 14.5 20 17 17.5z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {impactMetrics.totalTreesPlanted.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Trees Planted</div>
          </div>

          {/* Students Engaged */}
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {impactMetrics.totalStudentsEngaged.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Students Engaged</div>
          </div>

          {/* Waste Recycled */}
          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {(impactMetrics.totalWasteRecycled / 1000).toFixed(1)}T
            </div>
            <div className="text-gray-600 font-medium">Waste Recycled</div>
          </div>

          {/* Schools Participating */}
          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {impactMetrics.participatingSchools}
            </div>
            <div className="text-gray-600 font-medium">Schools Participating</div>
          </div>
        </div>

        {/* Impact Over Time Chart */}
        <PublicImpactCharts projects={projects} />

        {/* Project Overview and Community Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Project Overview */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Projects</span>
                <span className="text-2xl font-bold text-gray-900">{impactMetrics.totalProjects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Projects</span>
                <span className="text-2xl font-bold text-green-600">{impactMetrics.activeProjects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed Projects</span>
                <span className="text-2xl font-bold text-blue-600">{impactMetrics.completedProjects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Success Rate</span>
                <span className="text-2xl font-bold text-purple-600">
                  {impactMetrics.totalProjects > 0 ? Math.round((impactMetrics.completedProjects / impactMetrics.totalProjects) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Community Growth */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Community Growth</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Schools</span>
                <span className="text-2xl font-bold text-gray-900">{impactMetrics.totalSchools}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Participating Schools</span>
                <span className="text-2xl font-bold text-green-600">{impactMetrics.participatingSchools}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Participation Rate</span>
                <span className="text-2xl font-bold text-blue-600">
                  {impactMetrics.totalSchools > 0 ? Math.round((impactMetrics.participatingSchools / impactMetrics.totalSchools) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Students per Project</span>
                <span className="text-2xl font-bold text-purple-600">
                  {impactMetrics.totalProjects > 0 ? Math.round(impactMetrics.totalStudentsEngaged / impactMetrics.totalProjects) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Impact */}
        <div className="mb-16">
          <RecentImpactSection projects={projects} />
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join our global network of schools and students making a real difference for our planet&apos;s future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/projects"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Projects
            </a>
            <a 
              href="/signin"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Join as a School
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactMetricsSection;
