import React from 'react';
import { Users } from 'lucide-react';

export function ProjectMembers() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Manage Members</h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          Add Member
        </button>
      </div>
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">No members added yet</p>
          <p className="text-sm text-gray-400">Invite teachers and students to join this project</p>
        </div>
      </div>
    </div>
  );
} 