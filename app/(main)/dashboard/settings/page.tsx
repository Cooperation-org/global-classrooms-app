'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSchools, useProjects, useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject, useTeacherProfiles, useCreateTeacher } from '@/app/hooks/useSWR';

const placeholderImg = 'https://placehold.co/120x120?text=School';

const TABS = ['Overview', 'Teachers', 'Students', 'Subjects', 'Impact'];

interface School {
  id: string;
  name: string;
  overview: string;
  city: string;
  country: string;
  logo?: string;
  institution_type: string;
  affiliation: string;
  registration_number: string;
  year_of_establishment: string;
  address_line_1: string;
  address_line_2?: string;
  state: string;
  postal_code: string;
  phone_number: string;
  email: string;
  website: string;
  principal_name: string;
  principal_email: string;
  principal_phone: string;
  number_of_teachers: number;
  number_of_students: number;
  medium_of_instruction: string;
}

interface Project {
  id: string;
  title: string;
  short_description: string;
  status: string;
  is_open_for_collaboration: boolean;
  total_impact?: {
    trees_planted?: number;
    students_engaged?: number;
    waste_recycled?: number;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [school, setSchool] = useState<School | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', description: '', is_active: true });
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editingSubject, setEditingSubject] = useState<{ id: number; name: string; description: string; is_active: boolean } | null>(null);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    user: '',
    school: '',
    teacher_role: 'class_teacher',
    assigned_subjects: [] as number[],
    assigned_classes: [] as number[],
    status: 'active'
  });
  const router = useRouter();

  // Use SWR hooks for data fetching
  const { schools, isLoading, error } = useSchools(1, 1); // Get first school
  const { projects: swrProjects, isLoading: projectsLoading } = useProjects(1, 100);
  const { subjects, isLoading: subjectsLoading, error: subjectsError } = useSubjects(school?.id);
  const { teachers, isLoading: teachersLoading, error: teachersError } = useTeacherProfiles(school?.id);
  const { createSubject } = useCreateSubject();
  const { updateSubject } = useUpdateSubject();
  const { deleteSubject } = useDeleteSubject();
  const { createTeacher } = useCreateTeacher();

  // Update local state when SWR data changes
  useEffect(() => {
    if (schools && schools.length > 0) {
      const schoolData = schools[0];
      setSchool(schoolData);
    }
  }, [schools]);

  useEffect(() => {
    if (swrProjects) {
      setProjects(swrProjects);
    }
  }, [swrProjects]);

  // Add new subject
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name.trim() || !school) return;

    try {
      if (isEditingSubject && editingSubject) {
        // Update existing subject
        await updateSubject(editingSubject.id, {
          name: newSubject.name,
          description: newSubject.description,
          is_active: newSubject.is_active,
        });
      } else {
        // Create new subject
        await createSubject({
          ...newSubject,
          school: school.id,
        });
      }
      
      setNewSubject({ name: '', description: '', is_active: true });
      setIsAddingSubject(false);
      setIsEditingSubject(false);
      setEditingSubject(null);
    } catch (error) {
      console.error('Failed to add/update subject:', error);
      alert('Failed to save subject. Please try again.');
    }
  };

  // Add new teacher
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newTeacher.user.trim() || !newTeacher.teacher_role) {
      alert('Please fill in all required fields');
      return;
    }

    if (!school) {
      alert('No school selected');
      return;
    }

    try {
      await createTeacher({
        user: newTeacher.user,
        school: school.id,
        teacher_role: newTeacher.teacher_role,
        assigned_subjects: newTeacher.assigned_subjects,
        assigned_classes: newTeacher.assigned_classes,
        status: newTeacher.status
      });
      
      // Reset form
      setNewTeacher({
        user: '',
        school: '',
        teacher_role: 'class_teacher',
        assigned_subjects: [],
        assigned_classes: [],
        status: 'active'
      });
      setIsAddingTeacher(false);
    } catch (error) {
      console.error('Failed to add teacher:', error);
      alert('Failed to add teacher. Please try again.');
    }
  };

  // Calculate cumulative impact
  const calculateCumulativeImpact = () => {
    return projects.reduce((total, project) => {
      return {
        trees_planted: total.trees_planted + (project.total_impact?.trees_planted || 0),
        students_engaged: total.students_engaged + (project.total_impact?.students_engaged || 0),
        waste_recycled: total.waste_recycled + (project.total_impact?.waste_recycled || 0),
      };
    }, { trees_planted: 0, students_engaged: 0, waste_recycled: 0 });
  };

  // Handle authentication errors
  if (error && (error as { status?: number })?.status === 401) {
    // Don't redirect immediately, let the SWR fetcher handle it
    console.log('Authentication error detected in settings page');
    return (
      <div className="w-full max-w-5xl py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-red-600 mb-4">Please log in to access this page.</p>
          <button 
            onClick={() => window.location.href = '/signin'}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (subjectsError && (subjectsError as { status?: number })?.status === 401) {
    // Don't redirect immediately, let the SWR fetcher handle it
    console.log('Subjects authentication error detected');
    return (
      <div className="w-full max-w-5xl py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-red-600 mb-4">Please log in to access this page.</p>
          <button 
            onClick={() => window.location.href = '/signin'}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (teachersError && (teachersError as { status?: number })?.status === 401) {
    // Don't redirect immediately, let the SWR fetcher handle it
    console.log('Teachers authentication error detected');
    return (
      <div className="w-full max-w-5xl py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-red-600 mb-4">Please log in to access this page.</p>
          <button 
            onClick={() => window.location.href = '/signin'}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading school data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="w-full max-w-5xl py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading School Data</h1>
          <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'No school data available'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl py-8 px-4">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        <span className="text-green-700 font-semibold">Settings</span> / <span>Overview</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-8">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`pb-2 px-2 text-lg font-medium transition border-b-2 ${activeTab === tab ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-green-700'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* School Card */}
      <div className="flex items-center gap-4 mb-6">
        <img src={school.logo || placeholderImg} alt={school.name} className="w-24 h-24 rounded-lg object-cover border" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{school.name}</h2>
          <p className="text-green-700 text-sm">{school.overview}</p>
          <p className="text-green-500 text-xs">Located in {school.city}, {school.country}</p>
        </div>
        <button className="bg-black text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-900 transition">
          EDIT <span className="text-lg">→</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div>
          {/* Overview Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Overview</h3>
            <p className="text-gray-700 max-w-3xl">
              {school.overview}
            </p>
          </div>

          {/* School Information */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
              <div>
                <div className="text-gray-500">School Name</div>
                <div className="font-medium">{school.name}</div>
              </div>
              <div>
                <div className="text-gray-500">Institution Type</div>
                <div className="font-medium">{school.institution_type.replace('_', ' ').toUpperCase()}</div>
              </div>
              <div>
                <div className="text-gray-500">Affiliation / Board</div>
                <div className="font-medium">{school.affiliation.replace('_', ' ').toUpperCase()}</div>
              </div>
              <div>
                <div className="text-gray-500">Registration Number</div>
                <div className="font-medium">{school.registration_number}</div>
              </div>
              <div>
                <div className="text-gray-500">Year of Establishment</div>
                <div className="font-medium text-green-700">{school.year_of_establishment}</div>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Location & Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
              <div>
                <div className="text-gray-500">Address Line 1 & 2</div>
                <div className="font-medium">{school.address_line_1}</div>
                {school.address_line_2 && (
                  <div className="font-medium">{school.address_line_2}</div>
                )}
              </div>
              <div>
                <div className="text-gray-500">City</div>
                <div className="font-medium">{school.city}</div>
              </div>
              <div>
                <div className="text-gray-500">State</div>
                <div className="font-medium">{school.state}</div>
              </div>
              <div>
                <div className="text-gray-500">Postal Code</div>
                <div className="font-medium text-green-700">{school.postal_code}</div>
              </div>
              <div>
                <div className="text-gray-500">Country</div>
                <div className="font-medium">{school.country}</div>
              </div>
              <div>
                <div className="text-gray-500">School Phone Number</div>
                <div className="font-medium">{school.phone_number}</div>
              </div>
              <div>
                <div className="text-gray-500">School Email</div>
                <div className="font-medium">{school.email}</div>
              </div>
              <div>
                <div className="text-gray-500">Website</div>
                <div className="font-medium text-green-700">{school.website}</div>
              </div>
            </div>
          </div>

          {/* Principal / Head Details */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Principal / Head Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
              <div>
                <div className="text-gray-500">Full Name</div>
                <div className="font-medium">{school.principal_name}</div>
              </div>
              <div>
                <div className="text-gray-500">Email</div>
                <div className="font-medium">{school.principal_email}</div>
              </div>
              <div>
                <div className="text-gray-500">Phone Number</div>
                <div className="font-medium">{school.principal_phone}</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
              <div>
                <div className="text-gray-500">Number of Teachers</div>
                <div className="font-medium">{school.number_of_teachers}</div>
              </div>
              <div>
                <div className="text-gray-500">Number of Students</div>
                <div className="font-medium">{school.number_of_students}</div>
              </div>
              <div>
                <div className="text-gray-500">Medium of Instruction</div>
                <div className="font-medium text-green-700">{school.medium_of_instruction.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'Teachers' && (
        <div>
          {/* Header and Add Teacher Button */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Manage Teachers</h3>
            <button
              className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
              onClick={() => setIsAddingTeacher(true)}
            >
              + Add Teacher
            </button>
          </div>

          {isAddingTeacher ? (
            <>
              {/* Blurred Overlay */}
              <div className="fixed inset-0 bg-transparent backdrop-blur-sm z-40" onClick={() => setIsAddingTeacher(false)} />
              
              {/* Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Add New Teacher</h3>
                      <p className="text-sm text-gray-500">Register a new teacher to your school</p>
                    </div>
                    <button
                      onClick={() => setIsAddingTeacher(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Modal Body */}
                  <form onSubmit={handleAddTeacher} className="p-6 space-y-4">
                    <div>
                      <label htmlFor="newTeacherUser" className="block text-sm font-medium text-gray-700 mb-1">
                        Teacher Name *
                      </label>
                      <input
                        type="text"
                        id="newTeacherUser"
                        value={newTeacher.user}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, user: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter teacher name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="newTeacherRole" className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <select
                        id="newTeacherRole"
                        value={newTeacher.teacher_role}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, teacher_role: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select role</option>
                        <option value="class_teacher">Class Teacher</option>
                        <option value="subject_teacher">Subject Teacher</option>
                        <option value="principal">Principal</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="newTeacherAssignedSubjects" className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Subjects
                      </label>
                      <select
                        id="newTeacherAssignedSubjects"
                        multiple
                        value={newTeacher.assigned_subjects.map(String)}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, assigned_subjects: Array.from(e.target.selectedOptions, option => parseInt(option.value)) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                      >
                        {subjects.map((subject: { id: number; name: string; description: string; is_active: boolean }) => (
                          <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </div>

                    <div>
                      <label htmlFor="newTeacherAssignedClasses" className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Classes
                      </label>
                      <select
                        id="newTeacherAssignedClasses"
                        multiple
                        value={newTeacher.assigned_classes.map(String)}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, assigned_classes: Array.from(e.target.selectedOptions, option => parseInt(option.value)) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                      >
                        <option value="1">Class 1</option>
                        <option value="2">Class 2</option>
                        <option value="3">Class 3</option>
                        <option value="4">Class 4</option>
                        <option value="5">Class 5</option>
                        <option value="6">Class 6</option>
                        <option value="7">Class 7</option>
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newTeacherStatus"
                        checked={newTeacher.status === 'active'}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, status: e.target.checked ? 'active' : 'inactive' }))}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="newTeacherStatus" className="text-sm text-gray-700">Active Status</label>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsAddingTeacher(false)}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Add Teacher
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <>
              {teachersLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading teachers...</p>
                  </div>
                </div>
              ) : teachers.length === 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No teachers found for this school.</p>
                    <button
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                      onClick={() => setIsAddingTeacher(true)}
                    >
                      Add First Teacher
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teachers.map((teacher: { id: string; user: { name: string }; teacher_role: string; status: string }) => (
                        <tr key={teacher.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {teacher.user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {teacher.teacher_role.replace('_', ' ').toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {teacher.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                // Implement edit functionality
                                console.log('Edit teacher:', teacher);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                // Implement delete functionality
                                console.log('Delete teacher:', teacher);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {activeTab === 'Students' && (
        <div>
          {/* Header and Add Student Button */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Manage Students</h3>
            <button
              className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
              onClick={() => router.push('/dashboard/settings/students-new')}
            >
              + Add Student
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by name, email, or student ID"
              className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="mb-4 flex gap-3">
            <select className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700">
              <option>Class</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700">
              <option>Status</option>
            </select>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No students found for this school.</p>
              <button
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                onClick={() => router.push('/dashboard/settings/students-new')}
              >
                Add First Student
              </button>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'Subjects' && (
        <div>
          <h3 className="text-2xl font-bold mb-2">Manage School Subjects</h3>
          {school ? (
            <>
              <p className="text-gray-600 mb-4">Managing subjects for: <span className="font-semibold text-green-700">{school.name}</span></p>
              <div className="flex justify-end mb-4">
                <button
                  className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
                  onClick={() => {
                    setEditingSubject(null);
                    setIsAddingSubject(true);
                  }}
                >
                  + Add New Subject
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No school selected. Please select a school first.</p>
            </div>
          )}

          {school && (
            <>
              {isAddingSubject || isEditingSubject ? (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {isAddingSubject ? 'Add New Subject' : 'Edit Subject'}
                  </h4>
                  <form onSubmit={handleAddSubject} className="space-y-4">
                    <div>
                      <label htmlFor="newSubjectName" className="block text-sm font-medium text-gray-700">Subject Name</label>
                      <input
                        type="text"
                        id="newSubjectName"
                        value={newSubject.name}
                        onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="newSubjectDescription" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                      <textarea
                        id="newSubjectDescription"
                        value={newSubject.description}
                        onChange={(e) => setNewSubject(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newSubjectActive"
                        checked={newSubject.is_active}
                        onChange={(e) => setNewSubject(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="newSubjectActive" className="text-sm text-gray-700">Is Active</label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {isAddingSubject ? 'Add Subject' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingSubject(false);
                          setIsEditingSubject(false);
                          setEditingSubject(null);
                          setNewSubject({ name: '', description: '', is_active: true });
                        }}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : subjectsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading subjects...</p>
                  </div>
                </div>
              ) : subjects.length === 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No subjects found for this school.</p>
                    <button
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                      onClick={() => {
                        setEditingSubject(null);
                        setIsAddingSubject(true);
                      }}
                    >
                      Add First Subject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subjects.map((subject: { id: number; name: string; description: string; is_active: boolean }) => (
                        <tr key={subject.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {subject.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {subject.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subject.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {subject.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setEditingSubject(subject);
                                setNewSubject({
                                  name: subject.name,
                                  description: subject.description,
                                  is_active: subject.is_active,
                                });
                                setIsEditingSubject(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this subject?')) {
                                  deleteSubject(subject.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {activeTab === 'Impact' && (
        <div>
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold">School Impact Overview</h3>
            <p className="text-gray-600">Cumulative environmental impact from all school projects</p>
          </div>

          {projectsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading impact data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Impact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 5a2 2 0 012-2h8a2 2 0 012 2v2H7V5z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Trees Planted</h4>
                  <p className="text-3xl font-bold text-green-600">{calculateCumulativeImpact().trees_planted.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">Total trees planted across all projects</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Students Engaged</h4>
                  <p className="text-3xl font-bold text-blue-600">{calculateCumulativeImpact().students_engaged.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">Total students involved in projects</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Waste Recycled</h4>
                  <p className="text-3xl font-bold text-purple-600">{calculateCumulativeImpact().waste_recycled.toLocaleString()} kg</p>
                  <p className="text-sm text-gray-500 mt-2">Total waste recycled in projects</p>
                </div>
              </div>

              {/* Project Statistics */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                    <p className="text-sm text-gray-500">Total Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'completed').length}</p>
                    <p className="text-sm text-gray-500">Completed Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.is_open_for_collaboration).length}</p>
                    <p className="text-sm text-gray-500">Open for Collaboration</p>
                  </div>
                </div>
              </div>

              {/* Recent Projects */}
              {projects.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h4>
                  <div className="space-y-4">
                    {projects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{project.title}</h5>
                          <p className="text-sm text-gray-500">{project.short_description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {project.total_impact?.trees_planted || 0} trees
                          </p>
                          <p className="text-xs text-gray-500">
                            {project.total_impact?.students_engaged || 0} students
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 