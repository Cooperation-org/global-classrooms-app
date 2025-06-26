'use client'
import React from 'react';
import Link from 'next/link';
import { icons } from '../icons/icons';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', icon: 'home', href: '/dashboard' },
  { label: 'Live Projects', icon: 'projects', href: '/dashboard/projects' },
  { label: 'Schools', icon: 'schools', href: '/dashboard/schools' },
  { label: 'Collaborations', icon: 'collaborations', href: '/dashboard/collaborations', badge: 'New' },
  { label: 'Rewards', icon: 'rewards', href: '/dashboard/rewards', badge: 'New' },
  { label: 'Impact', icon: 'impact', href: '/dashboard/impact' },
  { label: 'Donate', icon: 'donate', href: '/dashboard/donate' },
  { label: 'Settings', icon: 'settings', href: '/dashboard/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col px-6 py-8 z-30">
      <div className="mb-10">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-2xl">🌐</span>
          <div>
            <div className="font-bold text-lg text-green-800">Global Classrooms</div>
            <div className="text-xs text-green-600">Environmental Education<br />Platform</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  <span className="mr-3 text-lg w-5 h-5 flex items-center justify-center">
                    {icons[item.icon as keyof typeof icons]}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-semibold">{item.badge}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 