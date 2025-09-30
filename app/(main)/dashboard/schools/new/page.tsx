'use client'
import React, { useState } from 'react';
import { createSchool, CreateSchoolRequest } from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function CreateSchoolPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  
  // Form state
  const [formData, setFormData] = useState<Partial<CreateSchoolRequest>>({
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
    creator_name: '',
    creator_role: 'teacher'
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const handleInputChange = (field: keyof CreateSchoolRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Validate required fields
      const requiredFields = ['name', 'overview', 'registration_number', 'address_line_1', 'city', 'country', 'phone_number', 'email', 'principal_name', 'principal_email', 'creator_name', 'creator_role'];
      for (const field of requiredFields) {
        if (!formData[field as keyof CreateSchoolRequest]) {
          throw new Error(`${field.replace('_', ' ')} is required`);
        }
      }

      const schoolData: CreateSchoolRequest = {
        ...formData as CreateSchoolRequest,
        logo: logoFile || '',
      };

      await createSchool(schoolData);
      
      // Redirect to the schools list or dashboard
      router.push('/dashboard/schools');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create school';
      
      // Check if it's an API error with field details
      if (err instanceof Error && errorMessage.includes('Bad request')) {
        try {
          // Try to parse the error for field-specific errors
          const errorData = JSON.parse(errorMessage);
          if (errorData.details) {
            setFieldErrors(errorData.details);
            setError('Please fix the errors below');
            return;
          }
        } catch {
          // If we can't parse it, just show the general error
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return fieldErrors[fieldName]?.[0] || '';
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New School</h1>
      <p className="text-[#4BA186] mb-8">Register your school to start participating in environmental projects.</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-2">School Name *</label>
          <input 
            className={`w-full border rounded-lg px-4 py-3 text-base ${
              getFieldError('name') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            placeholder="Enter school name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
          {getFieldError('name') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('name')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">Registration Number *</label>
          <input 
            className={`w-full border rounded-lg px-4 py-3 text-base ${
              getFieldError('registration_number') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            placeholder="Enter registration number"
            value={formData.registration_number}
            onChange={(e) => handleInputChange('registration_number', e.target.value)}
            required
          />
          {getFieldError('registration_number') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('registration_number')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">Institution Type</label>
          <select 
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base"
            value={formData.institution_type}
            onChange={(e) => handleInputChange('institution_type', e.target.value)}
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="higher_secondary">Higher Secondary</option>
            <option value="college">College</option>
            <option value="university">University</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2">Affiliation</label>
          <select 
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base"
            value={formData.affiliation}
            onChange={(e) => handleInputChange('affiliation', e.target.value)}
          >
            <option value="government">Government</option>
            <option value="private">Private</option>
            <option value="semi_government">Semi-Government</option>
            <option value="international">International</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2">Year of Establishment</label>
          <input 
            type="number"
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base"
            placeholder="2020"
            value={formData.year_of_establishment}
            onChange={(e) => handleInputChange('year_of_establishment', parseInt(e.target.value))}
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Medium of Instruction</label>
          <select 
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base"
            value={formData.medium_of_instruction}
            onChange={(e) => handleInputChange('medium_of_instruction', e.target.value)}
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="french">French</option>
            <option value="spanish">Spanish</option>
            <option value="german">German</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Overview */}
      <div className="mb-8">
        <label className="block font-medium mb-2">School Overview *</label>
        <textarea 
          className={`w-full border rounded-lg px-4 py-3 text-base ${
            getFieldError('overview') ? 'border-red-500' : 'border-[#E5E7EB]'
          }`}
          rows={4}
          placeholder="Brief description of your school"
          value={formData.overview}
          onChange={(e) => handleInputChange('overview', e.target.value)}
          required
        />
        {getFieldError('overview') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('overview')}</p>
        )}
      </div>

      {/* Logo Upload */}
      <div className="mb-8 border-2 border-dashed border-[#D1E7DD] rounded-xl p-8 flex flex-col items-center justify-center">
        <h3 className="font-bold text-lg mb-2">Upload School Logo</h3>
        <p className="text-gray-500 mb-4">Upload your school logo (optional)</p>
        
        {logoPreview ? (
          <div className="w-full max-w-md">
            <img 
              src={logoPreview} 
              alt="Logo preview" 
              className="w-full h-32 object-contain rounded-lg mb-4"
            />
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => document.getElementById('logo-input')?.click()}
                className="px-6 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium"
              >
                Change Logo
              </button>
              <button 
                type="button"
                onClick={removeLogo}
                className="px-6 py-2 bg-red-100 text-red-600 rounded-lg font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button 
            type="button"
            onClick={() => document.getElementById('logo-input')?.click()}
            className="px-6 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium"
          >
            Upload Logo
          </button>
        )}
        
        <input
          id="logo-input"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="hidden"
        />
      </div>

      {/* Contact Information */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-2">Phone Number *</label>
          <input 
            type="tel"
            className={`w-full border rounded-lg px-4 py-3 text-base ${
              getFieldError('phone_number') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            placeholder="+1234567890"
            value={formData.phone_number}
            onChange={(e) => handleInputChange('phone_number', e.target.value)}
            required
          />
          {getFieldError('phone_number') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('phone_number')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">Email *</label>
          <input 
            type="email"
            className={`w-full border rounded-lg px-4 py-3 text-base ${
              getFieldError('email') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            placeholder="school@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          {getFieldError('email') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">Website</label>
          <input 
            type="url"
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base"
            placeholder="https://www.school.com"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
          />
        </div>
      </div>

      {/* Address */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Address</h2>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block font-medium mb-2">Address Line 1 *</label>
          <input 
            className={`w-full border rounded-lg px-4 py-3 text-base ${
              getFieldError('address_line_1') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            placeholder="Street address"
            value={formData.address_line_1}
            onChange={(e) => handleInputChange('address_line_1', e.target.value)}
            required
          />
          {getFieldError('address_line_1') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('address_line_1')}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium mb-2">Address Line 2</label>
          <input 
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base"
            placeholder="Apartment, suite, etc."
            value={formData.address_line_2}
            onChange={(e) => handleInputChange('address_line_2', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">City *</label>
          <input 
            className={`w-full border rounded-lg px-4 py-3 text-base ${
              getFieldError('city') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            placeholder="City"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            required
          />
          {getFieldError('city') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('city')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">State</label>
          <input 
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base"
            placeholder="State/Province"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Postal Code</label>
          <input 
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base"
            placeholder="Postal code"
            value={formData.postal_code}
            onChange={(e) => handleInputChange('postal_code', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Country *</label>
          <select 
            className={`w-full border rounded-lg px-4 py-3 text-base ${
              getFieldError('country') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            required
          >
            <option value="">Select country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
            <option value="IN">India</option>
            <option value="BR">Brazil</option>
          </select>
          {getFieldError('country') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('country')}</p>
          )}
        </div>
      </div>

      {/* Principal Information */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Principal Information</h2>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-2">Principal Name *</label>
          <input 
            className={`w-full border rounded-lg px-4 py-3 text-base ${
              getFieldError('principal_name') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            placeholder="Principal's full name"
            value={formData.principal_name}
            onChange={(e) => handleInputChange('principal_name', e.target.value)}
            required
          />
          {getFieldError('principal_name') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('principal_name')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">Principal Email *</label>
          <input 
            type="email"
            className={`w-full border rounded-lg px-4 py-3 text-base ${
              getFieldError('principal_email') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            placeholder="principal@school.com"
            value={formData.principal_email}
            onChange={(e) => handleInputChange('principal_email', e.target.value)}
            required
          />
          {getFieldError('principal_email') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('principal_email')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">Principal Phone</label>
          <input 
            type="tel"
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base"
            placeholder="+1234567890"
            value={formData.principal_phone}
            onChange={(e) => handleInputChange('principal_phone', e.target.value)}
          />
        </div>
      </div>

      {/* School Statistics */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">School Statistics</h2>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-2">Number of Students</label>
          <input 
            type="number"
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base"
            placeholder="0"
            value={formData.number_of_students}
            onChange={(e) => handleInputChange('number_of_students', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Number of Teachers</label>
          <input 
            type="number"
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base"
            placeholder="0"
            value={formData.number_of_teachers}
            onChange={(e) => handleInputChange('number_of_teachers', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
      </div>

      {/* Creator Information */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Creator Information</h2>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-2">Full Name *</label>
          <input 
            className={`w-full border rounded-lg px-4 py-3 text-base ${
              getFieldError('creator_name') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            placeholder="Principal's full name"
            value={formData.creator_name}
            onChange={(e) => handleInputChange('creator_name', e.target.value)}
            required
          />
          {getFieldError('creator_name') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('creator_name')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">Role *</label>
          <select 
            className={`w-full border rounded-lg px-4 py-3 text-base ${
              getFieldError('creator_role') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            value={formData.creator_role}
            onChange={(e) => handleInputChange('creator_role', e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher" selected>Teacher</option>
          </select>
          {getFieldError('creator_role') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('creator_role')}</p>
          )}
        </div>
      </div>
      <button 
        type="submit"
        disabled={loading}
        className="w-64 mt-8 px-6 py-3 bg-black text-white rounded-lg font-medium text-base flex items-center gap-2 hover:bg-[#222B45] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create School'}
        {!loading && (
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M7 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </form>
  );
} 