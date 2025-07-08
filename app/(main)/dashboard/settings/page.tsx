'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSchools, School, fetchTeacherProfiles, TeacherProfile, fetchStudentProfiles, StudentProfile, fetchProjectsBySchool, Project } from '@/app/services/api';

const placeholderImg = 'https://placehold.co/120x120?text=School';

const TABS = ['Overview', 'Teachers', 'Students', 'Impact'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [school, setSchool] = useState<School | null>(null);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadSchool = async () => {
      try {
        setLoading(true);
        const response = await fetchSchools(1, 1); // Get first school
        if (response.results.length > 0) {
          const schoolData = response.results[0];
          setSchool(schoolData);
          
          // Load teachers, students, and projects for this school
          await Promise.all([
            loadTeachers(schoolData.id),
            loadStudents(schoolData.id),
            loadProjects(schoolData.id)
          ]);
        } else {
          setError('No school found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load school data');
      } finally {
        setLoading(false);
      }
    };

    const loadTeachers = async (schoolId: string) => {
      try {
        setTeachersLoading(true);
        const response = await fetchTeacherProfiles(schoolId, 1, 50);
        setTeachers(response.results);
      } catch (err) {
        console.error('Failed to load teachers:', err);
        // Don't set main error, just log it
      } finally {
        setTeachersLoading(false);
      }
    };

    const loadStudents = async (schoolId: string) => {
      try {
        setStudentsLoading(true);
        const response = await fetchStudentProfiles(schoolId, 1, 50);
        setStudents(response.results);
      } catch (err) {
        console.error('Failed to load students:', err);
        // Don't set main error, just log it
      } finally {
        setStudentsLoading(false);
      }
    };

    const loadProjects = async (schoolId: string) => {
      try {
        setProjectsLoading(true);
        const response = await fetchProjectsBySchool(schoolId, 1, 100);
        setProjects(response.results);
      } catch (err) {
        console.error('Failed to load projects:', err);
        // Don't set main error, just log it
      } finally {
        setProjectsLoading(false);
      }
    };

    loadSchool();
  }, []);

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

  if (loading) {
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
          <p className="text-red-600 mb-4">{error || 'No school data available'}</p>
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
              onClick={() => router.push('/dashboard/settings/teachers-new')}
            >
              + Add Teacher
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by name, email, or subject"
              className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="mb-4 flex gap-3">
            <select className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700">
              <option>Department</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700">
              <option>Subject</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700">
              <option>Status</option>
            </select>
          </div>

          {/* Teachers Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            {teachersLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading teachers...</p>
                </div>
              </div>
            ) : teachers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No teachers found for this school.</p>
                <button
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  onClick={() => router.push('/dashboard/settings/teachers-new')}
                >
                  Add First Teacher
                </button>
              </div>
            ) : (
              <table className="min-w-full text-sm table-auto">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 text-left font-semibold">Profile</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold w-48 max-w-xs whitespace-nowrap">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Phone</th>
                    <th className="px-4 py-3 text-left font-semibold">Subject(s)</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Role</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-semibold text-sm">
                            {teacher.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{teacher.user_name}</td>
                      <td className="px-4 py-3 text-green-700 w-48 max-w-xs whitespace-nowrap overflow-hidden">
                        <span className="truncate block w-full" title="Email not available">-</span>
                      </td>
                      <td className="px-4 py-3">-</td>
                      <td className="px-4 py-3">
                        {teacher.assigned_subjects_data.length > 0 
                          ? teacher.assigned_subjects_data.map(subject => subject.name).join(', ')
                          : '-'
                        }
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-semibold ${
                          teacher.teacher_role === 'admin' ? 'bg-green-100 text-green-700' : 
                          teacher.teacher_role === 'class_teacher' ? 'bg-blue-100 text-blue-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {teacher.teacher_role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          teacher.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {teacher.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-green-700 font-semibold hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
            {studentsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading students...</p>
                </div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No students found for this school.</p>
                <button
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  onClick={() => router.push('/dashboard/settings/students-new')}
                >
                  Add First Student
                </button>
              </div>
            ) : (
              <table className="min-w-full text-sm table-fixed">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 text-left font-semibold">Profile</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold w-48">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Phone</th>
                    <th className="px-4 py-3 text-left font-semibold">Class</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-semibold text-sm">
                            {student.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{student.user_name}</td>
                      <td className="px-4 py-3 text-green-700 w-48 whitespace-nowrap overflow-hidden">
                        <span className="truncate block w-full" title="Email not available">-</span>
                      </td>
                      <td className="px-4 py-3">-</td>
                      <td className="px-4 py-3">{student.class_name}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          ACTIVE
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-green-700 font-semibold hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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