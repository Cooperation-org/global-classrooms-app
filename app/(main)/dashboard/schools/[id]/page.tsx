'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { mockSchools, School } from '@/app/data/mockSchools';
import { SchoolActiveProjects } from '@/app/components/schools/SchoolActiveProjects';
import { SchoolCollaborations } from '@/app/components/schools/SchoolCollaborations';
import { SchoolImpact } from '@/app/components/schools/SchoolImpact';

function SchoolDetailsHeader({ school }: { school: School }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
      <div className="flex items-center gap-6">
        <img src={school.image} alt={school.name} className="w-24 h-24 rounded-xl object-cover" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{school.name}</h1>
          {school.subtitle && <div className="text-[#4BA186] text-base font-medium mb-1">{school.subtitle}</div>}
          <div className="text-[#4BA186] text-sm">Located in {school.location}</div>
        </div>
      </div>
      <button className="px-6 py-3 bg-black text-white rounded-lg font-medium text-base flex items-center gap-2 hover:bg-[#222B45] transition">
        Connect With School
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Active Projects' },
  { id: 'collaborations', label: 'Collaborations' },
  { id: 'impact', label: 'Impact' },
];

function SchoolDetailsTabs({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
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
  );
}

function SchoolOverviewSection({ school }: { school: School }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
      <p className="text-gray-700 mb-8 max-w-2xl">{school.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="text-[#4BA186] font-medium mb-1">School Type</div>
          <div className="text-gray-900">{school.schoolType}</div>
        </div>
        <div>
          <div className="text-[#4BA186] font-medium mb-1">Website</div>
          <div className="text-gray-900">{school.website}</div>
        </div>
      </div>
      <div className="mb-8">
        <div className="text-[#4BA186] font-medium mb-1">Sustainability Goals</div>
        <div className="text-gray-900">{school.sustainabilityGoals}</div>
      </div>
    </div>
  );
}

export default function SchoolDetailsPage() {
  const params = useParams();
  const id = Number(params?.id);
  const school = mockSchools.find(s => s.id === id) || mockSchools[0];
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-sm text-[#4BA186] mb-2">Schools / <span className="text-gray-900">{school.name}</span></div>
      <SchoolDetailsHeader school={school} />
      <SchoolDetailsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'overview' && (
        <>
          <SchoolOverviewSection school={school} />
          <SchoolActiveProjects projects={school.activeProjects || []} />
          <SchoolCollaborations collaborations={school.collaborations || []} />
          <SchoolImpact impact={school.impact || []} />
        </>
      )}
      {activeTab === 'projects' && <SchoolActiveProjects projects={school.activeProjects || []} />}
      {activeTab === 'collaborations' && <SchoolCollaborations collaborations={school.collaborations || []} />}
      {activeTab === 'impact' && <SchoolImpact impact={school.impact || []} />}
    </div>
  );
} 