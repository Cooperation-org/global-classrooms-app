import React from 'react';

const stats = [
  {
    label: 'Trees Planted',
    value: 127,
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#E6F4EA"/><path d="M14 21v-4m0 0c-2.5 0-4.5-2-4.5-4.5S11.5 8 14 8s4.5 2 4.5 4.5S16.5 17 14 17Z" stroke="#4BA186" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    color: 'bg-[#E6F4EA] text-[#4BA186]'
  },
  {
    label: 'Water Saved (L)',
    value: 2450,
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#E6F4EA"/><path d="M14 8c2.5 4 5 6.5 5 9a5 5 0 1 1-10 0c0-2.5 2.5-5 5-9Z" stroke="#4BA186" strokeWidth="2"/></svg>
    ),
    color: 'bg-[#E6F4EA] text-[#4BA186]'
  },
  {
    label: 'CO2 Reduced (kg)',
    value: 890,
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#F3F0FB"/><path d="M9 17h10M9 14h10M9 11h10" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    color: 'bg-[#F3F0FB] text-[#A78BFA]'
  },
];

const certificates = [
  { name: 'Water Guardian' },
];

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-[#F6FCF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Environmental Impact</h1>
        <p className="text-gray-500 mb-8">Track and measure your contribution to sustainability</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-xl flex items-center gap-4 p-6 shadow-sm border border-gray-200 bg-white">
              <div>{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
                <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Impact Over Time</h2>
          {/* Simple SVG area/line chart */}
          <svg width="100%" height="220" viewBox="0 0 600 220" className="w-full h-56">
            {/* Axes */}
            <line x1="50" y1="200" x2="550" y2="200" stroke="#E5E7EB" strokeWidth="2" />
            <line x1="50" y1="40" x2="50" y2="200" stroke="#E5E7EB" strokeWidth="2" />
            {/* Area/lines (mock, not dynamic) */}
            <polyline fill="#4BA18622" stroke="#4BA186" strokeWidth="3" points="50,180 170,170 290,160 410,140 530,120" />
            <polyline fill="#A78BFA22" stroke="#A78BFA" strokeWidth="3" points="50,200 170,190 290,180 410,170 530,160" />
            <polyline fill="#60A5FA22" stroke="#60A5FA" strokeWidth="3" points="50,200 170,200 290,190 410,180 530,170" />
            {/* X-axis labels */}
            <text x="50" y="215" fontSize="16" fill="#9CA3AF">Jan</text>
            <text x="170" y="215" fontSize="16" fill="#9CA3AF">Feb</text>
            <text x="290" y="215" fontSize="16" fill="#9CA3AF">Mar</text>
            <text x="410" y="215" fontSize="16" fill="#9CA3AF">Apr</text>
            <text x="530" y="215" fontSize="16" fill="#9CA3AF">May</text>
            {/* Y-axis labels */}
            <text x="30" y="200" fontSize="16" fill="#9CA3AF">0</text>
            <text x="20" y="160" fontSize="16" fill="#9CA3AF">50</text>
            <text x="20" y="120" fontSize="16" fill="#9CA3AF">100</text>
            <text x="20" y="80" fontSize="16" fill="#9CA3AF">150</text>
            <text x="20" y="40" fontSize="16" fill="#9CA3AF">200</text>
          </svg>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Impact Certificates</h2>
          <div className="divide-y divide-gray-100">
            {certificates.map((cert, i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#E6F4EA] flex items-center justify-center font-bold text-[#4BA186]">{i + 1}</span>
                  <span className="font-medium text-gray-900">{cert.name}</span>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 