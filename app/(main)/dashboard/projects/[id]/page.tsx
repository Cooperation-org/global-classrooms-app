'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProjectById } from '@/app/hooks/useSWR';
import { deleteProject, fetchProjectGoals, fetchProjectFiles, ProjectGoal, ProjectFile } from '@/app/services/api';
import { ProjectHeader } from '@/app/components/projects/ProjectHeader';
import { ProjectTabs } from '@/app/components/projects/ProjectTabs';
import { ManageMembers } from '@/app/components/projects/ManageMembers';
import { ParticipatingSchools, ProjectLeaders } from '@/app/components/projects/ProjectSidebar';
import { ProjectProgressUpdates } from '@/app/components/projects/ProjectProgressUpdates';
import { ProjectJoinButton } from '@/app/components/projects/ProjectJoinButton';

// Import the ProjectOverview component
import { ProjectOverview } from '@/app/components/projects/ProjectOverview';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [goals, setGoals] = useState<ProjectGoal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [resources, setResources] = useState<ProjectFile[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);

  // Use SWR hook for data fetching
  const { project, isLoading, error } = useProjectById(params.id as string);

  // Get current user ID from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUserId(parsedUser.id);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  // Fetch project goals
  useEffect(() => {
    const loadGoals = async () => {
      if (!params.id) return;
      
      try {
        setGoalsLoading(true);
        const response = await fetchProjectGoals(params.id as string, { limit: 100 });
        setGoals(response.results);
      } catch (error) {
        console.error('Failed to load project goals:', error);
      } finally {
        setGoalsLoading(false);
      }
    };

    loadGoals();
  }, [params.id]);

  // Fetch project resources (files)
  useEffect(() => {
    const loadResources = async () => {
      if (!params.id) return;

      try {
        setResourcesLoading(true);
        const files = await fetchProjectFiles(params.id as string, 1, 100);
        setResources(files);
      } catch (error) {
        console.error('Failed to load project resources:', error);
      } finally {
        setResourcesLoading(false);
      }
    };

    loadResources();
  }, [params.id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(params.id as string);
      // Redirect to projects page after successful deletion
      router.push('/dashboard/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
      setIsDeleting(false);
    }
  };


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

  // Check if current user is the project owner
  const isOwner = currentUserId && project?.created_by === currentUserId;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <ProjectOverview
            project={{
              id: parseInt(project.id, 10) || 0,
              title: project.title,
              overview: project.detailed_description || '',
              start_date: project.start_date,
              end_date: project.end_date,
              status: project.status,
              is_open_for_collaboration: project.is_open_for_collaboration,
              environmental_themes: project.environmental_themes,
              participating_schools_count: parseInt(project.participating_schools_count || '0', 10),
              contact_person_name: project.contact_person_name,
              contact_person_email: project.contact_person_email,
              contact_person_role: project.contact_person_role,
              lead_school_name: project.lead_school_name,
              contact_city: project.contact_city,
              contact_country: project.contact_country,
              recognition_type: project.recognition_type,
              schedule: [],
              resources: resources.map(f => ({ label: f.description || 'Project File', url: f.file, type: 'file' })),
              discussion: [],
              schools: (project.participating_schools || []).map((school: { id?: string; school?: string; name?: string }) => ({
                name: school.name || 'Unknown School',
                location: '',
                logo: '',
              })),
              leaders: []
            }}
            goals={goals}
            projectId={project.id}
          />
        );
      case 'discussion':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Discussion & Collaboration</h2>
                    <p className="text-sm text-gray-500">Connect with other participants on Slack</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-6">
                  <p className="text-gray-600 text-sm mb-6">
                    Connect with other participants, share ideas, and collaborate on this
                    project through our Slack workspace.
                  </p>
                  <a
                    href="https://join.slack.com/t/global-classroom-talk/shared_invite/zt-38di7bdpy-znxFApF3QNg1F2guuKXPyw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#4BA186] text-white font-medium rounded-lg shadow hover:bg-[#3a876e] transition"
                  >
                    Join the Slack Discussion
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Project Activity</h2>
                  <p className="text-sm text-gray-500">Latest updates and progress reports</p>
                </div>
              </div>
            </div>
            <ProjectProgressUpdates projectId={project.id} />
          </div>
        );
      case 'goals':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Goals & Targets</h2>
                      <p className="text-sm text-gray-500">Track project objectives and milestones</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {goals.filter(g => g.is_completed).length} / {goals.length} completed
                  </div>
                </div>
              </div>
              {goalsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2 text-sm">Loading goals...</p>
                </div>
              ) : (
                <div className="p-6">
                  {goals.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set</h3>
                      <p className="text-gray-500">Project goals will appear here once they are added.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {goals.map((goal, index) => (
                        <div key={goal.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="flex-shrink-0">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5" 
                              checked={goal.is_completed}
                              disabled
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <h4 className={`font-medium ${goal.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {index + 1}. {goal.title}
                              </h4>
                              {goal.is_completed && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✓ Completed
                                </span>
                              )}
                            </div>
                            {goal.description && (
                              <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              Created {new Date(goal.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 'members':
        return (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                  <p className="text-sm text-gray-500">Manage project participants and collaborators</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ManageMembers projectId={project.id} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all group"
        >
          <svg 
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Projects</span>
        </button>

        {/* Project Header and Actions */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
          <div className="flex-1">
        <ProjectHeader title={project.title} description={project.short_description} />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {!isOwner && (
              <ProjectJoinButton
                projectId={project.id}
                projectData={{
                  lead_school: project.lead_school,
                  participating_schools: project.participating_schools?.map((school) => ({ 
                    id: school.id || school.school,
                    school: school.school || school.id 
                  })),
                  is_open_for_collaboration: project.is_open_for_collaboration,
                  title: project.title,
                }}
                onJoinSuccess={() => router.refresh()}
              />
            )}
            {isOwner && (
              <>
                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm hover:shadow transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Details</span>
                </Link>
                <button 
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-red-600 border-2 border-red-200 rounded-lg font-medium hover:bg-red-50 hover:border-red-300 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>{isDeleting ? 'Deleting...' : 'Delete Project'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderTabContent()}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete This Project?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              You are about to permanently delete <span className="font-semibold">&quot;{project.title}&quot;</span>. All project data, goals, and activity will be lost forever.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                disabled={isDeleting}
              >
                No, Keep It
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  handleDelete();
                }}
                className="flex-1 px-4 py-3 bg-red-600 rounded-lg font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
