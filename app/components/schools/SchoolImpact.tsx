import React from 'react';
import { SchoolImpactMetric } from '@/app/data/mockSchools';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function SchoolImpact({ impact }: { impact: SchoolImpactMetric[] }) {
  if (!impact || impact.length === 0) return null;
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Impact</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {impact.map((metric, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="mb-2 text-base font-semibold text-gray-900">{metric.title}</div>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
              {metric.unit && <span className="text-lg text-gray-500 font-medium">{metric.unit}</span>}
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Last Year <span className="text-green-600 font-semibold">{metric.lastYearChange}</span>
            </div>
            {/* Simple bar chart */}
            <div className="flex items-end gap-2 h-20 mb-2">
              {metric.chart.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center justify-end h-full">
                  <div
                    className="w-4 rounded bg-green-100"
                    style={{ height: `${val * 10 + 20}px` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              {months.map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 