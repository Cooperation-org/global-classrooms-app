import React from 'react';
import { Project } from '@/app/services/api';
import Link from 'next/link';

export function SchoolActiveProjects({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Projects</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active projects</h3>
          <p className="text-gray-500">This school hasn&apos;t created any projects yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Active Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl overflow-hidden flex flex-col border border-gray-200 shadow-sm">
            <div className="aspect-video overflow-hidden">
              <img 
                src={project.cover_image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'} 
                alt={project.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'published' ? 'bg-green-100 text-green-800' :
                  project.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.short_description}</p>
              <div className="mt-auto">
                <Link 
                  href={`/dashboard/projects/${project.id}`}
                  className="text-[#4BA186] hover:text-[#3a8a6f] text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 