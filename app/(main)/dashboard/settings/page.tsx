'use client'
import React, { useState, useEffect } from 'react';
import { useSchools, useProjects, useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject, useTeacherProfiles, useCreateTeacher, useUpdateTeacher, useDeleteTeacher, useStudentProfiles, useCreateStudent, useUpdateStudent, useDeleteStudent } from '@/app/hooks/useSWR';

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
  const [editingTeacher, setEditingTeacher] = useState<{ id: string; user: string; teacher_role: string; assigned_subjects: number[]; assigned_classes: number[]; status: string } | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    user: '',
    school: '',
    student_id: '',
    current_class: 0,
    parent_name: '',
    parent_email: '',
    parent_phone: ''
  });
  const [editingStudent, setEditingStudent] = useState<{ id: string; user: string; school: string; student_id: string; current_class: number; parent_name: string; parent_email: string; parent_phone: string } | null>(null);

  // Use SWR hooks for data fetching
  const { schools, isLoading, error } = useSchools(1, 1); // Get first school
  const { projects: swrProjects, isLoading: projectsLoading } = useProjects(1, 100);
  const { subjects, error: subjectsError } = useSubjects(school?.id);
  const { teachers, isLoading: teachersLoading } = useTeacherProfiles();
  const { createSubject } = useCreateSubject();
  const { updateSubject } = useUpdateSubject();
  const { deleteSubject } = useDeleteSubject();
  const { createTeacher } = useCreateTeacher();
  const { updateTeacher } = useUpdateTeacher();
  const { deleteTeacher } = useDeleteTeacher();
  const { students, isLoading: studentsLoading } = useStudentProfiles();
  const { createStudent } = useCreateStudent();
  const { updateStudent } = useUpdateStudent();
  const { deleteStudent } = useDeleteStudent();
  
  // Mock users data - in real app, you'd fetch this from your API
  const availableUsers = [
    { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", name: "John Doe", email: "john@example.com" },
    { id: "4fa85f64-5717-4562-b3fc-2c963f66afa7", name: "Jane Smith", email: "jane@example.com" },
    { id: "5fa85f64-5717-4562-b3fc-2c963f66afa8", name: "Bob Johnson", email: "bob@example.com" },
  ];

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
    if (!newTeacher.user || !newTeacher.teacher_role) {
      alert('Please fill in all required fields');
      return;
    }

    if (!school) {
      alert('No school selected');
      return;
    }

    try {
      if (editingTeacher) {
        // Update existing teacher
        await updateTeacher(editingTeacher.id, {
          user: newTeacher.user,
          school: school.id,
          teacher_role: newTeacher.teacher_role,
          assigned_subjects: newTeacher.assigned_subjects,
          assigned_classes: newTeacher.assigned_classes,
          status: newTeacher.status
        });
      } else {
        // Create new teacher
        await createTeacher({
          user: newTeacher.user,
          school: school.id,
          teacher_role: newTeacher.teacher_role,
          assigned_subjects: newTeacher.assigned_subjects,
          assigned_classes: newTeacher.assigned_classes,
          status: newTeacher.status
        });
      }
      
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
      setEditingTeacher(null);
    } catch (error) {
      console.error('Failed to add/update teacher:', error);
      alert('Failed to save teacher. Please try again.');
    }
  };

  // Handle teacher deletion
  const handleDeleteTeacher = async (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteTeacher(teacherId);
      } catch (error) {
        console.error('Failed to delete teacher:', error);
        alert('Failed to delete teacher. Please try again.');
      }
    }
  };

  // Handle teacher edit
  const handleEditTeacher = (teacher: { id: string; user: { id: string; name: string } | string; teacher_role: string; assigned_subjects?: number[]; assigned_classes?: number[]; status: string }) => {
    setEditingTeacher({
      id: teacher.id,
      user: typeof teacher.user === 'string' ? teacher.user : teacher.user.id,
      teacher_role: teacher.teacher_role,
      assigned_subjects: teacher.assigned_subjects || [],
      assigned_classes: teacher.assigned_classes || [],
      status: teacher.status
    });
    setNewTeacher({
      user: typeof teacher.user === 'string' ? teacher.user : teacher.user.id,
      school: school?.id || '',
      teacher_role: teacher.teacher_role,
      assigned_subjects: teacher.assigned_subjects || [],
      assigned_classes: teacher.assigned_classes || [],
      status: teacher.status
    });
    setIsAddingTeacher(true);
  };

  // Add new student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newStudent.user || !newStudent.student_id) {
      alert('Please fill in all required fields');
      return;
    }

    if (!school) {
      alert('No school selected');
      return;
    }

    try {
      if (editingStudent) {
        // Update existing student
        await updateStudent(editingStudent.id, {
          user: newStudent.user,
          school: school.id,
          student_id: newStudent.student_id,
          current_class: newStudent.current_class,
          parent_name: newStudent.parent_name,
          parent_email: newStudent.parent_email,
          parent_phone: newStudent.parent_phone
        });
      } else {
        // Create new student
        await createStudent({
          user: newStudent.user,
          school: school.id,
          student_id: newStudent.student_id,
          current_class: newStudent.current_class,
          parent_name: newStudent.parent_name,
          parent_email: newStudent.parent_email,
          parent_phone: newStudent.parent_phone
        });
      }
      
      // Reset form
      setNewStudent({
        user: '',
        school: '',
        student_id: '',
        current_class: 0,
        parent_name: '',
        parent_email: '',
        parent_phone: ''
      });
      setIsAddingStudent(false);
      setEditingStudent(null);
    } catch (error) {
      console.error('Failed to add/update student:', error);
      alert('Failed to save student. Please try again.');
    }
  };

  // Handle student deletion
  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId);
      } catch (error) {
        console.error('Failed to delete student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  // Handle student edit
  const handleEditStudent = (student: { id: string; user: { id: string; name: string } | string; school: string; student_id: string; current_class: number; parent_name: string; parent_email: string; parent_phone: string }) => {
    setEditingStudent({
      id: student.id,
      user: typeof student.user === 'string' ? student.user : student.user.id,
      school: student.school,
      student_id: student.student_id,
      current_class: student.current_class,
      parent_name: student.parent_name,
      parent_email: student.parent_email,
      parent_phone: student.parent_phone
    });
    setNewStudent({
      user: typeof student.user === 'string' ? student.user : student.user.id,
      school: student.school,
      student_id: student.student_id,
      current_class: student.current_class,
      parent_name: student.parent_name,
      parent_email: student.parent_email,
      parent_phone: student.parent_phone
    });
    setIsAddingStudent(true);
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

      {/* School Card */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <img src={school.logo || placeholderImg} alt={school.name} className="w-24 h-24 rounded-lg object-cover border" />
        <div className="flex-1 w-full">
          <h2 className="text-xl md:text-2xl font-bold">{school.name}</h2>
          <p className="text-green-700 text-sm">{school.overview}</p>
          <p className="text-green-500 text-xs">Located in {school.city}, {school.country}</p>
        </div>
        <button className="bg-black text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-900 transition w-full md:w-auto">
          EDIT <span className="text-lg">→</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-200 mb-6 gap-2 md:gap-8">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`pb-2 px-2 text-base md:text-lg font-medium transition border-b-2 ${activeTab === tab ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-green-700'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
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
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-full md:max-w-md mx-auto">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {editingTeacher ? 'Update teacher information' : 'Register a new teacher to your school'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingTeacher(false);
                        setEditingTeacher(null);
                        setNewTeacher({
                          user: '',
                          school: '',
                          teacher_role: 'class_teacher',
                          assigned_subjects: [],
                          assigned_classes: [],
                          status: 'active'
                        });
                      }}
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
                      <select
                        id="newTeacherUser"
                        value={newTeacher.user}
                        onChange={(e) => setNewTeacher(prev => ({ ...prev, user: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select teacher</option>
                        {availableUsers.map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </select>
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
                      <div className="relative">
                        <select
                          id="newTeacherAssignedSubjects"
                          onChange={(e) => {
                            const subjectId = parseInt(e.target.value);
                            if (subjectId && !newTeacher.assigned_subjects.includes(subjectId)) {
                              setNewTeacher(prev => ({ 
                                ...prev, 
                                assigned_subjects: [...prev.assigned_subjects, subjectId] 
                              }));
                            }
                            e.target.value = '';
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select subjects to assign</option>
                          {subjects.map((subject: { id: number; name: string; description: string; is_active: boolean }) => (
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Selected Subjects Display */}
                      {newTeacher.assigned_subjects.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {newTeacher.assigned_subjects.map(subjectId => {
                            const subject = subjects.find((s: { id: number; name: string }) => s.id === subjectId);
                            return subject ? (
                              <span
                                key={subjectId}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {subject.name}
                                <button
                                  type="button"
                                  onClick={() => setNewTeacher(prev => ({
                                    ...prev,
                                    assigned_subjects: prev.assigned_subjects.filter(id => id !== subjectId)
                                  }))}
                                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                                >
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="newTeacherAssignedClasses" className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Classes
                      </label>
                      <div className="relative">
                        <select
                          id="newTeacherAssignedClasses"
                          onChange={(e) => {
                            const classId = parseInt(e.target.value);
                            if (classId && !newTeacher.assigned_classes.includes(classId)) {
                              setNewTeacher(prev => ({ 
                                ...prev, 
                                assigned_classes: [...prev.assigned_classes, classId] 
                              }));
                            }
                            e.target.value = '';
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select classes to assign</option>
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
                      </div>
                      
                      {/* Selected Classes Display */}
                      {newTeacher.assigned_classes.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {newTeacher.assigned_classes.map(classId => (
                            <span
                              key={classId}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              Class {classId}
                              <button
                                type="button"
                                onClick={() => setNewTeacher(prev => ({
                                  ...prev,
                                  assigned_classes: prev.assigned_classes.filter(id => id !== classId)
                                }))}
                                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
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
                        onClick={() => {
                          setIsAddingTeacher(false);
                          setEditingTeacher(null);
                          setNewTeacher({
                            user: '',
                            school: '',
                            teacher_role: 'class_teacher',
                            assigned_subjects: [],
                            assigned_classes: [],
                            status: 'active'
                          });
                        }}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
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
                      {teachers.map((teacher: { id: string; user: { id: string; name: string }; teacher_role: string; status: string }) => (
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
                              onClick={() => handleEditTeacher(teacher)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTeacher(teacher.id)}
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
              onClick={() => setIsAddingStudent(true)}
            >
              + Add Student
            </button>
          </div>

          {isAddingStudent ? (
            <>
              {/* Blurred Overlay */}
              <div className="fixed inset-0 bg-transparent backdrop-blur-sm z-40" onClick={() => setIsAddingStudent(false)} />
              
              {/* Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-full md:max-w-md mx-auto">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {editingStudent ? 'Edit Student' : 'Add New Student'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {editingStudent ? 'Update student information' : 'Register a new student to your school'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingStudent(false);
                        setEditingStudent(null);
                        setNewStudent({
                          user: '',
                          school: '',
                          student_id: '',
                          current_class: 0,
                          parent_name: '',
                          parent_email: '',
                          parent_phone: ''
                        });
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Modal Body */}
                  <form onSubmit={handleAddStudent} className="p-6 space-y-4">
                    <div>
                      <label htmlFor="newStudentUser" className="block text-sm font-medium text-gray-700 mb-1">
                        Student Name *
                      </label>
                      <select
                        id="newStudentUser"
                        value={newStudent.user}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, user: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select student</option>
                        {availableUsers.map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="newStudentStudentId" className="block text-sm font-medium text-gray-700 mb-1">
                        Student ID *
                      </label>
                      <input
                        type="text"
                        id="newStudentStudentId"
                        value={newStudent.student_id}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, student_id: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="newStudentCurrentClass" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Class *
                      </label>
                      <select
                        id="newStudentCurrentClass"
                        value={newStudent.current_class}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, current_class: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select class</option>
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
                    </div>

                    <div>
                      <label htmlFor="newStudentParentName" className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Name *
                      </label>
                      <input
                        type="text"
                        id="newStudentParentName"
                        value={newStudent.parent_name}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, parent_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="newStudentParentEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Email *
                      </label>
                      <input
                        type="email"
                        id="newStudentParentEmail"
                        value={newStudent.parent_email}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, parent_email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="newStudentParentPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Phone *
                      </label>
                      <input
                        type="tel"
                        id="newStudentParentPhone"
                        value={newStudent.parent_phone}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, parent_phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingStudent(false);
                          setEditingStudent(null);
                          setNewStudent({
                            user: '',
                            school: '',
                            student_id: '',
                            current_class: 0,
                            parent_name: '',
                            parent_email: '',
                            parent_phone: ''
                          });
                        }}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        {editingStudent ? 'Update Student' : 'Add Student'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <>
              {studentsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading students...</p>
                  </div>
                </div>
              ) : students.length === 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No students found for this school.</p>
                    <button
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                      onClick={() => setIsAddingStudent(true)}
                    >
                      Add First Student
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
                          Student ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Parent Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Parent Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Parent Phone
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student: { id: string; user: { id: string; name: string }; school: string; student_id: string; current_class: number; parent_name: string; parent_email: string; parent_phone: string }) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.student_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              Class {student.current_class}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.parent_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.parent_email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.parent_phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
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