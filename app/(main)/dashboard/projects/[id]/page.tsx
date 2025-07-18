'use client'
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProjectById } from '@/app/hooks/useSWR';
import { ProjectHeader } from '@/app/components/projects/ProjectHeader';
import { ProjectTabs } from '@/app/components/projects/ProjectTabs';
import { ManageMembers } from '@/app/components/projects/ManageMembers';
import { ParticipatingSchools, ProjectLeaders } from '@/app/components/projects/ProjectSidebar';
import { ProjectProgressUpdates } from '@/app/components/projects/ProjectProgressUpdates';

// Import the subcomponents from ProjectOverview
import { GoalsSection, ResourcesSection, DiscussionSection, ScheduleSection } from '@/app/components/projects/ProjectOverview';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Use SWR hook for data fetching
  const { project, isLoading, error } = useProjectById(params.id as string);

  // Handle authentication errors
  if (error && (error as { status?: number })?.status === 401) {
    // Don't redirect immediately, let the SWR fetcher handle it
    console.log('Authentication error detected in project details page');
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
          <p className="text-gray-600 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Details</h1>
          <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'Failed to load project details'}</p>
          <button 
            onClick={() => router.back()}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600 mb-4">The project you&apos;re looking for doesn&apos;t exist.</p>
          <button 
            onClick={() => router.back()}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div>
              <div className="px-3 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Project Overview</h2>
              </div>
              <div className="p-2">
                <p className="text-gray-700 text-sm leading-relaxed">{project.detailed_description}</p>
              </div>
            </div>
            <ScheduleSection schedule={[
              {
                week: 'Week 1',
                title: 'Project Kickoff',
                description: `Start date: ${project.start_date}`
              },
              {
                week: 'Final Week',
                title: 'Project Completion',
                description: `End date: ${project.end_date}`
              }
            ]} />
            <GoalsSection goals={[]} />
            <ResourcesSection resources={[]} />
            <DiscussionSection discussion={[]} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ParticipatingSchools schools={[]} />
              <ProjectLeaders leaders={[{
                name: project.contact_person_name,
                role: project.contact_person_role,
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
              }]} />
            </div>
          </div>
        );
      case 'discussion':
        return <DiscussionSection discussion={[]} />;
      case 'activity':
        return <ProjectProgressUpdates projectId={project.id} />;
      case 'goals':
        return <GoalsSection goals={[]} />;
      case 'members':
        return <ManageMembers />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl  px-4 sm:px-6 lg:px-8 py-8">
        <ProjectHeader title={project.title} description={project.short_description} />
        <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  );
}