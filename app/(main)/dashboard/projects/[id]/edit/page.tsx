'use client'
import React, { useState, useEffect } from 'react';
import { updateProject, CreateProjectRequest, fetchSchools, School, fetchProjectById, Project } from '@/app/services/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
  const [existingCoverImage, setExistingCoverImage] = useState<string>('');

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setInitialLoading(true);
        const project = await fetchProjectById(projectId);
        
        // Populate form with existing project data
        setFormData({
          title: project.title,
          short_description: project.short_description,
          detailed_description: project.detailed_description,
          environmental_themes: project.environmental_themes,
          start_date: project.start_date,
          end_date: project.end_date,
          is_open_for_collaboration: project.is_open_for_collaboration,
          offer_rewards: project.offer_rewards,
          recognition_type: project.recognition_type,
          award_criteria: project.award_criteria,
          lead_school: project.lead_school,
          contact_person_name: project.contact_person_name,
          contact_person_email: project.contact_person_email,
          contact_person_role: project.contact_person_role,
          contact_country: project.contact_country,
          contact_city: project.contact_city,
        });
        
        // Set existing cover image
        if (project.cover_image) {
          setExistingCoverImage(project.cover_image);
        }
        
        // Set goals (you may need to adjust this based on your API response)
        if (project.goals && Array.isArray(project.goals)) {
          setGoals(project.goals);
        }
        
      } catch (err) {
        console.error('Failed to load project:', err);
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setInitialLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  // Load schools
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Filter out empty goals
      const filteredGoals = goals.filter(goal => goal.trim() !== '');

      const projectData: Partial<CreateProjectRequest> = {
        ...formData,
        cover_image: coverImage || undefined,
        goals: filteredGoals,
      };

      await updateProject(projectId, projectData);
      
      // Redirect to the project details page
      router.push(`/dashboard/projects/${projectId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      
      // Check if it's an API error with field details
      if (err instanceof Error && errorMessage.includes('Bad request')) {
        try {
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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  const currentCoverImage = coverImagePreview || existingCoverImage;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Project</h1>
          <p className="text-[#4BA186]">Update your environmental initiative details.</p>
        </div>
        <Link 
          href={`/dashboard/projects/${projectId}`}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>

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
        
        {currentCoverImage ? (
          <div className="w-full max-w-md">
            <img 
              src={currentCoverImage} 
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
          value={Object.values(formData.environmental_themes || {})[0] || ''}
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

      <div className="flex gap-4">
        <button 
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded-lg font-medium text-base flex items-center gap-2 hover:bg-[#222B45] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Project'}
        </button>
        <Link
          href={`/dashboard/projects/${projectId}`}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-base hover:bg-gray-50 transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
