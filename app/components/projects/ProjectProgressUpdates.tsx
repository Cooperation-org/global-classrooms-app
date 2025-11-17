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
  const [selectedUpdate, setSelectedUpdate] = useState<ProjectUpdate | null>(null);
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

  const handleUpdateSuccess = async () => {
    // Reload updates after successful creation
    try {
      setLoading(true);
      const response = await fetchProjectUpdates(projectId);
      setUpdates(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reload project updates');
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <div className="p-6">
        <ShareProjectProgressForm 
          projectId={projectId}
          onCancel={() => setShowForm(false)}
          onSuccess={handleUpdateSuccess}
        />
      </div>
    );
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

  // Helper to get first line of description as title
  const getUpdateTitle = (description: string) => {
    const firstLine = description.split('\n')[0];
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
  };

  // Helper to get status (for now, we'll default to showing all as approved since API doesn't provide status)
  const getStatus = (update: ProjectUpdate) => {
    // TODO: Add status field to API response if available
    return 'approved'; // Default for now
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#222B45]">My Progress Updates</h2>
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
        {filtered.map((update) => {
          const status = getStatus(update);
          const updateTitle = getUpdateTitle(update.description);
          const hasMedia = update.media && update.media.length > 0;
          const firstImage = hasMedia ? update.media.find(url => /\.(jpg|jpeg|png|gif|webp)$/i.test(url)) : null;

          return (
            <div
              key={update.id}
              className="border rounded-lg bg-white border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left side - Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#222B45]">School:</span>
                        <span className="text-sm text-[#222B45] font-semibold">{update.school_name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-[#222B45]">Update:</span>
                        <span className="text-sm text-[#222B45]">{updateTitle}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <span>Submitted: {new Date(update.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span>|</span>
                        <span>Phase: In Progress</span>
                      </div>
                    </div>
                    {/* Status indicator */}
                    {status === 'approved' && (
                      <div className="flex items-center gap-2 ml-4">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-green-600 font-medium">Approved</span>
                      </div>
                    )}
                    {status === 'rejected' && (
                      <div className="flex items-center gap-2 ml-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs text-red-600 font-medium">Rejected</span>
                      </div>
                    )}
                    {status === 'pending' && (
                      <div className="flex items-center gap-2 ml-4">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-blue-600 font-medium">Pending</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-[#222B45] mb-4 line-clamp-2">
                    {update.description}
                  </div>
                  
                  <button
                    onClick={() => setSelectedUpdate(update)}
                    className="px-4 py-2 bg-[#1A7F4F] text-white rounded-lg font-medium text-sm hover:bg-[#156d43] transition-colors"
                  >
                    View Full Update
                  </button>
                </div>

                {/* Right side - Image/Media */}
                {firstImage && (
                  <div className="w-full md:w-64 h-48 md:h-auto bg-gray-100 flex-shrink-0">
                    <img 
                      src={firstImage} 
                      alt="Update media"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {!firstImage && hasMedia && (
                  <div className="w-full md:w-64 h-48 md:h-auto bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-gray-500">{update.media.length} file(s)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Update Detail Modal */}
      {selectedUpdate && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedUpdate(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#222B45]">{selectedUpdate.school_name}</h3>
                {selectedUpdate.uploaded_by_name && (
                  <p className="text-sm text-gray-500 mt-1">Posted by {selectedUpdate.uploaded_by_name}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedUpdate(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(selectedUpdate.created_at).toLocaleString()}
                </p>
                <div className="text-base text-[#222B45] whitespace-pre-wrap leading-relaxed">
                  {selectedUpdate.description}
                </div>
              </div>

              {selectedUpdate.media && selectedUpdate.media.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-[#222B45] mb-3">Media Files</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUpdate.media.map((mediaUrl, index) => {
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
                      const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
                      const fileName = mediaUrl.split('/').pop() || `Media ${index + 1}`;

                      return (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          {isImage ? (
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                              <img 
                                src={mediaUrl} 
                                alt={fileName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  if (target.nextElementSibling) {
                                    (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                  }
                                }}
                              />
                              <div className="hidden w-full h-full items-center justify-center text-gray-400">
                                <div className="text-center">
                                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p className="text-sm">Image failed to load</p>
                                </div>
                              </div>
                            </div>
                          ) : isVideo ? (
                            <div className="aspect-video bg-gray-100">
                              <video 
                                src={mediaUrl} 
                                controls
                                className="w-full h-full"
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                              <div className="text-center p-4">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-600 mb-2 truncate">{fileName}</p>
                                <a 
                                  href={mediaUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-[#1A7F4F] hover:underline"
                                >
                                  Download File
                                </a>
                              </div>
                            </div>
                          )}
                          <div className="p-2 bg-gray-50">
                            <a 
                              href={mediaUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-[#1A7F4F] hover:underline truncate block"
                            >
                              {fileName}
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 