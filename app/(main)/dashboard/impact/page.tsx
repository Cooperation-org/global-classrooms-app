import React from "react";
import ImpactCharts from "./ImpactCharts";

const stats = [
  {
    label: "Trees Planted",
    value: 127,
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="14" fill="#E6F4EA" />
        <path
          d="M14 21v-4m0 0c-2.5 0-4.5-2-4.5-4.5S11.5 8 14 8s4.5 2 4.5 4.5S16.5 17 14 17Z"
          stroke="#4BA186"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    color: "bg-[#E6F4EA] text-[#4BA186]",
  },
  {
    label: "Water Saved (L)",
    value: 2450,
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="14" fill="#E6F4EA" />
        <path
          d="M14 8c2.5 4 5 6.5 5 9a5 5 0 1 1-10 0c0-2.5 2.5-5 5-9Z"
          stroke="#4BA186"
          strokeWidth="2"
        />
      </svg>
    ),
    color: "bg-[#E6F4EA] text-[#4BA186]",
  },
  {
    label: "CO2 Reduced (kg)",
    value: 890,
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="14" fill="#F3F0FB" />
        <path
          d="M9 17h10M9 14h10M9 11h10"
          stroke="#A78BFA"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    color: "bg-[#F3F0FB] text-[#A78BFA]",
  },
];

const certificates = [{ name: "Water Guardian" }];

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-[#F6FCF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Environmental Impact
        </h1>
        <p className="text-gray-500 mb-8">
          Track and measure your contribution to sustainability
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-xl flex items-center gap-4 p-6 shadow-sm border border-gray-200 bg-white"
            >
              <div>{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-gray-500 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <ImpactCharts />

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Impact Certificates
          </h2>
          <div className="divide-y divide-gray-100">
            {certificates.map((cert, i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#E6F4EA] flex items-center justify-center font-bold text-[#4BA186]">
                    {i + 1}
                  </span>
                  <span className="font-medium text-gray-900">{cert.name}</span>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
