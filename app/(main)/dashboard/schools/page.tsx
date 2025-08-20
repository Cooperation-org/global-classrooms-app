'use client'
import React, { useState, useMemo } from 'react';
import { useSchools, useUpdateSchool } from '@/app/hooks/useSWR';
import { SchoolCard } from '@/app/components/schools/SchoolCard';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitutionType, setSelectedInstitutionType] = useState('All Types');
  const [selectedAffiliation, setSelectedAffiliation] = useState('All Affiliations');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    overview: '',
    institution_type: 'primary' as const,
    affiliation: 'government' as const,
    registration_number: '',
    year_of_establishment: new Date().getFullYear(),
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone_number: '',
    email: '',
    website: '',
    principal_name: '',
    principal_email: '',
    principal_phone: '',
    number_of_students: 0,
    number_of_teachers: 0,
    medium_of_instruction: 'english' as const,
    logo: '',
    is_verified: false,
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use SWR hooks for data fetching and updating
  const { schools: swrSchools, isLoading, error, totalCount } = useSchools(1, 100);
  const { updateSchool } = useUpdateSchool();
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

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

  // Edit school functions
  const handleEditSchool = (school: any) => {
    setEditingSchool(school);
    setEditFormData({
      name: school.name || '',
      overview: school.overview || '',
      institution_type: school.institution_type || 'primary',
      affiliation: school.affiliation || 'government',
      registration_number: school.registration_number || '',
      year_of_establishment: school.year_of_establishment || new Date().getFullYear(),
      address_line_1: school.address_line_1 || '',
      address_line_2: school.address_line_2 || '',
      city: school.city || '',
      state: school.state || '',
      postal_code: school.postal_code || '',
      country: school.country || '',
      phone_number: school.phone_number || '',
      email: school.email || '',
      website: school.website || '',
      principal_name: school.principal_name || '',
      principal_email: school.principal_email || '',
      principal_phone: school.principal_phone || '',
      number_of_students: school.number_of_students || 0,
      number_of_teachers: school.number_of_teachers || 0,
      medium_of_instruction: school.medium_of_instruction || 'english',
      logo: school.logo || '',
      is_verified: school.is_verified || false,
      is_active: school.is_active !== undefined ? school.is_active : true,
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingSchool(null);
    setEditFormData({
      name: '',
      overview: '',
      institution_type: 'primary',
      affiliation: 'government',
      registration_number: '',
      year_of_establishment: new Date().getFullYear(),
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      phone_number: '',
      email: '',
      website: '',
      principal_name: '',
      principal_email: '',
      principal_phone: '',
      number_of_students: 0,
      number_of_teachers: 0,
      medium_of_instruction: 'english',
      logo: '',
      is_verified: false,
      is_active: true,
    });
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchool) return;

    setIsSubmitting(true);
    try {
      await updateSchool(editingSchool.id, editFormData);
      handleCloseEditModal();
      // The cache will be updated automatically by the SWR hook
    } catch (error) {
      console.error('Error updating school:', error);
      alert('Failed to update school. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              value
    }));
  };

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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-8 gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Global Schools Network</h1>
          <p className="text-gray-500 mb-4 md:mb-8 text-sm md:text-base">Connect with schools around the world working on environmental projects</p>
        </div>
        <Link 
          href="/dashboard/schools/new"
          className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition w-full md:w-auto text-center"
        >
          Add New School
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto whitespace-nowrap mb-8">
        <input 
          className="border rounded px-3 py-2 text-sm w-full max-w-xs" 
          placeholder="Search schools..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="border rounded px-3 py-2 text-sm w-full max-w-xs"
          value={selectedInstitutionType}
          onChange={(e) => setSelectedInstitutionType(e.target.value)}
        >
          <option>All Types</option>
          {uniqueInstitutionTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select 
          className="border rounded px-3 py-2 text-sm w-full max-w-xs"
          value={selectedAffiliation}
          onChange={(e) => setSelectedAffiliation(e.target.value)}
        >
          <option>All Affiliations</option>
          {uniqueAffiliations.map(affiliation => (
            <option key={affiliation} value={affiliation}>{affiliation}</option>
          ))}
        </select>
        <select 
          className="border rounded px-3 py-2 text-sm w-full max-w-xs"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredSchools.map((school) => (
            <SchoolCard 
              key={school.id} 
              school={school} 
              onEdit={isAdmin ? () => handleEditSchool(school) : undefined} 
            />
          ))}
        </div>
      )}

      {/* Edit School Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit School</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* School Name */}
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter school name"
                  />
                </div>

                {/* Overview */}
                <div className="md:col-span-2">
                  <label htmlFor="overview" className="block text-sm font-medium text-gray-700 mb-2">
                    Overview *
                  </label>
                  <textarea
                    id="overview"
                    name="overview"
                    value={editFormData.overview}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Brief description of the school"
                  />
                </div>

                {/* Institution Type */}
                <div>
                  <label htmlFor="institution_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Type *
                  </label>
                  <select
                    id="institution_type"
                    name="institution_type"
                    value={editFormData.institution_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="higher_secondary">Higher Secondary</option>
                    <option value="university">University</option>
                    <option value="vocational">Vocational</option>
                    <option value="special_needs">Special Needs</option>
                  </select>
                </div>

                {/* Affiliation */}
                <div>
                  <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-2">
                    Affiliation *
                  </label>
                  <select
                    id="affiliation"
                    name="affiliation"
                    value={editFormData.affiliation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="government">Government</option>
                    <option value="private">Private</option>
                    <option value="aided">Aided</option>
                    <option value="international">International</option>
                    <option value="religious">Religious</option>
                  </select>
                </div>

                {/* Registration Number */}
                <div>
                  <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    id="registration_number"
                    name="registration_number"
                    value={editFormData.registration_number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="School registration number"
                  />
                </div>

                {/* Year of Establishment */}
                <div>
                  <label htmlFor="year_of_establishment" className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Establishment *
                  </label>
                  <input
                    type="number"
                    id="year_of_establishment"
                    name="year_of_establishment"
                    value={editFormData.year_of_establishment}
                    onChange={handleInputChange}
                    required
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Address Line 1 */}
                <div>
                  <label htmlFor="address_line_1" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    id="address_line_1"
                    name="address_line_1"
                    value={editFormData.address_line_1}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Street address"
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label htmlFor="address_line_2" className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    id="address_line_2"
                    name="address_line_2"
                    value={editFormData.address_line_2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={editFormData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="City"
                  />
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={editFormData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="State/Province"
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={editFormData.postal_code}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="ZIP/Postal code"
                  />
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={editFormData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Country"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={editFormData.phone_number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="School phone number"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    School Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="school@example.com"
                  />
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={editFormData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="https://www.school.com"
                  />
                </div>

                {/* Principal Name */}
                <div>
                  <label htmlFor="principal_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Principal Name *
                  </label>
                  <input
                    type="text"
                    id="principal_name"
                    name="principal_name"
                    value={editFormData.principal_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Principal's full name"
                  />
                </div>

                {/* Principal Email */}
                <div>
                  <label htmlFor="principal_email" className="block text-sm font-medium text-gray-700 mb-2">
                    Principal Email *
                  </label>
                  <input
                    type="email"
                    id="principal_email"
                    name="principal_email"
                    value={editFormData.principal_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="principal@example.com"
                  />
                </div>

                {/* Principal Phone */}
                <div>
                  <label htmlFor="principal_phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Principal Phone *
                  </label>
                  <input
                    type="tel"
                    id="principal_phone"
                    name="principal_phone"
                    value={editFormData.principal_phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Principal's phone number"
                  />
                </div>

                {/* Number of Students */}
                <div>
                  <label htmlFor="number_of_students" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Students *
                  </label>
                  <input
                    type="number"
                    id="number_of_students"
                    name="number_of_students"
                    value={editFormData.number_of_students}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Total number of students"
                  />
                </div>

                {/* Number of Teachers */}
                <div>
                  <label htmlFor="number_of_teachers" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Teachers *
                  </label>
                  <input
                    type="number"
                    id="number_of_teachers"
                    name="number_of_teachers"
                    value={editFormData.number_of_teachers}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Total number of teachers"
                  />
                </div>

                {/* Medium of Instruction */}
                <div>
                  <label htmlFor="medium_of_instruction" className="block text-sm font-medium text-gray-700 mb-2">
                    Medium of Instruction *
                  </label>
                  <select
                    id="medium_of_instruction"
                    name="medium_of_instruction"
                    value={editFormData.medium_of_instruction}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="english">English</option>
                    <option value="local">Local Language</option>
                    <option value="bilingual">Bilingual</option>
                    <option value="multilingual">Multilingual</option>
                  </select>
                </div>

                {/* Logo URL */}
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    id="logo"
                    name="logo"
                    value={editFormData.logo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    'Update School'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 