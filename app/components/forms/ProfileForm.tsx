import React, { useEffect, useState } from 'react';
import { fetchUserProfile, updateUserProfile } from '@/app/services/api';

const initialState = {
  first_name: '',
  last_name: '',
  mobile_number: '',
  gender: '',
  date_of_birth: '',
  profile_picture: '',
  city: '',
  country: '',
};

export default function ProfileForm() {
  const [profile, setProfile] = useState(initialState);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUserProfile()
      .then((data: unknown) => {
        if (typeof data === 'object' && data !== null) {
          setProfile({ ...profile, ...data } as typeof profile);
          setError('');
        } else {
          setError('Invalid profile data');
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to fetch profile'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (profilePictureFile) {
      const url = URL.createObjectURL(profilePictureFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [profilePictureFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file' && e.target instanceof HTMLInputElement && e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      let result;
      if (profilePictureFile) {
        // Use FormData for file upload
        const formData = new FormData();
        Object.entries(profile).forEach(([key, value]) => {
          if (key !== 'profile_picture') formData.append(key, value || '');
        });
        formData.append('profile_picture', profilePictureFile);
        result = await updateUserProfile(formData);
      } else {
        result = await updateUserProfile(profile);
      }
      setSuccess(true);
      // Optionally update profile picture preview after upload
      if (result && typeof result === 'object' && 'profile_picture' in result && typeof (result as { profile_picture?: string }).profile_picture === 'string') {
        setProfile(prev => ({ ...prev, profile_picture: (result as { profile_picture: string }).profile_picture }));
        setProfilePictureFile(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-8 text-center">Loading profile...</div>;
  if (error) return <div className="py-8 text-center text-red-600">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-green-800">Your Profile</h2>
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border mb-2 bg-gray-100 flex items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Profile preview" className="object-cover w-full h-full" />
          ) : profile.profile_picture ? (
            <img src={profile.profile_picture} alt="Profile" className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-400 text-4xl">👤</span>
          )}
        </div>
        <label className="block text-sm font-medium mb-1">Profile Picture</label>
        <input type="file" name="profile_picture" accept="image/*" onChange={handleChange} className="block w-full text-sm" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input name="first_name" value={profile.first_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input name="last_name" value={profile.last_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number</label>
          <input name="mobile_number" value={profile.mobile_number || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select name="gender" value={profile.gender || ''} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input type="date" name="date_of_birth" value={profile.date_of_birth || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input name="city" value={profile.city || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input name="country" value={profile.country || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <button type="submit" className="w-full py-3 rounded bg-green-700 text-white font-semibold hover:bg-green-800 transition" disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      {success && <div className="text-green-600 text-center">Profile updated successfully!</div>}
    </form>
  );
} 