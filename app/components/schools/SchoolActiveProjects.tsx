import React from 'react';
import { SchoolProject } from '@/app/data/mockSchools';

export function SchoolActiveProjects({ projects }: { projects: SchoolProject[] }) {
  if (!projects || projects.length === 0) return null;
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Active Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden flex flex-col">
            <img src={project.image} alt={project.title} className="w-full h-40 object-cover rounded-xl" />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
              <p className="text-sm text-[#4BA186]">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 