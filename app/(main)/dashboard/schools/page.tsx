'use client'
import React, { useState, useMemo } from 'react';
import { useSchools } from '@/app/hooks/useSWR';
import { SchoolCard } from '@/app/components/schools/SchoolCard';
import Link from 'next/link';

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitutionType, setSelectedInstitutionType] = useState('All Types');
  const [selectedAffiliation, setSelectedAffiliation] = useState('All Affiliations');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');

  // Use SWR hook for data fetching
  const { schools: swrSchools, isLoading, error, totalCount } = useSchools(1, 100);

  // Update local state when SWR data changes
  React.useEffect(() => {
    if (swrSchools) {
      setSchools(swrSchools);
      setFilteredSchools(swrSchools);
    }
  }, [swrSchools]);

  // Filter schools based on search and filters
  React.useEffect(() => {
    let filtered = schools;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.overview.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by institution type
    if (selectedInstitutionType !== 'All Types') {
      filtered = filtered.filter(school => 
        school.institution_type === selectedInstitutionType.toLowerCase().replace(' ', '_')
      );
    }

    // Filter by affiliation
    if (selectedAffiliation !== 'All Affiliations') {
      filtered = filtered.filter(school => 
        school.affiliation === selectedAffiliation.toLowerCase().replace(' ', '_')
      );
    }

    // Filter by country
    if (selectedCountry !== 'All Countries') {
      filtered = filtered.filter(school => school.country === selectedCountry);
    }

    setFilteredSchools(filtered);
  }, [schools, searchTerm, selectedInstitutionType, selectedAffiliation, selectedCountry]);

  // Get unique values for filter options
  const uniqueInstitutionTypes = Array.from(new Set(schools.map(school => school.institution_type)))
    .map(type => type.replace('_', ' '))
    .sort();

  const uniqueAffiliations = Array.from(new Set(schools.map(school => school.affiliation)))
    .map(affiliation => affiliation.replace('_', ' '))
    .sort();

  const uniqueCountries = Array.from(new Set(schools.map(school => school.country))).sort();

  // Handle authentication errors
  if (error && (error as { status?: number })?.status === 401) {
    // Don't redirect immediately, let the SWR fetcher handle it
    console.log('Authentication error detected in schools page');
    return (
      <div className="w-full max-w-5xl py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h1>
          <p className="text-red-600 mb-4">Please log in to access this page.</p>
          <button 
            onClick={() => window.location.href = '/signin'}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Schools</h1>
          <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'Failed to load schools'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Schools Network</h1>
          <p className="text-gray-500 mb-8">Connect with schools around the world working on environmental projects</p>
        </div>
        <Link 
          href="/dashboard/schools/new"
          className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Add New School
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <input 
          className="border rounded px-3 py-2 text-sm w-64" 
          placeholder="Search schools..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="border rounded px-3 py-2 text-sm"
          value={selectedInstitutionType}
          onChange={(e) => setSelectedInstitutionType(e.target.value)}
        >
          <option>All Types</option>
          {uniqueInstitutionTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select 
          className="border rounded px-3 py-2 text-sm"
          value={selectedAffiliation}
          onChange={(e) => setSelectedAffiliation(e.target.value)}
        >
          <option>All Affiliations</option>
          {uniqueAffiliations.map(affiliation => (
            <option key={affiliation} value={affiliation}>{affiliation}</option>
          ))}
        </select>
        <select 
          className="border rounded px-3 py-2 text-sm"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option>All Countries</option>
          {uniqueCountries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {filteredSchools.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
          <p className="text-gray-500 mb-6">
            {schools.length === 0 
              ? 'Get started by adding your first school'
              : 'No schools match your current filters'
            }
          </p>
          {schools.length === 0 && (
            <Link 
              href="/dashboard/schools/new"
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Add School
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      )}
    </div>
  );
} 