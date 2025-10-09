'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProjectById } from '@/app/hooks/useSWR';
import { deleteProject, joinProject, fetchProjectGoals, ProjectGoal } from '@/app/services/api';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [goals, setGoals] = useState<ProjectGoal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(false);

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

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      const result = await joinProject(params.id as string);
      alert(result.message || 'Successfully joined the project!');
      // Refresh the project data
      router.refresh();
    } catch (error) {
      console.error('Failed to join project:', error);
      alert(error instanceof Error ? error.message : 'Failed to join project. Please try again.');
    } finally {
      setIsJoining(false);
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
          <div className="space-y-6">
            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Timeline Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Timeline</h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Start:</span> {new Date(project.start_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">End:</span> {new Date(project.end_date).toLocaleDateString()}
                </p>
              </div>

              {/* Status Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Status</h3>
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'published' ? 'bg-green-100 text-green-800' :
                  project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <p className="text-xs text-gray-500 mt-2">
                  {project.is_open_for_collaboration ? '✓ Open for collaboration' : 'Not accepting collaborators'}
                </p>
              </div>

              {/* Participation Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Participation</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">{project.participating_schools_count || 0}</p>
                <p className="text-xs text-gray-500">Schools participating</p>
              </div>
            </div>

            {/* Environmental Themes */}
            {project.environmental_themes && Object.keys(project.environmental_themes).length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Environmental Themes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.values(project.environmental_themes).map((theme, index) => (
                    <span key={index} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-green-700 border border-green-200">
                      {String(theme)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                About This Project
                </h2>
              <p className="text-gray-700 leading-relaxed">{project.detailed_description}</p>
            </div>

            {/* Goals & Timeline Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Goals */}
              <div className="bg-white rounded-lg border border-gray-200">
                {goalsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2 text-sm">Loading goals...</p>
                  </div>
                ) : (
                  <GoalsSection goals={goals} />
                )}
              </div>

              {/* Project Leaders & Contact */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Project Lead
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{project.contact_person_name}</p>
                    <p className="text-sm text-gray-600">{project.contact_person_role}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">School:</span> {project.lead_school_name}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Location:</span> {project.contact_city}, {project.contact_country}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {project.contact_person_email}
                    </p>
                  </div>
                  {project.recognition_type && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-900 mb-1">Recognition Offered:</p>
                      <span className="inline-flex px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                        {project.recognition_type.charAt(0).toUpperCase() + project.recognition_type.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Discussion Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
            <DiscussionSection discussion={[]} />
            </div>
          </div>
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
                <DiscussionSection discussion={[]} />
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
              <ManageMembers />
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
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
        <ProjectHeader title={project.title} description={project.short_description} />
          </div>
          <div className="flex gap-3">
            {project.is_open_for_collaboration && !isOwner && (
              <button 
                onClick={handleJoin}
                disabled={isJoining}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? 'Joining...' : 'Join Project'}
              </button>
            )}
            {isOwner && (
              <>
                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Edit Project
                </Link>
                <button 
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Project'}
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Project</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{project.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  handleDelete();
                }}
                className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
