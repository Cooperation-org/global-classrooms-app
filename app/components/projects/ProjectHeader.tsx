import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ProjectHeaderProps {
  title: string;
}

export function ProjectHeader({ title }: ProjectHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
        <span className="text-blue-600 font-medium">Projects</span>
        <span>/</span>
        <span>Project: {title}</span>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Projects</span>
        </button>
      </div>
    </div>
  );
} 