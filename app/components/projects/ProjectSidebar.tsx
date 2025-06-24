import React from 'react';

interface School {
  name: string;
  location: string;
  logo: string;
}

interface Leader {
  name: string;
  role: string;
  avatar: string;
}

interface ParticipatingSchoolsProps {
  schools: School[];
}

interface ProjectLeadersProps {
  leaders: Leader[];
}

export function ParticipatingSchools({ schools }: ParticipatingSchoolsProps) {
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

export function ProjectLeaders({ leaders }: ProjectLeadersProps) {
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