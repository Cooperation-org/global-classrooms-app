'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useFeaturedProjects, useCompletedProjects, useOpenCollaborations } from '@/app/hooks/useSWR';

const placeholderImg = 'https://placehold.co/300x180?text=Image';

// Extend Error type for custom properties
interface ApiError extends Error {
  status?: number;
}

// Project interface for type safety
interface Project {
  id: string;
  title: string;
  short_description: string;
  cover_image?: string;
  status: string;
}

export default function DashboardHome() {
  const [userName, setUserName] = useState<string>('');

  // Use SWR hooks for data fetching
  const { projects: featuredProjects, isLoading: featuredLoading, error: featuredError } = useFeaturedProjects();
  const { projects: completedProjects, isLoading: completedLoading, error: completedError } = useCompletedProjects();
  const { projects: openCollaborations, isLoading: collaborationsLoading, error: collaborationsError } = useOpenCollaborations();

  // Check if any data is loading
  const isLoading = featuredLoading || completedLoading || collaborationsLoading;
  
  // Check if there are any errors
  const error = featuredError || completedError || collaborationsError;

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserName(parsedUser.full_name || parsedUser.email || parsedUser.username || 'User');
    }
  }, []);

  // Handle authentication errors
  useEffect(() => {
    if (error && (error as ApiError)?.status === 401) {
      // Don't redirect immediately, let the SWR fetcher handle it
      console.log('Authentication error detected in dashboard');
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && (error as ApiError)?.status !== 401) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load dashboard</h2>
          <p className="text-gray-600 mb-4">Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl  px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userName}! 👋
              </h1>
              <p className="mt-2 text-gray-600">
                Here&apos;s what&apos;s happening in your global classroom community.
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Project
              </Link>
              <Link
                href="/dashboard/schools/new"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add School
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Projects */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Featured Projects</h2>
              <Link
                href="/dashboard/projects"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {featuredProjects.length > 0 ? (
                featuredProjects.map((project: Project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img
                        src={project.cover_image || placeholderImg}
                        alt={project.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {project.short_description}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No featured projects yet.</p>
              )}
            </div>
          </div>

          {/* Completed Projects */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recently Completed</h2>
              <Link
                href="/dashboard/projects"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {completedProjects.length > 0 ? (
                completedProjects.map((project: Project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img
                        src={project.cover_image || placeholderImg}
                        alt={project.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {project.short_description}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No completed projects yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Open Collaborations */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Open for Collaboration</h2>
            <Link
              href="/dashboard/projects"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {openCollaborations.length > 0 ? (
              openCollaborations.map((project: Project) => (
                <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <img
                    src={project.cover_image || placeholderImg}
                    alt={project.title}
                    className="w-full h-32 rounded-lg object-cover mb-4"
                  />
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-3">
                    {project.short_description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Open
                    </span>
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Join →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8 col-span-full">No open collaborations yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 