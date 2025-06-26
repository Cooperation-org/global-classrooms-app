import React, { useState } from 'react';
import { mockTeachers, mockStudents, Member } from '../../data/mockMembers';

const TABS = [
  { id: 'teachers', label: 'Teachers' },
  { id: 'students', label: 'Students' },
];

export function ManageMembers() {
  const [activeTab, setActiveTab] = useState<'teachers' | 'students'>('teachers');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [teachers, setTeachers] = useState<Member[]>(mockTeachers);
  const [students, setStudents] = useState<Member[]>(mockStudents);

  const members = activeTab === 'teachers' ? teachers : students;
  const setMembers = activeTab === 'teachers' ? setTeachers : setStudents;

  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  function handleRemove(id: number) {
    setMembers(members.filter(m => m.id !== id));
  }
  console.log(mockTeachers, mockStudents, 'abeg')
  function handleAdd(selectedId: string) {
    if (!selectedId) return;
    if (activeTab === 'teachers') {
      const options = mockTeachers.filter(t => !teachers.some(m => m.id === t.id));
      const toAdd = options.find(t => t.id === Number(selectedId));
      if (toAdd) setTeachers([...teachers, toAdd]);
    } else {
      const options = mockStudents.filter(s => !students.some(m => m.id === s.id));
      const toAdd = options.find(s => s.id === Number(selectedId));
      if (toAdd) setStudents([...students, toAdd]);
    }
    setShowModal(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-6 border-b border-[#E5E7EB] mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#1A7F4F] text-[#1A7F4F]' : 'border-transparent text-[#6B7280]'}`}
            onClick={() => setActiveTab(tab.id as 'teachers' | 'students')}
          >
            {tab.label}
          </button>
        ))}
      </div>
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
            placeholder={`Search by ${activeTab === 'teachers' ? 'school name or ID' : 'student name or ID'}`}
            className="w-full border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2 text-sm placeholder-[#9CA3AF] focus:outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-2 bg-black text-white rounded font-medium text-sm hover:bg-[#222B45] transition"
          onClick={() => setShowModal(true)}
        >
          + Add {activeTab === 'teachers' ? 'Teacher' : 'Student'}
        </button>
      </div>
      <div className="overflow-x-auto">
        {(teachers.length === 0 && students.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#6B7280]">
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48" className="mb-4">
              <circle cx="24" cy="24" r="24" fill="#F6F8FA"/>
              <path d="M32 30c0-2.21-3.58-4-8-4s-8 1.79-8 4" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="24" cy="20" r="4" stroke="#D1D5DB" strokeWidth="2"/>
              <circle cx="16" cy="18" r="2" fill="#D1D5DB"/>
              <circle cx="32" cy="18" r="2" fill="#D1D5DB"/>
            </svg>
            <div className="font-semibold text-base mb-1">No members added yet</div>
            <div className="text-sm text-[#9CA3AF]">Invite teachers and students to join this project</div>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#F6F8FA] text-[#6B7280]">
                <th className="py-2 px-4 text-left font-medium">{activeTab === 'teachers' ? 'Teacher Name' : 'Student Name'}</th>
                <th className="py-2 px-4 text-left font-medium">Status</th>
                <th className="py-2 px-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => (
                <tr key={member.id} className="border-b last:border-0">
                  <td className="py-2 px-4">{member.name}</td>
                  <td className="py-2 px-4">
                    <span className="px-3 py-1 rounded-full bg-[#F3FDF6] text-[#1A7F4F] text-xs font-semibold">Active</span>
                  </td>
                  <td className="py-2 px-4">
                    <button className="text-[#E02424] hover:underline text-xs font-medium" onClick={() => handleRemove(member.id)}>Remove</button>
                    {activeTab === 'students' && (
                      <button className="ml-4 text-[#1A7F4F] hover:underline text-xs font-medium">View</button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-[#6B7280]">No {activeTab} found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {showModal && (
        <AddMemberModal
          type={activeTab}
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
          existingIds={members.map(m => m.id)}
        />
      )}
    </div>
  );
}

function AddMemberModal({ type, onClose, onAdd, existingIds }: { type: 'teachers' | 'students'; onClose: () => void; onAdd: (id: string) => void; existingIds: number[] }) {
  const [selected, setSelected] = useState('');
  const options = type === 'teachers'
    ? mockTeachers.filter(t => !existingIds.includes(t.id))
    : mockStudents.filter(s => !existingIds.includes(s.id));

  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-[#222B45]">Add {type === 'teachers' ? 'Teacher' : 'Student'}</h3>
          <button onClick={onClose} className="text-[#6B7280] text-xl font-bold">&times;</button>
        </div>
        <div className="mb-6">
          <label className="block text-[#222B45] font-medium mb-2">Please select a {type === 'teachers' ? 'Teacher' : 'Student'} to add in this project</label>
          <select
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#222B45]"
            value={selected}
            onChange={e => setSelected(e.target.value)}
          >
            <option value="">Select a {type === 'teachers' ? 'teacher' : 'student'}</option>
            {options.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 justify-end">
          <button className="px-6 py-2 bg-[#E5E7EB] text-[#222B45] rounded-full font-medium text-sm" onClick={onClose}>Cancel</button>
          <button className="px-6 py-2 bg-black text-white rounded-full font-medium text-sm" onClick={() => onAdd(selected)} disabled={!selected}>Add</button>
        </div>
      </div>
    </div>
  );
} 