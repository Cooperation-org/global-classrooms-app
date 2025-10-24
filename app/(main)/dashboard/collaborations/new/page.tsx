'use client'
import React, { useState, useEffect } from 'react';
import { createProject, CreateProjectRequest, fetchSchools, School } from '@/app/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateCollaborationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState<Partial<CreateProjectRequest>>({
    title: '',
    short_description: '',
    detailed_description: '',
    cover_image: '',
    environmental_themes: {},
    start_date: '',
    end_date: '',
    is_open_for_collaboration: false,
    offer_rewards: false,
    recognition_type: '',
    award_criteria: '',
    lead_school: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_role: '',
    contact_country: '',
    contact_city: '',
    goals: [],
  });

  const [goals, setGoals] = useState<string[]>(['']);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setSchoolsLoading(true);
        const response = await fetchSchools();
        setSchools(response.results);
      } catch (err) {
        console.error('Failed to load schools:', err);
      } finally {
        setSchoolsLoading(false);
      }
    };

    loadSchools();
  }, []);

  const handleInputChange = (field: keyof CreateProjectRequest, value: string | boolean | Record<string, string>) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview('');
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const addGoal = () => {
    setGoals([...goals, '']);
  };

  const removeGoal = (index: number) => {
    const newGoals = goals.filter((_, i) => i !== index);
    setGoals(newGoals);
  };

  const handleDocumentFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setDocumentFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleMediaFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeDocumentFile = (index: number) => {
    setDocumentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Validate required fields
      const requiredFields = ['title', 'short_description', 'detailed_description', 'start_date', 'end_date', 'lead_school'];
      for (const field of requiredFields) {
        if (!formData[field as keyof CreateProjectRequest]) {
          throw new Error(`${field.replace('_', ' ')} is required`);
        }
      }

      // Filter out empty goals
      const filteredGoals = goals.filter(goal => goal.trim() !== '');

      const projectData: CreateProjectRequest = {
        ...formData as CreateProjectRequest,
        cover_image: coverImage || undefined, // Send undefined instead of empty string
        goals: filteredGoals,
        document_files: documentFiles.length > 0 ? documentFiles : undefined,
        media_files: mediaFiles.length > 0 ? mediaFiles : undefined,
      };

      console.log('Project data being sent:', projectData);
      console.log('Cover image:', coverImage);
      console.log('Document files:', documentFiles.length);
      console.log('Media files:', mediaFiles.length);

      await createProject(projectData);
      
      // Redirect to the project page or dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      
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
    <form onSubmit={handleSubmit} className="max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project Proposal</h1>
      <p className="text-[#4BA186] mb-8">Share your environmental initiative with schools worldwide.</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Project Basics */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Project Basics</h2>
      <div className="mb-6">
        <label className="block font-medium mb-2">Project Title *</label>
        <input 
          className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF] mb-4" 
          placeholder="Enter project title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
        />
        <label className="block font-medium mb-2">Short Description (max 250 characters) *</label>
        <textarea 
          className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF] mb-4" 
          rows={3}
          placeholder="Brief description of your project"
          value={formData.short_description}
          onChange={(e) => handleInputChange('short_description', e.target.value)}
          maxLength={250}
          required
        />
        <label className="block font-medium mb-2">Detailed Description *</label>
        <textarea 
          className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF]" 
          rows={4}
          placeholder="Detailed description of your project"
          value={formData.detailed_description}
          onChange={(e) => handleInputChange('detailed_description', e.target.value)}
          required
        />
      </div>

      {/* Cover Image Upload */}
      <div className="mb-10 border-2 border-dashed border-[#D1E7DD] rounded-xl p-8 flex flex-col items-center justify-center">
        <h3 className="font-bold text-lg mb-2">Upload Cover Image</h3>
        <p className="text-gray-500 mb-4">Drag and drop or browse to upload an image that represents your project</p>
        
        {coverImagePreview ? (
          <div className="w-full max-w-md">
            <img 
              src={coverImagePreview} 
              alt="Cover preview" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => document.getElementById('cover-image-input')?.click()}
                className="px-6 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium"
              >
                Change Image
              </button>
              <button 
                type="button"
                onClick={removeCoverImage}
                className="px-6 py-2 bg-red-100 text-red-600 rounded-lg font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button 
            type="button"
            onClick={() => document.getElementById('cover-image-input')?.click()}
            className="px-6 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium"
          >
            Upload Image
          </button>
        )}
        
        <input
          id="cover-image-input"
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          className="hidden"
        />
      </div>

      {/* Project Scope & Focus */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Project Scope & Focus</h2>
      <div className="mb-8">
        <label className="block font-medium mb-2">Environmental Themes</label>
        <select 
          className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4"
          onChange={(e) => handleInputChange('environmental_themes', { theme: e.target.value })}
        >
          <option value="">Select themes</option>
          <option value="climate_change">Climate Change</option>
          <option value="biodiversity">Biodiversity</option>
          <option value="renewable_energy">Renewable Energy</option>
          <option value="waste_management">Waste Management</option>
          <option value="water_conservation">Water Conservation</option>
        </select>
      </div>

      {/* Timeline & Collaboration */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline & Collaboration</h2>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-2">Start Date *</label>
          <input 
            type="date" 
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4"
            value={formData.start_date}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-2">End Date *</label>
          <input 
            type="date" 
            className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4"
            value={formData.end_date}
            onChange={(e) => handleInputChange('end_date', e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-10">
        <span className="font-medium">Is the project open for collaboration?</span>
        <input 
          type="checkbox" 
          checked={formData.is_open_for_collaboration}
          onChange={(e) => handleInputChange('is_open_for_collaboration', e.target.checked)}
          className="w-5 h-5 accent-[#4BA186]" 
        />
      </div>

      {/* Goals, Targets & Rewards */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Goals, Targets & Rewards</h2>
      <div className="mb-6">
        {goals.map((goal, index) => (
          <div key={index} className="flex gap-2 mb-4">
            <input 
              className="flex-1 border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF]" 
              placeholder="Enter goal"
              value={goal}
              onChange={(e) => handleGoalChange(index, e.target.value)}
            />
            {goals.length > 1 && (
              <button 
                type="button"
                onClick={() => removeGoal(index)}
                className="px-3 py-3 bg-red-100 text-red-600 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button 
          type="button"
          onClick={addGoal}
          className="mt-4 px-4 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium"
        >
          + Add Goal
        </button>
        
        <div className="flex items-center gap-3 mb-4 mt-6">
          <span className="font-medium">Offer Rewards?</span>
          <input 
            type="checkbox" 
            checked={formData.offer_rewards}
            onChange={(e) => handleInputChange('offer_rewards', e.target.checked)}
            className="w-5 h-5 accent-[#4BA186]" 
          />
        </div>
        <label className="block font-medium mb-2">Type of Recognition</label>
        <select 
          className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base mb-4"
          value={formData.recognition_type}
          onChange={(e) => handleInputChange('recognition_type', e.target.value)}
        >
          <option value="">Select recognition type</option>
          <option value="certificate">Certificate</option>
          <option value="badge">Badge</option>
          <option value="award">Award</option>
          <option value="recognition">Recognition</option>
        </select>
        <label className="block font-medium mb-2">Award Criteria</label>
        <textarea 
          className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-base placeholder-[#9CA3AF]" 
          rows={3}
          placeholder="Describe the criteria for earning rewards"
          value={formData.award_criteria}
          onChange={(e) => handleInputChange('award_criteria', e.target.value)}
        />
      </div>

      {/* School & Contact Info */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">School & Contact Info</h2>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-2">Lead School *</label>
          <select 
            className={`w-full border rounded-lg px-4 py-3 text-base mb-4 ${
              getFieldError('lead_school') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            value={formData.lead_school}
            onChange={(e) => handleInputChange('lead_school', e.target.value)}
            required
            disabled={schoolsLoading}
          >
            <option value="">
              {schoolsLoading ? 'Loading schools...' : 'Select a school'}
            </option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name} - {school.city}, {school.country}
              </option>
            ))}
          </select>
          {getFieldError('lead_school') && (
            <p className="text-red-500 text-sm mb-2">{getFieldError('lead_school')}</p>
          )}
          {schools.length === 0 && !schoolsLoading && (
            <p className="text-orange-600 text-sm mb-2">
              No schools found. Please <Link href="/dashboard/schools/new" className="underline">create a school</Link> first.
            </p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">Contact Person Name *</label>
          <input 
            className={`w-full border rounded-lg px-4 py-3 text-base mb-4 ${
              getFieldError('contact_person_name') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            value={formData.contact_person_name}
            onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
            required
          />
          {getFieldError('contact_person_name') && (
            <p className="text-red-500 text-sm mb-2">{getFieldError('contact_person_name')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">Contact Person Email *</label>
          <input 
            type="email"
            className={`w-full border rounded-lg px-4 py-3 text-base mb-4 ${
              getFieldError('contact_person_email') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            value={formData.contact_person_email}
            onChange={(e) => handleInputChange('contact_person_email', e.target.value)}
            required
          />
          {getFieldError('contact_person_email') && (
            <p className="text-red-500 text-sm mb-2">{getFieldError('contact_person_email')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">Contact Person Role *</label>
          <input 
            className={`w-full border rounded-lg px-4 py-3 text-base mb-4 ${
              getFieldError('contact_person_role') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            value={formData.contact_person_role}
            onChange={(e) => handleInputChange('contact_person_role', e.target.value)}
            required
          />
          {getFieldError('contact_person_role') && (
            <p className="text-red-500 text-sm mb-2">{getFieldError('contact_person_role')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">Country *</label>
          <select 
            className={`w-full border rounded-lg px-4 py-3 text-base mb-4 ${
              getFieldError('contact_country') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            value={formData.contact_country}
            onChange={(e) => handleInputChange('contact_country', e.target.value)}
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
          {getFieldError('contact_country') && (
            <p className="text-red-500 text-sm mb-2">{getFieldError('contact_country')}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2">City *</label>
          <input 
            className={`w-full border rounded-lg px-4 py-3 text-base mb-4 ${
              getFieldError('contact_city') ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            value={formData.contact_city}
            onChange={(e) => handleInputChange('contact_city', e.target.value)}
            required
          />
          {getFieldError('contact_city') && (
            <p className="text-red-500 text-sm mb-2">{getFieldError('contact_city')}</p>
          )}
        </div>
      </div>

      {/* Media & Attachments */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Media & Attachments</h2>
      
      {/* Supporting Files Upload */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-[#D1E7DD] rounded-xl p-8 flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-2">Upload Supporting Files</h3>
          <p className="text-gray-500 text-sm mb-4 text-center">PDFs, Word docs, PowerPoint, Excel (Max 10MB each)</p>
          <input
            id="document-files-input"
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            multiple
            onChange={handleDocumentFilesChange}
            className="hidden"
          />
          <button 
            type="button" 
            onClick={() => document.getElementById('document-files-input')?.click()}
            className="px-6 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium hover:bg-[#d4e8dc] transition"
          >
            Choose Files
          </button>
        </div>
        
        {/* Display uploaded documents */}
        {documentFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">{documentFiles.length} file(s) selected</p>
            {documentFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocumentFile(index)}
                  className="ml-4 p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photos/Videos Upload */}
      <div className="mb-10">
        <div className="border-2 border-dashed border-[#D1E7DD] rounded-xl p-8 flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-2">Upload Photos/Videos</h3>
          <p className="text-gray-500 text-sm mb-4 text-center">JPG, PNG, GIF, MP4, MOV (Max 50MB each)</p>
          <input
            id="media-files-input"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaFilesChange}
            className="hidden"
          />
          <button 
            type="button" 
            onClick={() => document.getElementById('media-files-input')?.click()}
            className="px-6 py-2 bg-[#E6F4EA] text-[#4BA186] rounded-lg font-medium hover:bg-[#d4e8dc] transition"
          >
            Choose Media
          </button>
        </div>
        
        {/* Display uploaded media with previews */}
        {mediaFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">{mediaFiles.length} file(s) selected</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : file.type.startsWith('video/') ? (
                      <video 
                        src={URL.createObjectURL(file)} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="mt-1">
                    <p className="text-xs text-gray-900 truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMediaFile(index)}
                    className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-64 mt-8 px-6 py-3 bg-black text-white rounded-lg font-medium text-base flex items-center gap-2 hover:bg-[#222B45] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create a Collaboration'}
        {!loading && (
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M7 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </form>
  );
} 