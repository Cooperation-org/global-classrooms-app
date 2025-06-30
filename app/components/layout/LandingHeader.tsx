import React from 'react';
import Link from 'next/link';
import { icons } from '../icons/icons';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/why-we-exist', label: 'Why We Exist' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/what-we-offer', label: 'What We Offer' },
  { href: '/contact', label: 'Contact' },
];

const LandingHeader: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo and subtitle */}
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-green-600 text-2xl">{icons.globe}</span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg text-gray-900">Global Classrooms</span>
            <span className="text-xs text-green-700 -mt-1">Environmental Education Platform</span>
          </div>
        </Link>
        {/* Nav links */}
        <nav className="hidden md:flex items-center space-x-8 mx-auto">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-gray-700 font-medium hover:text-green-700 transition">
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <Link href="/signin">
            <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 transition">Sign In</button>
          </Link>
          <Link href="/donate">
            <button className="px-4 py-2 rounded bg-black text-white font-medium hover:bg-gray-900 transition">Donate</button>
          </Link>
        </div>
      </div>
      {/* Mobile nav */}
      <nav className="flex md:hidden justify-center pb-2 pt-1 space-x-4 bg-white">
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} className="text-gray-700 font-medium hover:text-green-700 transition text-sm">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default LandingHeader; 