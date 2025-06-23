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
      <main className="ml-64 flex flex-col items-center justify-center min-h-screen">
        {children}
      </main>
    </div>
  );
} 