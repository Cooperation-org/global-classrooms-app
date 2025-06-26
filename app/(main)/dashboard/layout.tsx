import React from 'react';
import Sidebar from '@/app/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64  min-h-screen">
        {children}
      </main>
    </div>
  );
} 