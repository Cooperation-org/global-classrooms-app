import React from 'react';
import { FileText, ExternalLink, Slack } from 'lucide-react';
import { ProjectGoal } from '@/app/services/api';

interface Project {
  id: number;
  title: string;
  overview: string;
  schedule: { week: string; title: string; description: string }[];
  goals: string[];
  resources: { label: string; url: string; type: string }[];
  discussion: { user: string; message: string; time: string; avatar: string }[];
  schools: { name: string; location: string; logo: string }[];
  leaders: { name: string; role: string; avatar: string }[];
}

interface ProjectOverviewProps {
  project: Project;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Project Overview</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 text-sm leading-relaxed">{project.overview}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ScheduleSection schedule={project.schedule} />
        <GoalsSection goals={[]} />
      </div>
      <ResourcesSection resources={project.resources} />
      <DiscussionSection discussion={project.discussion} />
    </div>
  );
}

function ScheduleSection({ schedule }: { schedule: Project['schedule'] }) {
  return (
    <section >
      <h2 className="text-lg font-semibold text-[#222B45] mb-6">Schedule</h2>
      <div className="flex flex-col">
        {schedule.map((item, i) => (
          <div key={i}>
            <h3 className="font-bold text-[#222B45] text-base mb-1">{item.week}: {item.title}</h3>
            <div className='text-sm text-[#1A7F4F]  mb-4'>{item.description}</div>
            {i !== schedule.length - 1 && (
              <div className=" mb-4" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function GoalsSection({ goals }: { goals: ProjectGoal[] }) {
  if (!goals || goals.length === 0) {
    return (
      <div>
        <div className="py-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Goals and Targets</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set</h3>
            <p className="text-gray-500">Project goals will appear here once they are added.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Goals and Targets</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-start gap-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 flex-shrink-0" 
                checked={goal.is_completed}
                disabled
              />
              <div className="flex-1">
                <span className={`text-sm leading-relaxed ${goal.is_completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {goal.title}
                </span>
                {goal.description && (
                  <p className="text-xs text-gray-500 mt-1">{goal.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourcesSection({ resources }: { resources: Project['resources'] }) {
  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {resources.map((resource, i) => (
            <a
              key={i}
              href={resource.url}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{resource.label}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiscussionSection({ discussion }: { discussion: Project['discussion'] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Discussion Forum</h2>
      </div>
      <div >
        {/* Slack Integration Section */}
        <div >
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-[#4A154B] rounded-lg flex items-center justify-center flex-shrink-0">
              <Slack className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Join our Slack workspace</h3>
              <p className="text-xs text-gray-600 mb-3">Connect with team members and stay updated on project progress</p>
              <a
                href="https://slack.com/join"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A154B] text-white text-sm font-medium rounded-lg hover:bg-[#3a0f3a] transition-colors"
              >
                <Slack className="w-4 h-4" />
                Join Slack Channel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { GoalsSection, ResourcesSection, DiscussionSection, ScheduleSection }; 