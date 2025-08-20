'use client'
import React, { useState, useMemo } from 'react';
import { useProjects } from '@/app/hooks/useSWR';
import { ProjectCard } from '@/app/components/collaborations/ProjectCard';
import Link from 'next/link';

const TABS = [
  'All Projects',
  'Joined',
  'Featured',
  'HomeBiogas',
  'Collaborative',
];

function Tag({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${
        color || "bg-blue-100 text-blue-800"
      }`}
    >
      {children}
    </span>
  );
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState('All Projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('All Themes');
  const [selectedSDG, setSelectedSDG] = useState('All SDGs');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Use SWR hook for data fetching
  const { projects, isLoading, error, totalCount } = useProjects(1, 100);

  // Filter projects based on active tab, search, and filters
  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    let filtered = projects;

    // Filter by active tab
    switch (activeTab) {
      case 'Joined':
        filtered = filtered.filter((project: any) => project.is_open_for_collaboration);
        break;
      case 'Collaborative':
        filtered = filtered.filter((project: any) => project.is_open_for_collaboration);
        break;
      default:
        // 'All Projects' - no additional filtering
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((project: any) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.lead_school_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by theme
    if (selectedTheme !== 'All Themes') {
      filtered = filtered.filter((project: any) =>
        Object.values(project.environmental_themes).some((theme: any) =>
          theme.toLowerCase().includes(selectedTheme.toLowerCase())
        )
      );
    }

    // Filter by status
    if (selectedStatus !== 'All Status') {
      filtered = filtered.filter((project: any) => project.status === selectedStatus.toLowerCase());
    }

    return filtered;
  }, [projects, activeTab, searchTerm, selectedTheme, selectedSDG, selectedStatus]);

  // Get unique themes and statuses for filter options
  const uniqueThemes = useMemo(() => {
    if (!projects) return [];
    return Array.from(new Set(
      projects.flatMap((project: any) => Object.values(project.environmental_themes))
    )).sort() as string[];
  }, [projects]);

  const uniqueStatuses = useMemo(() => {
    if (!projects) return [];
    return Array.from(new Set(projects.map((project: any) => project.status))).sort() as string[];
  }, [projects]);

  // Handle authentication errors
  if (error && (error as { status?: number })?.status === 401) {
    // Don't redirect immediately, let the SWR fetcher handle it
    console.log('Authentication error detected in projects page');
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
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-white shadow-sm">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Environmental Projects</h1>
          <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'Failed to load projects'}</p>
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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-4 md:gap-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-2">Environmental Projects</h1>
          <p className="text-muted-foreground text-sm md:text-base">Explore and join projects aligned with UN Sustainable Development Goals</p>
        </div>
        <Link 
          href="/dashboard/collaborations/new"
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition w-full md:w-auto text-center"
        >
          Start New Project
        </Link>
      </div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none
              ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-primary"
              }`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Filters and search bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
        <input 
          className="border rounded px-3 py-2 text-sm w-64" 
          placeholder="Search projects..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="border rounded px-3 py-2 text-sm"
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
        >
          <option>All Themes</option>
          {uniqueThemes.map((theme: string) => (
            <option key={theme} value={theme}>{theme}</option>
          ))}
        </select>
        <select 
          className="border rounded px-3 py-2 text-sm"
          value={selectedSDG}
          onChange={(e) => setSelectedSDG(e.target.value)}
        >
          <option>All SDGs</option>
          <option>SDG 13</option>
          <option>SDG 14</option>
          <option>SDG 15</option>
        </select>
        <select 
          className="border rounded px-3 py-2 text-sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option>All Status</option>
          {uniqueStatuses.map((status: string) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-6">
            {projects?.length === 0 
              ? 'Get started by creating your first environmental project'
              : 'No projects match your current filters'
            }
          </p>
          {projects?.length === 0 && (
            <Link 
              href="/dashboard/collaborations/new"
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Create Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
