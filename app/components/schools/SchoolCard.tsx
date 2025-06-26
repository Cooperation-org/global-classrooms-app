import React from 'react';
import Link from 'next/link';
import { School } from '../../data/mockSchools';

export function SchoolCard({ school }: { school: School }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="relative">
        <img src={school.image} alt={school.name} className="w-full h-44 object-cover" />
        {school.badge && (
          <span className="absolute top-3 right-3 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full shadow">{school.badge}</span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{school.name}</h3>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="mr-1"><path d="M10 2C6.686 2 4 4.686 4 8c0 5.25 6 10 6 10s6-4.75 6-10c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 10 5a2.5 2.5 0 0 1 0 5.5z" fill="#6B7280"/></svg>
          {school.location}
        </div>
        <div className="text-gray-700 text-sm mb-3 line-clamp-2">{school.description}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {school.tags.map(tag => (
            <span key={tag.label} className={
              `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ` +
              (tag.type === 'waste' ? 'bg-green-50 text-green-700' :
                tag.type === 'energy' ? 'bg-yellow-50 text-yellow-700' :
                tag.type === 'climate' ? 'bg-sky-50 text-sky-700' :
                tag.type === 'water' ? 'bg-blue-50 text-blue-700' :
                tag.type === 'biodiversity' ? 'bg-purple-50 text-purple-700' :
                'bg-gray-100 text-gray-700')
            }>
              {tag.type === 'waste' && <span className="mr-1">♻️</span>}
              {tag.type === 'energy' && <span className="mr-1">⚡</span>}
              {tag.type === 'climate' && <span className="mr-1">🌤️</span>}
              {tag.type === 'water' && <span className="mr-1">💧</span>}
              {tag.type === 'biodiversity' && <span className="mr-1">🧬</span>}
              {tag.label}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-gray-500 text-sm">
            <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="mr-1"><path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.314 0-10 1.657-10 5v1a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1c0-3.343-6.686-5-10-5z" fill="#6B7280"/></svg>
            {school.students} students
          </div>
          <Link href={`/dashboard/schools/${school.id}`} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
} 