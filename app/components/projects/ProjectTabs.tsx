import React from "react";
import { FileText, MessageCircle, Activity, Target, Users } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "discussion", label: "Discussion Forum", icon: MessageCircle },
  { id: "activity", label: "Activity & Updates", icon: Activity },
  { id: "goals", label: "Goals & Impact", icon: Target },
  { id: "members", label: "Manage Members", icon: Users },
];

interface ProjectTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProjectTabs({ activeTab, setActiveTab }: ProjectTabsProps) {
  return (
    <div className="mb-8">
      <div className="border-b border-[#E5E7EB] bg-white">
        <nav className="flex">
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-all duration-200
                  ${
                    isActive
                      ? "border-[#1A7F4F] text-[#1A7F4F] bg-white"
                      : "border-transparent text-[#6B7280] hover:text-[#1A7F4F] hover:border-[#E5E7EB]"
                  }
                `}
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
