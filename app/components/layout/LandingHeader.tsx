'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

// Utility function for smooth scrolling with header offset
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 72; // Height of the sticky header
    const elementPosition = element.offsetTop - headerHeight;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

interface NavLink {
  href?: string;
  sectionId?: string;
  label: string;
  type: 'link' | 'scroll';
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', type: 'link' },
  { sectionId: 'why-we-exist', label: 'Why We Exist', type: 'scroll' },
  { sectionId: 'how-it-works', label: 'How It Works', type: 'scroll' },
  { sectionId: 'what-we-offer', label: 'What We Offer', type: 'scroll' },
  { href: '/projects', label: 'Projects', type: 'link' },
  { href: '/impact', label: 'Impact', type: 'link' },
  { href: '/contact', label: 'Contact', type: 'link' },
];

const LandingHeader: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo and subtitle */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg text-gray-900">EGR</span>
            <span className="text-xs text-green-700 -mt-1">Educating Global Resilience</span>
          </div>
        </Link>
        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center space-x-8 mx-auto">
          {navLinks.map(link => (
            link.type === 'scroll' ? (
              <button
                key={link.sectionId}
                onClick={() => scrollToSection(link.sectionId!)}
                className="text-gray-700 font-medium hover:text-green-700 transition"
              >
                {link.label}
              </button>
            ) : (
              <Link key={link.href} href={link.href!} className="text-gray-700 font-medium hover:text-green-700 transition">
                {link.label}
              </Link>
            )
          ))}
        </nav>
        {/* Buttons (desktop) */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">{user?.name || 'User'}</span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link 
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
              <Link href="/donate">
                <button className="px-4 py-2 rounded bg-black text-white font-medium hover:bg-gray-900 transition">Donate</button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signin">
                <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 transition">Sign In</button>
              </Link>
              <Link href="/donate">
                <button className="px-4 py-2 rounded bg-black text-white font-medium hover:bg-gray-900 transition">Donate</button>
              </Link>
            </>
          )}
        </div>
        {/* Hamburger (mobile) */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex flex-col" onClick={() => setMobileOpen(false)}>
          <nav
            className="bg-white w-full max-w-xs h-full shadow-xl p-6 flex flex-col animate-slide-in-left relative"
            style={{ minWidth: 260 }}
            onClick={e => e.stopPropagation()}
            aria-label="Mobile menu"
          >
            <button
              className="absolute top-4 right-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center space-x-3 mb-8 mt-2">
              <div className="w-8 h-8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-lg text-gray-900">EGR</span>
                <span className="text-xs text-green-700 -mt-1">Educating Global Resilience</span>
              </div>
            </div>
            <div className="flex flex-col space-y-4 mb-8">
              {navLinks.map(link => (
                link.type === 'scroll' ? (
                  <button
                    key={link.sectionId}
                    onClick={() => {
                      scrollToSection(link.sectionId!);
                      setMobileOpen(false);
                    }}
                    className="text-gray-700 font-medium hover:text-green-700 transition text-lg text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className="text-gray-700 font-medium hover:text-green-700 transition text-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
            <div className="flex flex-col space-y-3 mt-auto">
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white shadow-md">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user?.name || 'User'}</div>
                      <div className="text-sm text-gray-500 capitalize">{user?.role || 'Member'}</div>
                    </div>
                  </div>
                  
                  {/* Dashboard Link */}
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Go to Dashboard</span>
                    </button>
                  </Link>
                  
                  {/* Donate Button */}
                  <Link href="/donate" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-4 py-2 rounded bg-black text-white font-medium hover:bg-gray-900 transition">Donate</button>
                  </Link>
                  
                  {/* Sign Out Button */}
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded border border-red-300 bg-white text-red-600 font-medium hover:bg-red-50 transition flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50 transition">Sign In</button>
                  </Link>
                  <Link href="/donate" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-4 py-2 rounded bg-black text-white font-medium hover:bg-gray-900 transition">Donate</button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader; 