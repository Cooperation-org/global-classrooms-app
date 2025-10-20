import React from 'react';
import { FileText, ExternalLink, Slack, Users, User } from 'lucide-react';
import { ProjectGoal } from '@/app/services/api';

interface Project {
  id: number;
  title: string;
  overview: string;
  schedule?: { week: string; title: string; description: string }[];
  resources?: { label: string; url: string; type: string }[];
  discussion?: { user: string; message: string; time: string; avatar: string }[];
  schools?: { name: string; location: string; logo: string }[];
  leaders?: { name: string; role: string; avatar: string }[];
}

interface ProjectOverviewProps {
  project: Project;
  goals?: ProjectGoal[];
}

export function ProjectOverview({ project, goals }: ProjectOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Project Overview Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Project Overview
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            {project.overview}
          </p>
        </div>
      </div>

      {/* Schedule Section */}
      {project.schedule && project.schedule.length > 0 && (
        <ScheduleSection schedule={project.schedule} />
      )}

      {/* Goals and Resources Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GoalsSection goals={goals || []} />
        {project.resources && project.resources.length > 0 && (
          <ResourcesSection resources={project.resources} />
        )}
      </div>

      {/* Discussion Forum */}
      <DiscussionSection discussion={project.discussion} />

      {/* Participating Schools */}
      {project.schools && project.schools.length > 0 && (
        <ParticipatingSchoolsSection schools={project.schools} />
      )}

      {/* Project Leaders */}
      {project.leaders && project.leaders.length > 0 && (
        <ProjectLeadersSection leaders={project.leaders} />
      )}
    </div>
  );
}

function ScheduleSection({ schedule }: { schedule: NonNullable<Project["schedule"]> }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Schedule</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {schedule.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {item.week}: {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalsSection({ goals }: { goals: ProjectGoal[] }) {
  if (!goals || goals.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Goals and Targets</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600">No goals have been added yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Goals and Targets</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-start gap-3">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 flex-shrink-0" 
                checked={!!goal.is_completed}
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

function ResourcesSection({ resources }: { resources: NonNullable<Project["resources"]> }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Resources</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {resources.map((resource, i) => (
            <a
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {resource.label}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiscussionSection({ discussion }: { discussion?: Project['discussion'] }) {
  if (discussion && discussion.length > 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Discussion Forum</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {discussion.map((msg, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                  {msg.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {msg.user}
                    </span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Discussion Forum</h2>
      </div>
      <div className="p-6">
        <div className="text-center py-6">
          <p className="text-gray-600 text-sm mb-6">
            Connect with other participants, share ideas, and collaborate on this
            project through our Slack workspace.
          </p>
          <a
            href="https://join.slack.com/t/global-classroom-talk/shared_invite/zt-38di7bdpy-znxFApF3QNg1F2guuKXPyw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#4BA186] text-white font-medium rounded-lg shadow hover:bg-[#3a876e] transition"
          >
            Join the Slack Discussion
            <ExternalLink className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* 
// Commented out original DiscussionSection component and functionality
function OriginalDiscussionSection({
 discussion,
}:
 {
 discussion: Project["discussion"];
}) {
 const [newMessage, setNewMessage] = React.useState("");
 return (
   <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
     <div className="px-6 py-5 border-b border-gray-100">
       <h2 className="text-lg font-semibold text-gray-900">
         Discussion Forum
       </h2>
     </div>
     <div className="p-6">
       <div className="space-y-6 mb-6">
         {discussion.map((msg, i) => (
           <div key={i} className="flex gap-4">
             <img
               src={msg.avatar}
               alt={msg.user}
               className="w-10 h-10 rounded-full object-cover flex-shrink-0"
             />
             <div className="flex-1">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-sm font-semibold text-gray-900">
                   {msg.user}
                 </span>
                 <span className="text-xs text-gray-500">{msg.time}</span>
               </div>
               <p className="text-sm text-gray-700 leading-relaxed">
                 {msg.message}
               </p>
             </div>
           </div>
         ))}
       </div>
       <div className="flex gap-3 pt-4 border-t border-gray-200">
         <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
           You
         </div>
         <div className="flex-1 flex gap-3">
           <input
             type="text"
             value={newMessage}
             onChange={(e) => setNewMessage(e.target.value)}
             placeholder="Send Message"
             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           />
           <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
             <svg
               className="w-4 h-4"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeWidth={2}
                 d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
               />
             </svg>
           </button>
         </div>
       </div>
     </div>
   </div>
 );
}
*/

// Participating Schools Section
function ParticipatingSchoolsSection({ schools }: { schools: NonNullable<Project["schools"]> }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Participating Schools</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {schools.map((school, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{school.name}</p>
                {school.location && (
                  <p className="text-xs text-gray-500">{school.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Project Leaders Section
function ProjectLeadersSection({ leaders }: { leaders: NonNullable<Project["leaders"]> }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Project Leaders</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {leaders.map((leader, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{leader.name}</p>
                {leader.role && (
                  <p className="text-xs text-gray-500">{leader.role}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Added DiscussionSection back to exports
export { GoalsSection, ResourcesSection, ScheduleSection, DiscussionSection, ParticipatingSchoolsSection, ProjectLeadersSection };
