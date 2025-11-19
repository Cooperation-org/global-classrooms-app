import React, { useState, useEffect } from 'react';
import { 
  fetchProjectParticipants, 
  getDistinctClassesFromParticipants,
  ProjectClassInfo
} from '@/app/services/api';
import { Users, GraduationCap } from 'lucide-react';

interface ParticipatingClassesProps {
  projectId: string;
}

export function ParticipatingClasses({ projectId }: ParticipatingClassesProps) {
  const [classes, setClasses] = useState<ProjectClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        const response = await fetchProjectParticipants(projectId, 1, 1000);
        const distinctClasses = getDistinctClassesFromParticipants(response.results);
        setClasses(distinctClasses);
        setTotalStudents(response.results.length);
      } catch (error) {
        console.error('Error loading participating classes:', error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadClasses();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Participating Classes</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1A7F4F]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Participating Classes</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No classes have joined this project yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Participating Classes</h2>
          <div className="text-sm text-gray-500">
            {classes.length} {classes.length === 1 ? 'class' : 'classes'} • {totalStudents} {totalStudents === 1 ? 'student' : 'students'}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classInfo) => (
            <div
              key={classInfo.class_id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#1A7F4F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-[#1A7F4F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {classInfo.class_name || classInfo.class_id}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {classInfo.class_id}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {classInfo.participant_count} {classInfo.participant_count === 1 ? 'student' : 'students'}
                </span>
              </div>

              {classInfo.participants.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Students:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {classInfo.participants.slice(0, 3).map((participant) => (
                      <span
                        key={participant.id}
                        className="text-xs px-2 py-1 bg-white rounded border border-gray-200 text-gray-600 truncate max-w-[120px]"
                        title={participant.student_name || participant.student_email}
                      >
                        {participant.student_name || participant.student_email}
                      </span>
                    ))}
                    {classInfo.participants.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-white rounded border border-gray-200 text-gray-600">
                        +{classInfo.participants.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

