'use client'
import React from 'react';
import { Project } from '@/app/services/api';

interface RecentImpactSectionProps {
  projects: Project[];
}

// Mock recent projects for fallback
const mockRecentProjects = [
  {
    id: 'recent-1',
    title: 'Solar Scholars: Student-Led Clean Energy Transformation',
    lead_school_name: 'Maryland High School',
    total_impact: { trees_planted: 0, students_engaged: 85, waste_recycled: 0 }
  },
  {
    id: 'recent-2',
    title: 'Zero Waste Heroes: School-to-Community Waste Revolution',
    lead_school_name: 'The International School',
    total_impact: { trees_planted: 0, students_engaged: 92, waste_recycled: 1500 }
  },
  {
    id: 'recent-3',
    title: 'Fresh Futures: Farm-to-School Nutrition Revolution',
    lead_school_name: 'Delta International School',
    total_impact: { trees_planted: 0, students_engaged: 78, waste_recycled: 0 }
  },
  {
    id: 'recent-4',
    title: 'Global School Garden Network for Food Security',
    lead_school_name: 'Maryland High School',
    total_impact: { trees_planted: 125, students_engaged: 64, waste_recycled: 0 }
  },
  {
    id: 'recent-5',
    title: 'Planting Trees',
    lead_school_name: 'Maryland High School',
    total_impact: { trees_planted: 45, students_engaged: 32, waste_recycled: 0 }
  }
];

export default function RecentImpactSection({ projects }: RecentImpactSectionProps) {
  // Use API projects if available, otherwise use mock data
  const recentProjects = projects && projects.length > 0 
    ? projects.slice(0, 5) // Show most recent 5 projects
    : mockRecentProjects;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Impact</h2>
      <div className="space-y-4">
        {recentProjects.map((project, index) => (
          <div key={project.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
              <p className="text-sm text-gray-600">
                {project.lead_school_name || 'Partner School'}
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              {project.total_impact?.trees_planted && project.total_impact.trees_planted > 0 && (
                <div className="flex items-center text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4" />
                  </svg>
                  <span className="font-medium">{project.total_impact.trees_planted}</span>
                  <span className="ml-1 text-gray-500">trees</span>
                </div>
              )}
              {project.total_impact?.students_engaged && project.total_impact.students_engaged > 0 && (
                <div className="flex items-center text-blue-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z" />
                  </svg>
                  <span className="font-medium">{project.total_impact.students_engaged}</span>
                  <span className="ml-1 text-gray-500">students</span>
                </div>
              )}
              {project.total_impact?.waste_recycled && project.total_impact.waste_recycled > 0 && (
                <div className="flex items-center text-purple-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="font-medium">{(project.total_impact.waste_recycled / 1000).toFixed(1)}</span>
                  <span className="ml-1 text-gray-500">tons</span>
                </div>
              )}
              {(!project.total_impact?.trees_planted || project.total_impact.trees_planted === 0) &&
               (!project.total_impact?.waste_recycled || project.total_impact.waste_recycled === 0) &&
               project.total_impact?.students_engaged && (
                <div className="flex items-center text-blue-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z" />
                  </svg>
                  <span className="font-medium">{project.total_impact.students_engaged}</span>
                  <span className="ml-1 text-gray-500">students</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
