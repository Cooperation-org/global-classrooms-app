"use client";

import React from 'react';
import { icons } from '../icons/icons';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12 md:gap-0 justify-between items-start">
        {/* Left: Logo and description */}
        <div className="flex-1 min-w-[220px] flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🌐</span>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg">Global Classrooms</span>
              <span className="text-xs text-gray-300 -mt-1">Environmental Education Platform</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm max-w-xs">
            Transforming environmental education through technology, collaboration, and economic incentives.
          </p>
        </div>
        {/* Middle: Links */}
        <div className="flex-1 flex flex-row gap-16 justify-center min-w-[220px]">
          <div>
            <div className="font-bold mb-2">Home</div>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
              <li><a href="#impact" className="hover:text-white transition">Impact</a></li>
              <li><a href="#gooddollar" className="hover:text-white transition">GoodDollar</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2">Partners</div>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>HomeBiogas</li>
              <li>LinkedTrust</li>
              <li>GoodCollective</li>
            </ul>
          </div>
        </div>
        {/* Right: Subscribe */}
        <div className="flex-1 min-w-[260px] flex flex-col gap-4 items-start md:items-end">
          <div className="font-bold text-2xl mb-2 text-white">Subscribe to get latest updates</div>
          <form className="flex w-full max-w-xs">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-l bg-black border border-gray-600 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r bg-white text-black font-semibold hover:bg-gray-100 transition"
            >
              Subscribe
            </button>
          </form>
          <div className="text-gray-300 text-sm mt-2">Contact: <a href="mailto:email@globalclassroom.com" className="underline">email@globalclassroom.com</a></div>
        </div>
      </div>
    </footer>
  );
} 