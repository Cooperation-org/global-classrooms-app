import React from 'react';
import { SchoolCollaboration } from '@/app/data/mockSchools';

export function SchoolCollaborations({ collaborations }: { collaborations: SchoolCollaboration[] }) {
  if (!collaborations || collaborations.length === 0) return null;
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Collaborations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collaborations.map((school, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden flex flex-col items-center">
            <img src={school.image} alt={school.name} className="w-full h-70 object-cover rounded-xl" />
            <div className="p-4 w-full ">
              <h3 className="text-base font-semibold text-gray-900">{school.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 