'use client'
import React, { useState, useEffect } from 'react';
import { fetchSchoolById, SchoolDetails } from '@/app/services/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SchoolActiveProjects } from '@/app/components/schools/SchoolActiveProjects';
import { SchoolCollaborations } from '@/app/components/schools/SchoolCollaborations';
import { SchoolImpact } from '@/app/components/schools/SchoolImpact';

function SchoolDetailsHeader({ school }: { school: SchoolDetails }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
      <div className="flex items-center gap-6">
        {school.logo && (
          <img src={school.logo} alt={school.name} className="w-24 h-24 rounded-xl object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{school.name}</h1>
          <div className="text-[#4BA186] text-sm">Located in {school.city}, {school.country}</div>
        </div>
      </div>
      <button className="px-6 py-3 bg-black text-white rounded-lg font-medium text-base flex items-center gap-2 hover:bg-[#222B45] transition">
        Connect With School
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path d="M7 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Active Projects' },
  { id: 'collaborations', label: 'Collaborations' },
  { id: 'impact', label: 'Impact' },
];

function SchoolDetailsTabs({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="flex gap-6 border-b border-gray-200 mb-8">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`py-2 px-4 font-medium text-base border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#1A7F4F] text-[#1A7F4F]' : 'border-transparent text-[#6B7280]'}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function SchoolOverviewSection({ school }: { school: SchoolDetails }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
      <p className="text-gray-700 mb-8 max-w-2xl">{school.overview}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="text-[#4BA186] font-medium mb-1">Institution Type</div>
          <div className="text-gray-900 capitalize">{school.institution_type.replace('_', ' ')}</div>
        </div>
        <div>
          <div className="text-[#4BA186] font-medium mb-1">Affiliation</div>
          <div className="text-gray-900 capitalize">{school.affiliation}</div>
        </div>
        <div>
          <div className="text-[#4BA186] font-medium mb-1">Registration Number</div>
          <div className="text-gray-900">{school.registration_number}</div>
        </div>
        <div>
          <div className="text-[#4BA186] font-medium mb-1">Year Established</div>
          <div className="text-gray-900">{school.year_of_establishment}</div>
        </div>
        <div>
          <div className="text-[#4BA186] font-medium mb-1">Medium of Instruction</div>
          <div className="text-gray-900 capitalize">{school.medium_of_instruction}</div>
        </div>
        <div>
          <div className="text-[#4BA186] font-medium mb-1">Students</div>
          <div className="text-gray-900">{school.number_of_students.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[#4BA186] font-medium mb-1">Teachers</div>
          <div className="text-gray-900">{school.number_of_teachers.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[#4BA186] font-medium mb-1">Projects</div>
          <div className="text-gray-900">{school.project_count}</div>
        </div>
      </div>
      <div className="mb-8">
        <div className="text-[#4BA186] font-bold mb-1">Contact Information</div>
        <div className="text-gray-900">
          <div>Phone: {school.phone_number}</div>
          <div>Email: {school.email}</div>
          {school.website && <div>Website: <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-[#4BA186] hover:text-[#3a8a6f]">{school.website}</a></div>}
        </div>
      </div>
      <div className="mb-8">
        <div className="text-[#4BA186] font-bold mb-1">Principal</div>
        <div className="text-gray-900">
          <div>Name: {school.principal_name}</div>
          <div>Email: {school.principal_email}</div>
          {school.principal_phone && <div>Phone: {school.principal_phone}</div>}
        </div>
      </div>
      <div className="mb-8">
        <div className="text-[#4BA186] font-bold mb-1">Address</div>
        <div className="text-gray-900">
          <div>{school.address_line_1}</div>
          {school.address_line_2 && <div>{school.address_line_2}</div>}
          <div>{school.city}, {school.state} {school.postal_code}</div>
          <div>{school.country}</div>
        </div>
      </div>
    </div>
  );
}

export default function SchoolDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<SchoolDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadSchoolDetails = async () => {
      try {
        setLoading(true);
        const schoolId = params.id as string;
        const schoolData = await fetchSchoolById(schoolId);
        setSchool(schoolData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load school details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadSchoolDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">School Details</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">School Not Found</h1>
          <p className="text-gray-600 mb-4">The school you're looking for doesn't exist.</p>
          <Link 
            href="/dashboard/schools"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Back to Schools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl  px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-sm text-[#4BA186] mb-2">
        <Link href="/dashboard/schools" className="hover:text-[#3a8a6f]">Schools</Link> / <span className="text-gray-900">{school.name}</span>
      </div>
      <SchoolDetailsHeader school={school} />
      <SchoolDetailsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'overview' && (
        <>
          <SchoolOverviewSection school={school} />
          {/* For now, these will be empty since API doesn't provide this data */}
          <SchoolActiveProjects projects={[]} />
          <SchoolCollaborations collaborations={[]} />
          <SchoolImpact impact={[]} />
        </>
      )}
      {activeTab === 'projects' && <SchoolActiveProjects projects={[]} />}
      {activeTab === 'collaborations' && <SchoolCollaborations collaborations={[]} />}
      {activeTab === 'impact' && <SchoolImpact impact={[]} />}
    </div>
  );
} 