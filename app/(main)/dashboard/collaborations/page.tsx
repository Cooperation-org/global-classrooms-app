import React from 'react';
import Link from 'next/link';

export default function CollaborationsPage() {
  return (
    <div className="min-h-screen bg-[#F6FCF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cross-Community Collaborations</h1>
            <p className="text-gray-500">Connect and collaborate with schools worldwide</p>
          </div>
          <Link href="/dashboard/collaborations/new" className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg font-medium text-base hover:bg-[#222B45] transition">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 4v12m6-6H4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            Start New
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-6 px-8 py-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#E6F4EA]">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" stroke="#4BA186" strokeWidth="2" fill="#F6FCF8" />
              <path d="M16 8v8l6 3" stroke="#4BA186" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 mb-1">Global Impact Network</div>
            <div className="text-gray-500">Join forces with schools across borders to amplify your environmental impact</div>
          </div>
        </div>
      </div>
    </div>
  );
} 