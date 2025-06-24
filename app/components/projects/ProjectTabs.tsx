import React from 'react';
import { FileText, Activity, Target, Users } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'activity', label: 'Activity & Updates', icon: Activity },
  { id: 'goals', label: 'Goals & Impact', icon: Target },
  { id: 'members', label: 'Manage Members', icon: Users },
];

interface ProjectTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProjectTabs({ activeTab, setActiveTab }: ProjectTabsProps) {
  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="flex">
          {TABS.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 