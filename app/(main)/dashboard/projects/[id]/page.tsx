'use client'
import React, { useState, useEffect } from 'react';
import { FileText, MessageCircle, Send, ArrowLeft, Target, Users, Activity, ExternalLink } from 'lucide-react';

// --- Types ---
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

// --- Mock Data ---
const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Water Conservation Initiative',
    overview: 'This project focuses on water conservation including the management of water resources through effective methods, education, and community engagement. Students and teachers will participate in water quality monitoring, awareness campaigns, and implementation of conservation strategies. The project culminates in a student-led campaign to implement water-saving measures in their schools and efforts.',
    schedule: [
      { week: 'Week 1-2', title: 'Introduction to Water Conservation', description: 'Project kick-off and team formation' },
      { week: 'Week 3-4', title: 'Data Collection and Analysis', description: 'Student will conduct water audits and research' },
      { week: 'Week 5-6', title: 'Action Planning', description: 'Students will develop their action plans' },
      { week: 'Week 7-8', title: 'Implementation and Outreach', description: 'Launch conservation campaigns' },
    ],
    goals: [
      'Reduce water consumption in participating schools by 10%',
      'Increase student awareness of water conservation by 90%',
      'Engage at least 200 students in community outreach activities',
    ],
    resources: [
      { label: 'Project Guide', url: '#', type: 'pdf' },
      { label: 'Presentation Slides', url: '#', type: 'ppt' },
      { label: 'External Resources', url: '#', type: 'link' },
    ],
    discussion: [
      { user: 'Sarah Miller', message: 'Excited to start this project! Any tips for the intro collection phase?', time: '2 days ago', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' },
      { user: 'David Chen', message: 'I recommend having the students to collaborate the data collection methods. It increases their engagement and ownership of the project.', time: '1 day ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    ],
    schools: [
      { name: 'Greenwood High School', location: 'San Francisco, CA', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100' },
      { name: 'Riverside Middle School', location: 'Seattle, WA', logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100' },
      { name: 'Valley Creek Academy', location: 'Austin, TX', logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100' },
    ],
    leaders: [
      { name: 'Emily Carter', role: 'Project Lead Science Teacher', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
      { name: 'Mark Johnson', role: 'Environmental Science Teacher', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    ],
  },
];

const TABS = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'discussion', label: 'Discussion Forum', icon: MessageCircle },
  { id: 'activity', label: 'Activity & Updates', icon: Activity },
  { id: 'goals', label: 'Goals & Impact', icon: Target },
  { id: 'members', label: 'Manage Members', icon: Users },
];

// --- Components ---
function ProjectHeader({ title }: { title: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
        <span className="text-blue-600 font-medium">Projects</span>
        <span>/</span>
        <span>Project: {title}</span>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Projects</span>
        </button>
      </div>
    </div>
  );
}

function ProjectTabs({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
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

function OverviewSection({ project }: { project: Project }) {
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
        <GoalsSection goals={project.goals} />
      </div>
      <ResourcesSection resources={project.resources} />
    </div>
  );
}

function ScheduleSection({ schedule }: { schedule: Project['schedule'] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {schedule.map((item, i) => (
            <div key={i} className="relative pl-8">
              <div className="absolute left-0 top-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
                {i + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{item.week}: {item.title}</h4>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalsSection({ goals }: { goals: string[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Goals and Targets</h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {goals.map((goal, i) => (
            <div key={i} className="flex items-start gap-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 flex-shrink-0" disabled />
              <span className="text-sm text-gray-700 leading-relaxed">{goal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourcesSection({ resources }: { resources: Project['resources'] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
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
  const [newMessage, setNewMessage] = useState('');
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Discussion Forum</h2>
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
                  <span className="text-sm font-semibold text-gray-900">{msg.user}</span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{msg.message}</p>
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
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivitySection() {
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

function MembersSection() {
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

function ParticipatingSchools({ schools }: { schools: Project['schools'] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Participating Schools</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {schools.map((school, i) => (
            <div key={i} className="flex items-center gap-4">
              <img
                src={school.logo}
                alt={school.name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{school.name}</p>
                <p className="text-xs text-gray-500">{school.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectLeaders({ leaders }: { leaders: Project['leaders'] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Project Leaders</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {leaders.map((leader, i) => (
            <div key={i} className="flex items-center gap-4">
              <img
                src={leader.avatar}
                alt={leader.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{leader.name}</p>
                <p className="text-xs text-gray-500">{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function ProjectDetailsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProject(mockProjects[0]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="font-medium">Project not found.</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <OverviewSection project={project} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ParticipatingSchools schools={project.schools} />
              <ProjectLeaders leaders={project.leaders} />
            </div>
          </div>
        );
      case 'discussion':
        return <DiscussionSection discussion={project.discussion} />;
      case 'activity':
        return <ActivitySection />;
      case 'goals':
        return <GoalsSection goals={project.goals} />;
      case 'members':
        return <MembersSection />;
      default:
        return <OverviewSection project={project} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectHeader title={project.title} />
        <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  );
}