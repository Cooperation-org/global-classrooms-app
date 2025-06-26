'use client'
import React from 'react';
// import { useParams } from 'next/navigation';

export default function JoinCollaborationPage() {
  // const params = useParams();
  // Optionally, fetch collab title by id for breadcrumbs
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-sm text-[#4BA186] mb-2">Collaborations / Eco-Action Initiative: School Waste Reduction</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Join a Collaboration</h1>

      {/* School Information */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">School Information</h2>
      <div className="mb-6">
        <label className="block font-medium mb-2">School Name</label>
        <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF] mb-4" placeholder="Enter your school's name" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-2">City</label>
            <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF]" placeholder="Enter city" />
          </div>
          <div>
            <label className="block font-medium mb-2">Country</label>
            <select className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base">
              <option>Select country</option>
            </select>
          </div>
        </div>
        <label className="block font-medium mb-2">School Type</label>
        <select className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4">
          <option>Select type</option>
        </select>
        <label className="block font-medium mb-2">Website (optional)</label>
        <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF]" placeholder="Enter school website" />
      </div>

      {/* Contact Person */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Person</h2>
      <div className="mb-6">
        <label className="block font-medium mb-2">Name</label>
        <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF] mb-4" placeholder="Enter name" />
        <label className="block font-medium mb-2">Email</label>
        <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF] mb-4" placeholder="Enter email" />
        <label className="block font-medium mb-2">Role/Designation</label>
        <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF]" placeholder="Enter role" />
      </div>

      {/* Attachments */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Attachments (optional)</h2>
      <div className="mb-10 border-2 border-dashed border-[#D1E7DD] rounded-xl p-8 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Drag and drop files here or <span className="font-medium text-[#4BA186]">Browse files</span></p>
        <button className="px-6 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium">Upload</button>
      </div>

      <button className="w-64 mt-8 px-6 py-3 bg-black text-white rounded-lg font-medium text-base flex items-center gap-2 hover:bg-[#222B45] transition">
        Join Collaboration
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
} 