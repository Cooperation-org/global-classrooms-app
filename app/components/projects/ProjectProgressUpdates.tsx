import React, { useState, useEffect } from 'react';
import { fetchProjectUpdates, ProjectUpdate } from '@/app/services/api';
import { ShareProjectProgressForm } from './ShareProjectProgressForm';

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

export function ProjectProgressUpdates({ projectId }: { projectId: string }) {
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjectUpdates = async () => {
      try {
        setLoading(true);
        const response = await fetchProjectUpdates(projectId);
        setUpdates(response.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project updates');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProjectUpdates();
    }
  }, [projectId]);

  if (showForm) {
    return <ShareProjectProgressForm onCancel={() => setShowForm(false)} />;
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#222B45] mb-2">Project Updates</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // For now, show all updates since the API doesn't provide status
  const filtered = updates;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#222B45]">Project Updates</h2>
        <button 
          className="ml-4 px-4 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-900" 
          onClick={() => setShowForm(true)}
        >
          Add Update
        </button>
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
          <div className="text-[#6B7280] text-sm text-center py-8">
            {updates.length === 0 ? 'No updates found for this project.' : 'No updates match the selected filter.'}
          </div>
        )}
        {filtered.map((update) => (
          <div
            key={update.id}
            className="border rounded-lg p-4 flex flex-col gap-1 bg-white border-gray-200"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-[#222B45]">{update.title}</span>
              <span className="text-xs text-gray-500">
                {new Date(update.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm text-[#1A7F4F] mb-1">{update.content}</div>
            <div className="text-xs text-[#6B7280]">
              Posted by {update.author_name} on {new Date(update.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 