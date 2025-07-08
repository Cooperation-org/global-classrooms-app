import React from 'react';
import Link from 'next/link';
import { Project } from '@/app/services/api';

interface ThemeTag {
  label: string;
  type: 'water' | 'waste' | 'biodiversity' | 'sdg6' | 'sdg11' | 'sdg15';
}

export function ProjectCard({ project }: { project: Project }) {
  // Helper function to get theme tags from environmental_themes
  const getThemeTags = (): ThemeTag[] => {
    const tags: ThemeTag[] = [];
    if (project.environmental_themes) {
      Object.entries(project.environmental_themes).forEach(([key, value]) => {
        if (value) {
          tags.push({
            label: value,
            type: key as 'water' | 'waste' | 'biodiversity' | 'sdg6' | 'sdg11' | 'sdg15'
          });
        }
      });
    }
    return tags;
  };

  // Helper function to determine project status
  const getProjectStatus = () => {
    const currentDate = new Date();
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);
    
    if (currentDate < startDate) {
      return 'upcoming';
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return 'active';
    } else {
      return 'completed';
    }
  };

  const themeTags = getThemeTags();
  const status = getProjectStatus();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <img 
        src={project.cover_image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600'} 
        alt={project.title} 
        className="w-full h-44 object-cover" 
      />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-2">
          {themeTags.map(tag => (
            <span key={tag.label} className={
              `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ` +
              (tag.type === 'water' ? 'bg-blue-50 text-blue-700' :
                tag.type === 'waste' ? 'bg-green-50 text-green-700' :
                tag.type === 'biodiversity' ? 'bg-purple-50 text-purple-700' :
                tag.type === 'sdg6' ? 'bg-blue-100 text-blue-800' :
                tag.type === 'sdg11' ? 'bg-blue-100 text-blue-800' :
                tag.type === 'sdg15' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-700')
            }>
              {tag.label}
            </span>
          ))}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' :
            status === 'active' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {status}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{project.short_description}</p>
        <div className="flex items-center text-gray-400 text-sm mb-3">
          <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="mr-1">
            <circle cx="10" cy="10" r="8" stroke="#9CA3AF" strokeWidth="2" />
            <path d="M10 6v4l3 2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {project.lead_school_name || 'Unknown School'}
        </div>
        <div className="flex items-center gap-1 mb-4">
          {project.participating_schools_count && (
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border bg-blue-200 text-blue-800">
              {project.participating_schools_count}
            </span>
          )}
          {project.is_open_for_collaboration && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Open for Collaboration
            </span>
          )}
        </div>
        <div className="flex items-center justify-end mt-auto">
          <Link href={`/dashboard/projects/${project.id}`} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 