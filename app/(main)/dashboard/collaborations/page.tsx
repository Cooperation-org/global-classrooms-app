'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchFutureProjects, Project } from '@/app/services/api';
import { ProjectCard } from '@/app/components/collaborations/ProjectCard';

export default function CollaborationsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFutureProjects = async () => {
      try {
        setLoading(true);
        const futureProjects = await fetchFutureProjects();
        setProjects(futureProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load future projects');
      } finally {
        setLoading(false);
      }
    };

    loadFutureProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6FCF8]">
        <div className="max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading future projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6FCF8]">
        <div className="max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Projects</h1>
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
      <div className="max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Future Projects</h1>
            <p className="text-gray-500">Discover upcoming and ongoing environmental projects you can join</p>
          </div>
          <Link href="/dashboard/collaborations/new" className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg font-medium text-base hover:bg-[#222B45] transition">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 4v12m6-6H4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            Start New Project
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-6 px-8 py-6 mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#E6F4EA]">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" stroke="#4BA186" strokeWidth="2" fill="#F6FCF8" />
              <path d="M16 8v8l6 3" stroke="#4BA186" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 mb-1">Global Impact Network</div>
            <div className="text-gray-500">Join forces with schools across borders to amplify your environmental impact</div>
          </div>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No future projects available at the moment.</div>
            <Link href="/dashboard/collaborations/new" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
              Create the First Project
            </Link>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        )}
      </div>
    </div>
  );
} 