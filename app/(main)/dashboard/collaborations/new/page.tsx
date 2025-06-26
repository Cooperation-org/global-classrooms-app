'use client'
import React, { useState } from 'react';

export default function CreateCollaborationPage() {
  const [offerRewards, setOfferRewards] = useState(false);
  const [openCollab, setOpenCollab] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project Proposal</h1>
      <p className="text-[#4BA186] mb-8">Share your environmental initiative with schools worldwide.</p>

      {/* Project Basics */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Project Basics</h2>
      <div className="mb-6">
        <label className="block font-medium mb-2">Project Title</label>
        <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF] mb-4" placeholder="Enter project title" />
        <label className="block font-medium mb-2">Short Description (max 250 characters)</label>
        <textarea className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF] mb-4" rows={3} />
        <label className="block font-medium mb-2">Detailed Description</label>
        <textarea className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF]" rows={4} />
      </div>

      {/* Cover Image Upload */}
      <div className="mb-10 border-2 border-dashed border-[#D1E7DD] rounded-xl p-8 flex flex-col items-center justify-center">
        <h3 className="font-bold text-lg mb-2">Upload Cover Image</h3>
        <p className="text-gray-500 mb-4">Drag and drop or browse to upload an image that represents your project</p>
        <button className="px-6 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium">Upload Image</button>
      </div>

      {/* Project Scope & Focus */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Project Scope & Focus</h2>
      <div className="mb-8">
        <label className="block font-medium mb-2">Environmental Themes</label>
        <select className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4">
          <option>Select themes</option>
        </select>
      </div>

      {/* Timeline & Collaboration */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline & Collaboration</h2>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-2">Start Date</label>
          <input type="date" className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4" />
        </div>
        <div>
          <label className="block font-medium mb-2">End Date</label>
          <input type="date" className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4" />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-10">
        <span className="font-medium">Is the project open for collaboration?</span>
        <input type="checkbox" checked={openCollab} onChange={() => setOpenCollab(v => !v)} className="w-5 h-5 accent-[#4BA186]" />
      </div>

      {/* Goals, Targets & Rewards */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Goals, Targets & Rewards</h2>
      <div className="mb-6">
        <label className="block font-medium mb-2">Goal</label>
        <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF] mb-4" placeholder="Enter goal" />
        <div className="flex items-center gap-3 mb-4">
          <span className="font-medium">Offer Rewards?</span>
          <input type="checkbox" checked={offerRewards} onChange={() => setOfferRewards(v => !v)} className="w-5 h-5 accent-[#4BA186]" />
        </div>
        <label className="block font-medium mb-2">Type of Recognition</label>
        <select className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4">
          <option>Select recognition type</option>
        </select>
        <label className="block font-medium mb-2">Award Criteria</label>
        <textarea className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF]" rows={3} />
        <button className="mt-4 px-4 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium">+ Add Goal</button>
      </div>
      <div className="mb-10 border-2 border-dashed border-[#D1E7DD] rounded-xl p-8 flex flex-col items-center justify-center">
        <h3 className="font-bold text-lg mb-2">Upload Sample Certificates/Badges</h3>
        <p className="text-gray-500 mb-4">Drag and drop or browse to upload sample certificates or badge graphics</p>
        <button className="px-6 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium">Upload</button>
      </div>

      {/* School & Contact Info */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">School & Contact Info</h2>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-2">School Name</label>
          <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4" />
        </div>
        <div>
          <label className="block font-medium mb-2">Contact Person Name</label>
          <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4" />
        </div>
        <div>
          <label className="block font-medium mb-2">Contact Person Email</label>
          <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4" />
        </div>
        <div>
          <label className="block font-medium mb-2">Contact Person Role</label>
          <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4" />
        </div>
        <div>
          <label className="block font-medium mb-2">Country</label>
          <select className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4">
            <option>Select country</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2">City</label>
          <input className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4" />
        </div>
      </div>

      {/* Media & Attachments */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Media & Attachments</h2>
      <div className="mb-6 border-2 border-dashed border-[#D1E7DD] rounded-xl p-8 flex flex-col items-center justify-center">
        <h3 className="font-bold text-lg mb-2">Upload Supporting Files</h3>
        <p className="text-gray-500 mb-4">Drag and drop or browse to upload PDFs, slides, or documents</p>
        <button className="px-6 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium">Upload Files</button>
      </div>
      <div className="mb-10 border-2 border-dashed border-[#D1E7DD] rounded-xl p-8 flex flex-col items-center justify-center">
        <h3 className="font-bold text-lg mb-2">Upload Photos/Videos</h3>
        <p className="text-gray-500 mb-4">Drag and drop or browse to upload images and videos</p>
        <button className="px-6 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium">Upload Media</button>
      </div>

      <button className="w-64 mt-8 px-6 py-3 bg-black text-white rounded-lg font-medium text-base flex items-center gap-2 hover:bg-[#222B45] transition">
        Create a Collaboration
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
} 