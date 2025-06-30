'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const placeholderImg = 'https://placehold.co/120x120?text=School';

const TABS = ['Overview', 'Teachers', 'Students', 'Impact'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const router = useRouter();

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
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
        <img src={placeholderImg} alt="School" className="w-24 h-24 rounded-lg object-cover border" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Greenwood Academy</h2>
          <p className="text-green-700 text-sm">A leading institution in environmental education</p>
          <p className="text-green-500 text-xs">Located in Springfield, USA</p>
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
              Greenwood Academy is committed to fostering environmental stewardship among students. Our mission is to integrate sustainability into all aspects of education, preparing students to be responsible global citizens. We align our projects with the UN Sustainable Development Goals, focusing on climate action, responsible consumption, and life on land.
            </p>
          </div>

          {/* School Information */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
              <div>
                <div className="text-gray-500">School Name</div>
                <div className="font-medium">Evergreen High</div>
              </div>
              <div>
                <div className="text-gray-500">Institution Type</div>
                <div className="font-medium">High School</div>
              </div>
              <div>
                <div className="text-gray-500">Affiliation / Board</div>
                <div className="font-medium">State Board of Education</div>
              </div>
              <div>
                <div className="text-gray-500">Registration Number</div>
                <div className="font-medium">1234567890</div>
              </div>
              <div>
                <div className="text-gray-500">Year of Establishment</div>
                <div className="font-medium text-green-700">2005</div>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Location & Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
              <div>
                <div className="text-gray-500">Address Line 1 & 2</div>
                <div className="font-medium">123 Oak Street</div>
              </div>
              <div>
                <div className="text-gray-500">City</div>
                <div className="font-medium">Springfield</div>
              </div>
              <div>
                <div className="text-gray-500">State</div>
                <div className="font-medium">CA</div>
              </div>
              <div>
                <div className="text-gray-500">Postal Code</div>
                <div className="font-medium text-green-700">91234</div>
              </div>
              <div>
                <div className="text-gray-500">Country</div>
                <div className="font-medium">USA</div>
              </div>
              <div>
                <div className="text-gray-500">School Phone Number</div>
                <div className="font-medium">(555) 123-4567</div>
              </div>
              <div>
                <div className="text-gray-500">School Email</div>
                <div className="font-medium">evergreen@highschool.example.com</div>
              </div>
              <div>
                <div className="text-gray-500">Website</div>
                <div className="font-medium text-green-700">www.evergreenhigh.edu</div>
              </div>
            </div>
          </div>

          {/* Principal / Head Details */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Principal / Head Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
              <div>
                <div className="text-gray-500">Full Name</div>
                <div className="font-medium">Dr. Eleanor Reed</div>
              </div>
              <div>
                <div className="text-gray-500">Email</div>
                <div className="font-medium">eleanor.reed@example.com</div>
              </div>
              <div>
                <div className="text-gray-500">Phone Number</div>
                <div className="font-medium">(555) 987-6543</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
              <div>
                <div className="text-gray-500">Number of Teachers</div>
                <div className="font-medium">40</div>
              </div>
              <div>
                <div className="text-gray-500">Number of Students</div>
                <div className="font-medium">500</div>
              </div>
              <div>
                <div className="text-gray-500">Medium of Instruction</div>
                <div className="font-medium text-green-700">English</div>
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
                {/* Sample Data */}
                {[
                  {
                    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                    name: 'Ms. Evelyn Reed',
                    email: 'evelyn.reed@example.com',
                    phone: '+1-555-123-4567',
                    subject: 'Mathematics',
                    role: 'Class Teacher',
                    status: 'Active',
                  },
                  {
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                    name: 'Mr. Charles Bennett',
                    email: 'charles.bennett@example.com',
                    phone: '+1-555-987-6543',
                    subject: 'Science',
                    role: 'Subject Teacher',
                    status: 'Active',
                  },
                  {
                    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
                    name: 'Dr. Sophia Carter',
                    email: 'sophia.carter@example.com',
                    phone: '+1-555-246-8013',
                    subject: 'History',
                    role: 'Admin',
                    status: 'Active',
                  },
                  {
                    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                    name: 'Prof. Daniel Hayes',
                    email: 'daniel.hayes@example.com',
                    phone: '+1-555-135-7924',
                    subject: 'English',
                    role: 'Subject Teacher',
                    status: 'Inactive',
                  },
                  {
                    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
                    name: 'Ms. Olivia Foster',
                    email: 'olivia.foster@example.com',
                    phone: '+1-555-369-1215',
                    subject: 'Art',
                    role: 'Class Teacher',
                    status: 'Active',
                  },
                ].map((teacher, idx) => (
                  <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={teacher.avatar} alt={teacher.name} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="px-4 py-3 font-medium">{teacher.name}</td>
                    <td className="px-4 py-3 text-green-700 w-48 max-w-xs whitespace-nowrap overflow-hidden">
                      <span className="truncate block w-full" title={teacher.email}>{teacher.email}</span>
                    </td>
                    <td className="px-4 py-3">{teacher.phone}</td>
                    <td className="px-4 py-3">{teacher.subject}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-semibold ${teacher.role === 'Admin' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{teacher.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${teacher.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{teacher.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-green-700 font-semibold hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

          {/* Students Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
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
                {/* Sample Data */}
                {[
                  {
                    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                    name: 'Evelyn Reed',
                    email: 'evelyn.reed@example.com',
                    phone: '+1-555-123-4567',
                    class: 'A',
                    status: 'Active',
                  },
                  {
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                    name: 'Charles Bennett',
                    email: 'charles.bennett@example.com',
                    phone: '+1-555-987-6543',
                    class: 'B',
                    status: 'Active',
                  },
                  {
                    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
                    name: 'Sophia Carter',
                    email: 'sophia.carter@example.com',
                    phone: '+1-555-246-8013',
                    class: 'A',
                    status: 'Active',
                  },
                  {
                    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                    name: 'Daniel Hayes',
                    email: 'daniel.hayes@example.com',
                    phone: '+1-555-135-7924',
                    class: 'C',
                    status: 'Inactive',
                  },
                  {
                    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
                    name: 'Olivia Foster',
                    email: 'olivia.foster@example.com',
                    phone: '+1-555-369-1215',
                    class: 'D',
                    status: 'Active',
                  },
                ].map((student, idx) => (
                  <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className="px-4 py-3 text-green-700 w-48 whitespace-nowrap overflow-hidden">
                      <span className="truncate block w-full" title={student.email}>{student.email}</span>
                    </td>
                    <td className="px-4 py-3">{student.phone}</td>
                    <td className="px-4 py-3">{student.class}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{student.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-green-700 font-semibold hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Other tabs can be implemented similarly */}
    </div>
  );
} 