import React from 'react';
import { Activity } from 'lucide-react';

export function ProjectActivity() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Activity & Updates</h2>
      </div>
      <div className="p-6">
        <div className="text-center py-12">
          <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">No recent activity</p>
          <p className="text-sm text-gray-400">Project activities and updates will appear here</p>
        </div>
      </div>
    </div>
  );
} 