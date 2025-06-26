import React from 'react';
import Link from 'next/link';
import { Collaboration } from '@/app/data/mockCollaborations';

export function CollaborationCard({ collaboration }: { collaboration: Collaboration }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <img src={collaboration.image} alt={collaboration.title} className="w-full h-44 object-cover" />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-2">
          {collaboration.tags.map(tag => (
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{collaboration.status}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{collaboration.title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{collaboration.description}</p>
        <div className="flex items-center text-gray-400 text-sm mb-3">
          <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="mr-1"><circle cx="10" cy="10" r="8" stroke="#9CA3AF" strokeWidth="2" /><path d="M10 6v4l3 2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" /></svg>
          {collaboration.school}
        </div>
        <div className="flex items-center gap-1 mb-4">
          {collaboration.participants.slice(0, 3).map((p, i) => (
            <span key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${p.color}`}>{p.name}</span>
          ))}
          {collaboration.participants.length > 3 && (
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border bg-gray-100 text-gray-700">+{collaboration.participants.length - 3}</span>
          )}
        </div>
        <div className="flex items-center justify-end mt-auto">
          <Link href={`/dashboard/collaborations/${collaboration.id}`} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 