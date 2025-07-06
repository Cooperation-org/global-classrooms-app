'use client'
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockCollaborations } from '@/app/data/mockCollaborations';

// Placeholder/mock data for extra details
const mockDetails = {
  subtitle: 'A collaborative project to reduce waste in schools and promote sustainable practices.',
  tags: ['Waste Management', 'Sustainability', 'Environmental Education'],
  overview: 'The Eco-Action Initiative is a collaborative project aimed at reducing waste in schools and promoting sustainable practices. Participating schools will work together to implement waste reduction strategies, educate students about environmental issues, and create a positive impact on their communities.',
  goals: 'Reduce school waste by 50% within one year, educate students about waste reduction, and promote sustainable practices.',
  type: 'Cross-School',
  timeline: 'Start Date: September 1, 2024, End Date: June 30, 2025',
  leadSchool: {
    name: 'Greenwood Academy',
    location: 'Springfield, USA',
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=400',
    contact: 'Ms. Harper',
    role: 'Environmental Science Teacher',
  },
  participatingSchools: [
    { logo: 'https://img.icons8.com/ios-filled/50/4BA186/school-building.png' },
    { logo: 'https://img.icons8.com/ios-filled/50/4BA186/school-building.png' },
    { logo: 'https://img.icons8.com/ios-filled/50/4BA186/school-building.png' },
    { logo: 'https://img.icons8.com/ios-filled/50/4BA186/school-building.png' },
    { logo: 'https://img.icons8.com/ios-filled/50/4BA186/school-building.png' },
  ],
  contribution: {
    offering: 'Guidance on waste reduction strategies, access to educational resources, and mentorship.',
    expectation: 'Active participation in project activities, implementation of waste reduction strategies, and sharing of best practices.',
  },
  targets: [
    'Plant 200 trees',
    'Conduct 3 awareness campaigns',
    'Reduce plastic use by 30%',
  ],
  rewards: [
    { image: 'https://img.icons8.com/color/96/000000/farmer.png', label: 'Most Innovative Solution' },
    { image: 'https://img.icons8.com/color/96/000000/medal2.png', label: 'Best Community Impact' },
  ],
  media: [
    { image: 'https://assets-global.website-files.com/5f6b7b6c6e2c6e2c6e2c6e2c/5f6b7b6c6e2c6e2c6e2c6e2c_waste-sorting.svg', label: 'Waste Sorting Activity' },
    { image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=400', label: 'Tree Planting Event' },
    { image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400', label: 'School Garden Project' },
  ],
  files: [
    { name: 'Project Plan.pdf' },
  ],
  discussion: [
    { user: 'Sarah Miller', avatar: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?w=100', message: 'Excited to start this project with my students! Any tips for the initial data collection phase?', time: '2 days ago' },
    { user: 'David Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', message: 'We found it helpful to involve students in designing the data collection methods. It increases their engagement and ownership of the project.', time: '1 day ago' },
  ],
};

export default function CollaborationDetailsPage() {
  const params = useParams();
  const id = Number(params?.id);
  const collab = mockCollaborations.find(c => c.id === id) || mockCollaborations[0];

  return (
    <div className="max-w-5xl  px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <div className="text-sm text-[#4BA186] mb-2">Collaborations / <span className="text-gray-900">{collab.title}</span></div>
      {/* Title, subtitle, tags, join button */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{collab.title}</h1>
      <div className="text-[#4BA186] text-lg mb-4">{mockDetails.subtitle}</div>
      <div className="flex flex-wrap gap-3 mb-6">
        {mockDetails.tags.map(tag => (
          <span key={tag} className="px-4 py-2 rounded-full bg-[#E6F4EA] text-[#4BA186] font-medium text-sm">{tag}</span>
        ))}
      </div>
      <Link href={`/dashboard/collaborations/${id}/join`} className="mb-8 px-6 py-3 bg-black text-white rounded-lg font-medium text-base flex items-center gap-2 hover:bg-[#222B45] transition">
        Join Collaboration
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </Link>
      {/* Overview, goals, type, timeline */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Overview</h2>
      <p className="text-gray-700 mb-6 max-w-2xl">{mockDetails.overview}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="text-[#9CA3AF] font-semibold mb-1">Goals & Objectives</div>
          <div className="text-gray-900">{mockDetails.goals}</div>
        </div>
        <div>
          <div className="text-[#9CA3AF] font-semibold mb-1">Type</div>
          <div className="text-gray-900">{mockDetails.type}</div>
        </div>
        <div>
          <div className="text-[#9CA3AF] font-semibold mb-1">Timeline</div>
          <div className="text-gray-900">{mockDetails.timeline}</div>
        </div>
      </div>
      {/* Lead School Info */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Lead School Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-center">
        <div className="md:col-span-2">
          <div className="font-semibold text-gray-900">Lead School</div>
          <div className="font-bold text-lg text-gray-900">{mockDetails.leadSchool.name}</div>
          <div className="text-gray-500 mb-2">Location: {mockDetails.leadSchool.location}</div>
          <button className="mb-4 px-4 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium">View School Profile</button>
          <div className="flex gap-8">
            <div>
              <div className="text-gray-500">Contact Person</div>
              <div className="text-gray-900 font-medium">{mockDetails.leadSchool.contact}</div>
            </div>
            <div>
              <div className="text-gray-500">Role</div>
              <div className="text-gray-900 font-medium">{mockDetails.leadSchool.role}</div>
            </div>
          </div>
        </div>
        <img src={mockDetails.leadSchool.image} alt="Lead School" className="rounded-xl w-full h-32 object-cover" />
      </div>
      {/* Participating Schools */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Participating Schools</h2>
      <div className="flex gap-3 mb-8">
        {mockDetails.participatingSchools.map((s, i) => (
          <img key={i} src={s.logo} alt="School" className="w-10 h-10 rounded-full bg-[#E6F4EA]" />
        ))}
      </div>
      {/* Contribution & Expectations */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Contribution & Expectations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="text-[#9CA3AF] font-semibold mb-1">What Greenwood Academy is Offering</div>
          <div className="text-gray-900">{mockDetails.contribution.offering}</div>
        </div>
        <div>
          <div className="text-[#9CA3AF] font-semibold mb-1">What is Expected from Collaborators</div>
          <div className="text-gray-900">{mockDetails.contribution.expectation}</div>
        </div>
      </div>
      {/* Goals/Targets */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Goals/Targets</h2>
      <div className="mb-8 space-y-2">
        {mockDetails.targets.map((goal, i) => (
          <div key={i} className="flex items-center gap-3">
            <input type="checkbox" className="w-5 h-5 accent-[#4BA186]" />
            <span className="text-gray-900 text-base">{goal}</span>
          </div>
        ))}
      </div>
      {/* Rewards & Recognition */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Rewards & Recognition</h2>
      <div className="flex gap-8 mb-2">
        {mockDetails.rewards.map((r, i) => (
          <div key={i} className="flex flex-col items-center">
            <img src={r.image} alt={r.label} className="w-28 h-28 rounded-xl object-cover mb-2" />
            <div className="font-medium text-gray-900">{r.label}</div>
          </div>
        ))}
      </div>
      <div className="text-gray-500 mb-8">Earn digital badges and certificates upon achieving project milestones or demonstrating exceptional contributions. Recognitions include &apos;Most Innovative Solution&apos; and &apos;Best Community Impact&apos;.</div>
      {/* Media & Documents */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Media & Documents</h2>
      <div className="flex gap-6 mb-4">
        {mockDetails.media.map((m, i) => (
          <div key={i} className="flex flex-col items-center">
            <img src={m.image} alt={m.label} className="w-36 h-24 rounded-xl object-cover mb-1" />
            <div className="text-gray-900 text-sm">{m.label}</div>
          </div>
        ))}
      </div>
      {mockDetails.files.map((f, i) => (
        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 mb-8 w-fit">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="2" fill="#E6F4EA"/><path d="M7 8h6M7 12h4" stroke="#4BA186" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="text-gray-900 text-sm font-medium">{f.name}</span>
        </div>
      ))}
      {/* Discussion Forum */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Discussion Forum</h2>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <div className="space-y-6 mb-6">
          {mockDetails.discussion.map((msg, i) => (
            <div key={i} className="flex gap-4">
              <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">{msg.user}</span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <input className="flex-1 border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm" placeholder="Send Message" />
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E6F4EA] text-[#4BA186]">
            <svg width="22" height="22" fill="none" viewBox="0 0 22 22"><path d="M3 11L19 3M3 11L19 19M3 11H15" stroke="#4BA186" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
      <button className="w-64 mt-8 px-6 py-3 bg-black text-white rounded-lg font-medium text-base flex items-center gap-2 hover:bg-[#222B45] transition">
        Join Collaboration
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
} 