'use client'
import React, { useState } from 'react';
import { mockSchools } from '@/app/data/mockSchools';
import { SchoolCard } from '@/app/components/schools/SchoolCard';

const TABS = [
  { id: 'all', label: 'All Schools' },
  { id: 'partners', label: 'Partner Schools' },
];

export default function SchoolsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  // For now, just show all mockSchools. Filtering can be added later.
  const filteredSchools = mockSchools.filter(school =>
    school.name.toLowerCase().includes(search.toLowerCase()) ||
    school.location.toLowerCase().includes(search.toLowerCase()) ||
    school.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Schools Network</h1>
      <p className="text-gray-500 mb-8">Connect with schools around the world working on environmental projects</p>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
            <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
              <circle cx="9" cy="9" r="7" stroke="#9CA3AF" strokeWidth="2"/>
              <path d="M15 15L18 18" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search schools by name, location, or description..."
            className="w-full border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2 text-sm placeholder-[#9CA3AF] focus:outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="border border-gray-200 bg-white rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center gap-2">
            <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M3 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9H4a1 1 0 0 1-1-1V6zm2 3V7h10v2H5z" fill="#6B7280"/></svg>
            All Regions
          </button>
          <button className="border border-gray-200 bg-white rounded-lg px-4 py-2 text-sm text-gray-700">All Focus Areas</button>
          <button className="border border-gray-200 bg-white rounded-lg px-4 py-2 text-sm text-gray-700">All Students</button>
        </div>
      </div>
      <div className="flex gap-6 border-b border-gray-200 mb-8">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`py-2 px-4 font-medium text-base border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#1A7F4F] text-[#1A7F4F]' : 'border-transparent text-[#6B7280]'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSchools.map(school => (
          <SchoolCard key={school.id} school={school} />
        ))}
      </div>
    </div>
  );
} 