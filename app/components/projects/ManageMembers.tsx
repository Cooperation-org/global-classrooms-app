import React, { useState, useEffect } from 'react';
import { 
  fetchProjectParticipants, 
  addClassToProject,
  getDistinctClassesFromParticipants,
  ProjectParticipant,
  ProjectClassInfo
} from '@/app/services/api';
import { useCurrentTeacherProfile } from '@/app/hooks/useSWR';

const TABS = [
  { id: 'students', label: 'Students' },
  { id: 'classes', label: 'Classes' },
];

interface ManageMembersProps {
  projectId: string;
}

export function ManageMembers({ projectId }: ManageMembersProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'classes'>('students');
  const [search, setSearch] = useState('');
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [participants, setParticipants] = useState<ProjectParticipant[]>([]);
  const [classes, setClasses] = useState<ProjectClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { teacherProfile } = useCurrentTeacherProfile();

  // Fetch participants
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchProjectParticipants(projectId, 1, 1000);
        setParticipants(response.results);
        
        // Calculate distinct classes
        const distinctClasses = getDistinctClassesFromParticipants(response.results);
        setClasses(distinctClasses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load participants');
        console.error('Error loading participants:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadParticipants();
    }
  }, [projectId]);

  const handleAddClass = async (classId: string) => {
    if (!classId) return;

    try {
      setError(null);
      const response = await addClassToProject(projectId, classId);
      
      // Reload participants after adding class
      const updatedResponse = await fetchProjectParticipants(projectId, 1, 1000);
      setParticipants(updatedResponse.results);
      const distinctClasses = getDistinctClassesFromParticipants(updatedResponse.results);
      setClasses(distinctClasses);
      
      setShowAddClassModal(false);
      
      // Show success message
      alert(`Successfully added class!\n${response.added_count} students added\n${response.already_participating_count} were already participating`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add class to project');
      console.error('Error adding class:', err);
    }
  };

  // Filter participants by search
  const filteredParticipants = participants.filter(p => {
    const searchLower = search.toLowerCase();
    return (
      p.student_name?.toLowerCase().includes(searchLower) ||
      p.student_email?.toLowerCase().includes(searchLower) ||
      p.student_class?.toLowerCase().includes(searchLower) ||
      p.school_name?.toLowerCase().includes(searchLower)
    );
  });

  // Filter classes by search
  const filteredClasses = classes.filter(c => {
    const searchLower = search.toLowerCase();
    return (
      c.class_id?.toLowerCase().includes(searchLower) ||
      c.class_name?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A7F4F]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-6 border-b border-[#E5E7EB] mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-[#1A7F4F] text-[#1A7F4F]' 
                : 'border-transparent text-[#6B7280]'
            }`}
            onClick={() => setActiveTab(tab.id as 'students' | 'classes')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
            <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
              <circle cx="9" cy="9" r="7" stroke="#9CA3AF" strokeWidth="2"/>
              <path d="M15 15L18 18" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder={`Search ${activeTab === 'students' ? 'students' : 'classes'}...`}
            className="w-full border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2 text-sm placeholder-[#9CA3AF] focus:outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {activeTab === 'classes' && (
          <button
            className="px-4 py-2 bg-black text-white rounded font-medium text-sm hover:bg-[#222B45] transition"
            onClick={() => setShowAddClassModal(true)}
          >
            + Add Class
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        {activeTab === 'students' ? (
          // Students Tab
          participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-[#6B7280]">
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48" className="mb-4">
                <circle cx="24" cy="24" r="24" fill="#F6F8FA"/>
                <path d="M32 30c0-2.21-3.58-4-8-4s-8 1.79-8 4" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="24" cy="20" r="4" stroke="#D1D5DB" strokeWidth="2"/>
                <circle cx="16" cy="18" r="2" fill="#D1D5DB"/>
                <circle cx="32" cy="18" r="2" fill="#D1D5DB"/>
              </svg>
              <div className="font-semibold text-base mb-1">No students added yet</div>
              <div className="text-sm text-[#9CA3AF]">Add a class to add students to this project</div>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#F6F8FA] text-[#6B7280]">
                  <th className="py-2 px-4 text-left font-medium">Student Name</th>
                  <th className="py-2 px-4 text-left font-medium">Email</th>
                  <th className="py-2 px-4 text-left font-medium">Class</th>
                  <th className="py-2 px-4 text-left font-medium">School</th>
                  <th className="py-2 px-4 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map(participant => (
                  <tr key={participant.id} className="border-b last:border-0">
                    <td className="py-2 px-4">{participant.student_name || 'N/A'}</td>
                    <td className="py-2 px-4 text-[#6B7280]">{participant.student_email || 'N/A'}</td>
                    <td className="py-2 px-4">
                      <span className="px-2 py-1 rounded bg-[#E6F4EA] text-[#1A7F4F] text-xs font-medium">
                        {participant.student_class || 'N/A'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-[#6B7280]">{participant.school_name || 'N/A'}</td>
                    <td className="py-2 px-4">
                      <span className="px-3 py-1 rounded-full bg-[#F3FDF6] text-[#1A7F4F] text-xs font-semibold">
                        {participant.status === 'active' ? 'Active' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredParticipants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#6B7280]">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )
        ) : (
          // Classes Tab
          classes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-[#6B7280]">
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48" className="mb-4">
                <circle cx="24" cy="24" r="24" fill="#F6F8FA"/>
                <rect x="14" y="16" width="20" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2"/>
                <path d="M18 20h12M18 24h12M18 28h8" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div className="font-semibold text-base mb-1">No classes added yet</div>
              <div className="text-sm text-[#9CA3AF]">Add a class to add all its students to this project</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClasses.map(classInfo => (
                <div
                  key={classInfo.class_id}
                  className="border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-[#222B45]">
                        {classInfo.class_name || classInfo.class_id}
                      </h3>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Class ID: {classInfo.class_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#1A7F4F]">
                        {classInfo.participant_count}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        {classInfo.participant_count === 1 ? 'student' : 'students'}
                      </div>
                    </div>
                  </div>
                  {classInfo.participants.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                      <p className="text-xs text-[#6B7280] mb-2">Students in this class:</p>
                      <div className="flex flex-wrap gap-2">
                        {classInfo.participants.slice(0, 5).map(p => (
                          <span
                            key={p.id}
                            className="text-xs px-2 py-1 bg-gray-100 rounded text-[#6B7280]"
                          >
                            {p.student_name || p.student_email}
                          </span>
                        ))}
                        {classInfo.participants.length > 5 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded text-[#6B7280]">
                            +{classInfo.participants.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filteredClasses.length === 0 && (
                <div className="text-center py-8 text-[#6B7280]">No classes found.</div>
              )}
            </div>
          )
        )}
      </div>

      {showAddClassModal && (
        <AddClassModal
          onClose={() => setShowAddClassModal(false)}
          onAdd={handleAddClass}
          teacherProfile={teacherProfile}
        />
      )}
    </div>
  );
}

interface AddClassModalProps {
  onClose: () => void;
  onAdd: (classId: string) => void;
  teacherProfile?: {
    teacher_role?: 'class_teacher' | 'subject_teacher' | 'admin';
    school?: string;
    school_name?: string;
  };
}

function AddClassModal({ onClose, onAdd, teacherProfile }: AddClassModalProps) {
  const [classId, setClassId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(classId.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-[#222B45]">Add Class to Project</h3>
          <button 
            onClick={onClose} 
            className="text-[#6B7280] text-xl font-bold hover:text-[#222B45] transition"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[#222B45] font-medium mb-2">
              Class Identifier
            </label>
            <input
              type="text"
              placeholder="e.g., GRADE_1, GRADE_2, etc."
              className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#222B45] focus:outline-none focus:ring-2 focus:ring-[#1A7F4F]"
              value={classId}
              onChange={e => setClassId(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-[#6B7280] mt-2">
              Enter the class identifier (e.g., "GRADE_1"). All students from this class will be added to the project.
            </p>
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              className="px-6 py-2 bg-[#E5E7EB] text-[#222B45] rounded-full font-medium text-sm hover:bg-[#D1D5DB] transition disabled:opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-[#222B45] transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!classId.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
