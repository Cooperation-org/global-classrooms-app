import React from 'react';

const placeholderImg = 'https://placehold.co/300x180?text=Image';
const avatarImg = 'https://placehold.co/80x80?text=Avatar';

export default function DashboardHome() {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto py-8 px-4 gap-10">
      {/* Hero Banner */}
      <section className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden flex items-center mb-4">
        <img src="https://placehold.co/1200x320?text=Banner" alt="Hero Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col justify-center h-full pl-10">
          <p className="text-white text-lg mb-2">Connect with schools worldwide to take real action for the planet.</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2">
            Welcome to <span className="text-green-200">GlobalClassrooms</span>,<br />Ms. Rishabh <span className="inline-block">👋</span>
          </h1>
        </div>
      </section>

      {/* Completed Projects */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Completed Projects</h2>
        <div className="flex gap-6">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-60">
            <img src={placeholderImg} alt="Sustainable Future" className="rounded mb-2 w-full h-28 object-cover" />
            <span className="font-semibold">Sustainable Future</span>
            <span className="text-xs text-gray-500">Lead School: Oakwood High</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-60">
            <img src={placeholderImg} alt="Clean Water Initiative" className="rounded mb-2 w-full h-28 object-cover" />
            <span className="font-semibold">Clean Water Initiative</span>
            <span className="text-xs text-gray-500">Lead School: Pinecrest Middle</span>
          </div>
        </div>
      </section>

      {/* Featured Environmental Projects */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Environmental Projects</h2>
        <div className="flex gap-6">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-60">
            <img src={placeholderImg} alt="Coastal Cleanup Initiative" className="rounded mb-2 w-full h-28 object-cover" />
            <span className="font-semibold">Coastal Cleanup Initiative</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-60">
            <img src={placeholderImg} alt="Community Garden Project" className="rounded mb-2 w-full h-28 object-cover" />
            <span className="font-semibold">Community Garden Project</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-60">
            <img src={placeholderImg} alt="Green Our School" className="rounded mb-2 w-full h-28 object-cover" />
            <span className="font-semibold">Green Our School</span>
          </div>
        </div>
      </section>

      {/* Collaborations You Can Join */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Collaborations You Can Join</h2>
        <div className="flex gap-6">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-60">
            <img src={placeholderImg} alt="Sustainable Future" className="rounded mb-2 w-full h-28 object-cover" />
            <span className="font-semibold">Sustainable Future</span>
            <span className="text-xs text-gray-500">Lead School: Oakwood High</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-60">
            <img src={placeholderImg} alt="Clean Water Initiative" className="rounded mb-2 w-full h-28 object-cover" />
            <span className="font-semibold">Clean Water Initiative</span>
            <span className="text-xs text-gray-500">Lead School: Pinecrest Middle</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">What We're Achieving Together</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
            <span className="text-2xl font-bold">500</span>
            <span className="text-gray-600 text-sm text-center">Total Schools Involved</span>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
            <span className="text-2xl font-bold">200</span>
            <span className="text-gray-600 text-sm text-center">Total Environmental Projects</span>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
            <span className="text-2xl font-bold">100</span>
            <span className="text-gray-600 text-sm text-center">Total Collaborations</span>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
            <span className="text-2xl font-bold">50</span>
            <span className="text-gray-600 text-sm text-center">Total Countries Reached</span>
          </div>
        </div>
      </section>

      {/* See What Schools Are Doing */}
      <section>
        <h2 className="text-2xl font-bold mb-4">See What Schools Are Doing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col">
            <img src={placeholderImg} alt="Project Update" className="rounded mb-2 w-full h-40 object-cover" />
            <span className="font-semibold">Project 'Green Our School' update submitted</span>
            <span className="text-xs text-green-700">Maplewood Academy</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col">
            <img src={placeholderImg} alt="Collaboration Message" className="rounded mb-2 w-full h-40 object-cover" />
            <span className="font-semibold">Collaboration message from Ms. Evans</span>
            <span className="text-xs text-green-700">Lakeside High</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="flex flex-col items-center justify-center py-12">
        <h2 className="text-3xl font-extrabold mb-2 text-center">Ready to Create Your Next Impact?</h2>
        <p className="text-lg text-gray-600 mb-6 text-center">Start a new project or join a collaboration today.</p>
        <div className="flex gap-4">
          <button className="bg-black text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-gray-900 transition">Start a Project</button>
          <button className="bg-green-50 text-black px-6 py-3 rounded-full font-semibold text-lg hover:bg-green-100 transition">View Collaborations</button>
        </div>
      </section>
    </div>
  );
} 