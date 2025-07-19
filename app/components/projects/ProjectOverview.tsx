"use client";
import React from "react";
import { FileText, ExternalLink } from "lucide-react";

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ScheduleSection schedule={project.schedule} />
        <GoalsSection goals={project.goals} />
      </div>

      <ResourcesSection resources={project.resources} />

      {/* Discussion Section with Slack Link */}
      <DiscussionSection />
    </div>
  );
}

function ScheduleSection({ schedule }: { schedule: Project["schedule"] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#222B45] mb-6">Schedule</h2>
      <div className="flex flex-col">
        {schedule.map((item, i) => (
          <div key={i}>
            <h3 className="font-bold text-[#222B45] text-base mb-1">
              {item.week}: {item.title}
            </h3>
            <div className="text-sm text-[#1A7F4F]  mb-4">
              {item.description}
            </div>
            {i !== schedule.length - 1 && <div className=" mb-4" />}
          </div>
        ))}
      </div>
    </section>
  );
}

function GoalsSection({ goals }: { goals: string[] }) {
  return (
    <div>
      <div className="py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          Goals and Targets
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {goals.map((goal, i) => (
            <div key={i} className="flex items-start gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 flex-shrink-0"
                disabled
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                {goal}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} // Make sure this closing brace exists

function ResourcesSection({ resources }: { resources: Project["resources"] }) {
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
                <p className="text-sm font-medium text-gray-900 truncate">
                  {resource.label}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simplified Discussion Section - No card, no title
function DiscussionSection() {
  return (
    <div className="text-center py-6">
      <p className="text-gray-600 text-sm mb-6">
        Connect with other participants, share ideas, and collaborate on this
        project through our Slack workspace.
      </p>

      {/* Slack Channel Link */}
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

// Added DiscussionSection back to exports
export { GoalsSection, ResourcesSection, ScheduleSection, DiscussionSection };
