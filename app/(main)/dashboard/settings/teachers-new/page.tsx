'use client';
import React, { useState, useRef } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaLink, FaCamera } from 'react-icons/fa';

export default function AddTeacherPage() {
  const [status, setStatus] = useState(true);
  const [inviteChecked, setInviteChecked] = useState(false);
  const [joinLink] = useState('https://join-link.example/abc123');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleProfilePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePic(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Add New Teacher</h2>
        <p className="text-green-700 mb-8">Fill out the following details to register a new teacher. A one-time invitation link will be generated on successful submission.</p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Full Name */}
          <div className="col-span-1">
            <label className="block font-semibold mb-1 flex items-center gap-2"><FaUser className="text-green-500" /> Full Name</label>
            <input type="text" placeholder="Enter full name" className="w-full bg-green-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
          </div>
          {/* Email Address */}
          <div className="col-span-1">
            <label className="block font-semibold mb-1 flex items-center gap-2"><FaEnvelope className="text-green-500" /> Email Address</label>
            <input type="email" placeholder="Enter email address" className="w-full bg-green-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
          </div>
          {/* Mobile Number */}
          <div className="col-span-1">
            <label className="block font-semibold mb-1 flex items-center gap-2"><FaPhone className="text-green-500" /> Mobile Number</label>
            <input type="tel" placeholder="Enter mobile number" className="w-full bg-green-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
          </div>
          {/* Gender */}
          <div className="col-span-1">
            <label className="block font-semibold mb-1 flex items-center gap-2"><FaVenusMars className="text-green-500" /> Gender</label>
            <select className="w-full bg-green-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-200">
              <option>Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          {/* Profile Picture */}
          <div className="col-span-1 flex flex-col gap-2">
            <label className="block font-semibold mb-1 flex items-center gap-2"><FaCamera className="text-green-500" /> Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border-2 border-green-200">
                {profilePic ? (
                  <img src={profilePic} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-3xl text-green-400" />
                )}
              </div>
              <button
                type="button"
                className="bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-100 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload avatar
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </div>
          </div>
          {/* Role */}
          <div className="col-span-1">
            <label className="block font-semibold mb-1 flex items-center gap-2"><FaChalkboardTeacher className="text-green-500" /> Role</label>
            <select className="w-full bg-green-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-200">
              <option>Select role</option>
              <option>Class Teacher</option>
              <option>Subject Teacher</option>
              <option>Admin</option>
            </select>
          </div>
          {/* Assigned Subject(s) */}
          <div className="col-span-1">
            <label className="block font-semibold mb-1 flex items-center gap-2"><FaBook className="text-green-500" /> Assigned Subject(s)</label>
            <select className="w-full bg-green-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-200">
              <option>Select subject</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>History</option>
              <option>English</option>
              <option>Art</option>
            </select>
          </div>
          {/* Assigned Class(es) */}
          <div className="col-span-1">
            <label className="block font-semibold mb-1">Assigned Class(es)</label>
            <select className="w-full bg-green-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-200">
              <option>Select class</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>
          {/* Date of Joining */}
          <div className="col-span-1">
            <label className="block font-semibold mb-1 flex items-center gap-2"><FaCalendarAlt className="text-green-500" /> Date of Joining</label>
            <input type="date" className="w-full bg-green-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-200" />
          </div>
          {/* Status Toggle */}
          <div className="col-span-1 flex items-center gap-4 mt-2">
            <label className="font-semibold">Status</label>
            <span className={`font-semibold ${status ? 'text-green-700' : 'text-gray-400'}`}>{status ? 'Active' : 'Inactive'}</span>
            <button
              type="button"
              aria-label="Toggle Status"
              className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 ${status ? 'bg-green-400' : 'bg-gray-300'}`}
              onClick={() => setStatus(!status)}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${status ? 'translate-x-5' : ''}`}
              />
            </button>
          </div>
          {/* Send invitation email */}
          <div className="col-span-1 flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={inviteChecked}
              onChange={() => setInviteChecked(!inviteChecked)}
              className="w-4 h-4 rounded border-green-400 focus:ring-green-500 accent-green-500"
            />
            <label className="text-gray-700">Send invitation email with join link</label>
          </div>
          {/* One-Time Join Link */}
          <div className="col-span-2">
            <label className="block font-semibold mb-1 flex items-center gap-2"><FaLink className="text-green-500" /> One-Time Join Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinLink}
                readOnly
                className="w-full bg-green-50 rounded-lg px-4 py-3 outline-none"
              />
              <button
                type="button"
                className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
                onClick={() => navigator.clipboard.writeText(joinLink)}
              >
                Copy Link
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition shadow"
            >
              Add Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 