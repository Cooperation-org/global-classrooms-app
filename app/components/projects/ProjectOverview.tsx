import React from 'react';
import { Calendar, CheckCircle2, Users, Globe, FileText, User, Award } from 'lucide-react';
import { ProjectGoal } from '@/app/services/api';

interface Project {
  id: number;
  title: string;
  overview: string;
  start_date?: string;
  end_date?: string;
  status?: 'draft' | 'published' | 'completed';
  is_open_for_collaboration?: boolean;
  environmental_themes?: Record<string, string>;
  participating_schools_count?: number;
  contact_person_name?: string;
  contact_person_email?: string;
  contact_person_role?: string;
  lead_school_name?: string;
  contact_city?: string;
  contact_country?: string;
  recognition_type?: string;
  schedule?: { week: string; title: string; description: string }[];
  resources?: { label: string; url: string; type: string }[];
  discussion?: { user: string; message: string; time: string; avatar: string }[];
  schools?: { name: string; location: string; logo: string }[];
  leaders?: { name: string; role: string; avatar: string }[];
}

interface ProjectOverviewProps {
  project: Project;
  goals?: ProjectGoal[];
  projectId?: string;
}

export function ProjectOverview({ project, goals }: ProjectOverviewProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'completed':
        return 'Completed';
      case 'draft':
      default:
        return 'Draft';
    }
  };

  const environmentalThemes = project.environmental_themes 
    ? Object.values(project.environmental_themes).filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Row - Timeline, Status, Participation, Environmental Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Timeline Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Timeline</h3>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">Start: <span className="text-gray-900 font-medium">{formatDate(project.start_date)}</span></p>
            <p className="text-xs text-gray-600">End: <span className="text-gray-900 font-medium">{formatDate(project.end_date)}</span></p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Status</h3>
          </div>
          <div className="space-y-2">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {getStatusLabel(project.status)}
            </span>
            {project.is_open_for_collaboration && (
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                Open for collaboration
              </p>
            )}
          </div>
        </div>

        {/* Participation Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Participation</h3>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{project.participating_schools_count || 0}</p>
            <p className="text-xs text-gray-600">Schools participating</p>
          </div>
        </div>

        {/* Environmental Themes Card */}
        {environmentalThemes.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Environmental Themes</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {environmentalThemes.map((theme, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Second Row - About This Project, Goals and Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* About This Project Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">About This Project</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{project.overview || 'No description available.'}</p>
        </div>

        {/* Goals and Targets Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Goals and Targets</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {goals && goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal.id} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 flex-shrink-0"
                    checked={!!goal.is_completed}
                    disabled
                  />
                  <span className={`text-sm ${goal.is_completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {goal.title}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No goals have been added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Project Lead Card */}
      {(project.contact_person_name || project.lead_school_name) && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Project Lead</h3>
          </div>
          <div className="space-y-2">
            {project.contact_person_name && (
              <div>
                <p className="text-sm font-medium text-gray-900">{project.contact_person_name}</p>
                {project.contact_person_role && (
                  <p className="text-xs text-gray-600">{project.contact_person_role}</p>
                )}
              </div>
            )}
            {project.lead_school_name && (
              <div>
                <p className="text-xs text-gray-600">School: <span className="text-gray-900">{project.lead_school_name}</span></p>
              </div>
            )}
            {(project.contact_city || project.contact_country) && (
              <div>
                <p className="text-xs text-gray-600">
                  {[project.contact_city, project.contact_country].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
            {project.contact_person_email && (
              <div>
                <p className="text-xs text-gray-600">{project.contact_person_email}</p>
              </div>
            )}
            {project.recognition_type && (
              <div className="pt-2">
                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  {project.recognition_type}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collaboration Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
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
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
