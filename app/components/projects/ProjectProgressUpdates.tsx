import React, { useState } from 'react';
import { mockProgressUpdates, ProgressStatus } from '../../data/mockProgressUpdates';
import { ShareProjectProgressForm } from './ShareProjectProgressForm';

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

const statusColors: Record<ProgressStatus, string> = {
  approved: 'bg-green-50 border-green-200',
  pending: 'bg-blue-50 border-blue-200',
  rejected: 'bg-red-50 border-red-200',
};
const dotColors: Record<ProgressStatus, string> = {
  approved: 'bg-green-500',
  pending: 'bg-blue-500',
  rejected: 'bg-red-500',
};

export function ProjectProgressUpdates() {
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <ShareProjectProgressForm onCancel={() => setShowForm(false)} />;
  }

  const filtered =
    activeTab === 'all'
      ? mockProgressUpdates
      : mockProgressUpdates.filter((u) => u.status === activeTab);

  return (
    <div className=" p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#222B45]">My Progress Updates</h2>
        <button className="ml-4 px-4 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-900" onClick={() => setShowForm(true)}>Add Update</button>
      </div>
      <div className="flex items-center gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-1 rounded-full font-medium text-sm transition-colors border ${
              activeTab === tab.id
                ? 'bg-[#1A7F4F] text-white border-[#1A7F4F]' : 'bg-white text-[#1A7F4F] border-[#E5E7EB] hover:bg-[#E5E7EB]'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-[#6B7280] text-sm text-center py-8">No updates found.</div>
        )}
        {filtered.map((update) => (
          <div
            key={update.id}
            className={`border rounded-lg p-4 flex flex-col gap-1 ${statusColors[update.status]}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-[#222B45]">{update.title}</span>
              <span className={`w-3 h-3 rounded-full ${dotColors[update.status]}`}></span>
            </div>
            <div className="text-sm text-[#1A7F4F] mb-1">{update.description}</div>
            <div className="text-xs text-[#6B7280]">Submitted on {update.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 