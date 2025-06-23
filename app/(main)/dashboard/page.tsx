import React from 'react';

export default function DashboardHome() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-2xl font-bold text-center mb-4">Welcome to Global Classrooms!</h1>
      <h2 className="text-xl font-semibold text-center mb-2">Let&apos;s get your school ready to make an impact.</h2>
      <p className="text-center text-gray-600 max-w-xl mb-8">
        You&apos;re now set to build your digital classroom. Here are your next steps: Register your school, Add teachers, Add students.<br />
        Don&apos;t worry - we&apos;ll guide you through each step.
      </p>
      <button className="w-80 p-3 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors">
        Get Started
      </button>
    </div>
  );
} 