import React from 'react';
import Link from 'next/link';
import { School } from '@/app/services/api';

type TagType = 'waste' | 'energy' | 'climate' | 'water' | 'biodiversity';

interface SchoolTag {
  label: string;
  type: TagType;
}

export function SchoolCard({ school }: { school: School }) {
  // Convert API school data to match the card structure
  const getSchoolImage = () => {
    return school.logo || 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=600';
  };

  const getSchoolTags = (): SchoolTag[] => {
    const tags: SchoolTag[] = [];
    if (school.institution_type) {
      tags.push({ label: school.institution_type.replace('_', ' '), type: 'climate' });
    }
    if (school.affiliation) {
      tags.push({ label: school.affiliation, type: 'energy' });
    }
    return tags;
  };

  const getSchoolLocation = () => {
    return `${school.city}, ${school.country}`;
  };

  const getTagClassName = (type: TagType) => {
    switch (type) {
      case 'waste':
        return 'bg-green-50 text-green-700';
      case 'energy':
        return 'bg-yellow-50 text-yellow-700';
      case 'climate':
        return 'bg-sky-50 text-sky-700';
      case 'water':
        return 'bg-blue-50 text-blue-700';
      case 'biodiversity':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTagIcon = (type: TagType) => {
    switch (type) {
      case 'waste':
        return '♻️';
      case 'energy':
        return '⚡';
      case 'climate':
        return '🌤️';
      case 'water':
        return '💧';
      case 'biodiversity':
        return '🧬';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="relative">
        <img src={getSchoolImage()} alt={school.name} className="w-full h-44 object-cover" />
        {school.affiliation === 'international' && (
          <span className="absolute top-3 right-3 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full shadow">International</span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{school.name}</h3>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="mr-1">
            <path d="M10 2C6.686 2 4 4.686 4 8c0 5.25 6 10 6 10s6-4.75 6-10c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 10 5a2.5 2.5 0 0 1 0 5.5z" fill="#6B7280"/>
          </svg>
          {getSchoolLocation()}
        </div>
        <div className="text-gray-700 text-sm mb-3 line-clamp-2">{school.overview}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {getSchoolTags().map((tag, index) => (
            <span key={index} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTagClassName(tag.type)}`}>
              {getTagIcon(tag.type) && <span className="mr-1">{getTagIcon(tag.type)}</span>}
              {tag.label}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-gray-500 text-sm">
            <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="mr-1">
              <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.314 0-10 1.657-10 5v1a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1c0-3.343-6.686-5-10-5z" fill="#6B7280"/>
            </svg>
            {school.number_of_students} students
          </div>
          <Link href={`/dashboard/schools/${school.id}`} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
} 