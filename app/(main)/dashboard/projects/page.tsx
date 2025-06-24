'use client'
import React, { useState } from 'react';
import { icons } from '../../../components/icons/icons';
import Link from 'next/link';

const projects = [
  {
    id: 1,
    title: 'Clean Water Initiative',
    description: 'Implement water conservation strategies and water quality monitoring systems in school and surrounding community.',
    tags: ['Water', 'SDG 6'],
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    school: 'Unknown School',
    icons: ['A', 'B', 'C'],
    count: 42,
  },
  {
    id: 2,
    title: 'Zero Waste School',
    description: 'Develop and implement a comprehensive zero waste strategy for schools to reduce landfill waste.',
    tags: ['Waste', 'SDG 6'],
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    school: 'Unknown School',
    icons: ['A', 'B', 'C'],
    count: 36,
  },
  {
    id: 3,
    title: 'Local Biodiversity Mapping',
    description: 'Map and protect local biodiversity through community science initiatives and habitat restoration.',
    tags: ['Biodiversity', 'SDG 15'],
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    school: 'Unknown School',
    icons: ['A', 'B', 'C'],
    count: 29,
  },
];

const TABS = [
  'All Projects',
  'Joined',
  'Featured',
  'HomeBiogas',
  'Collaborative',
];

function Tag({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${color || 'bg-blue-100 text-blue-800'}`}>{children}</span>
  );
}

function ProjectCard({ project }: { project: typeof projects[0] }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm flex flex-col">
      <div className="aspect-video overflow-hidden rounded-t-lg">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {project.tags.map((tag, i) => (
            <Tag key={tag} color={i === 0 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>{tag}</Tag>
          ))}
          <Tag color="bg-green-100 text-green-800">{project.status}</Tag>
        </div>
        <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-muted-foreground">{project.school}</span>
          <Link href={`/dashboard/projects/${project.id}`} className="px-3 py-1 text-xs font-medium rounded bg-gray-100 hover:bg-gray-200 transition-colors">View Details</Link>
        </div>
        <div className="flex items-center gap-2 mt-3">
          {/* Example icons for project features/participants */}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {icons.check} {icons.star} {icons.users}
          </span>
          <span className="text-xs text-muted-foreground ml-2">+{project.count}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState('All Projects');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Environmental Projects</h1>
      <p className="text-muted-foreground mb-6">Explore and join projects aligned with UN Sustainable Development Goals</p>
      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none
              ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Filters and search bar placeholder */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <input className="border rounded px-3 py-2 text-sm w-64" placeholder="Search projects..." />
        <select className="border rounded px-3 py-2 text-sm">
          <option>All Themes</option>
        </select>
        <select className="border rounded px-3 py-2 text-sm">
          <option>All SDGs</option>
        </select>
        <select className="border rounded px-3 py-2 text-sm">
          <option>All Status</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
} 