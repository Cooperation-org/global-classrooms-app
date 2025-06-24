'use client'
import React, { useState, useEffect } from 'react';
import { ProjectHeader } from '@/app/components/projects/ProjectHeader';
import { ProjectTabs } from '@/app/components/projects/ProjectTabs';
import { ProjectOverview } from '@/app/components/projects/ProjectOverview';
import { ProjectMembers } from '@/app/components/projects/ProjectMembers';
import { ParticipatingSchools, ProjectLeaders } from '@/app/components/projects/ProjectSidebar';
import { Project } from '@/app/types/project';
import { mockProjects } from '@/app/data/mockProjects';

// Import the subcomponents from ProjectOverview
import { GoalsSection, ResourcesSection, DiscussionSection, ScheduleSection } from '@/app/components/projects/ProjectOverview';
import { ProjectProgressUpdates } from '@/app/components/projects/ProjectProgressUpdates';

export default function ProjectDetailsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProject(mockProjects[0]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="font-medium">Project not found.</p>
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
                <p className="text-gray-700 text-sm leading-relaxed">{project.overview}</p>
              </div>
            </div>
            <ScheduleSection schedule={project.schedule} />
            <GoalsSection goals={project.goals} />
            <ResourcesSection resources={project.resources} />
            <DiscussionSection discussion={project.discussion} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ParticipatingSchools schools={project.schools} />
              <ProjectLeaders leaders={project.leaders} />
            </div>
          </div>
        );
      case 'discussion':
        return <DiscussionSection discussion={project.discussion} />;
      case 'activity':
        return <ProjectProgressUpdates />;
      case 'goals':
        return <GoalsSection goals={project.goals} />;
      case 'members':
        return <ProjectMembers />;
      default:
        return <ProjectOverview project={project} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectHeader title={project.title} description={project.description} />
        <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  );
}