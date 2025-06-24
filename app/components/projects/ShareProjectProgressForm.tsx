import React, { useRef, useState } from 'react';

export function ShareProjectProgressForm({ onCancel }: { onCancel: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(selected: FileList | null) {
    if (selected) {
      setFiles(Array.from(selected));
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
  }

  return (
    <form className="max-w-2xl">
      <h2 className="text-2xl font-bold text-[#222B45] mb-8">Share Project Progress</h2>
      <div className="mb-6">
        <label className="block text-[#222B45] font-medium mb-2">Update Title</label>
        <input type="text" placeholder="Title" className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#222B45] focus:outline-none focus:ring-2 focus:ring-[#1A7F4F]" />
      </div>
      <div className="mb-6">
        <label className="block text-[#222B45] font-medium mb-2">Description</label>
        <textarea placeholder="Description" rows={4} className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#222B45] focus:outline-none focus:ring-2 focus:ring-[#1A7F4F]" />
      </div>
      <div className="mb-6">
        <label className="block text-[#222B45] font-medium mb-2">Select Phase</label>
        <select className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#222B45] focus:outline-none focus:ring-2 focus:ring-[#1A7F4F]">
          <option value="">Select Project Phase</option>
          <option value="phase1">Phase 1</option>
          <option value="phase2">Phase 2</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-[#222B45] font-medium mb-2">Upload Media</label>
        <div
          className={`border-2 border-dashed border-[#B6F0C2] rounded-lg p-8 text-center mb-2 transition-colors ${dragActive ? 'bg-[#E6F4EA]' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="font-semibold mb-2">Drag and drop files here or browse</div>
          <div className="text-sm text-[#6B7280] mb-4">Supported formats: Images (JPG, PNG), Videos (MP4), Documents (PDF, DOCX, XLSX). Max file size: 50MB per file.</div>
          <button
            type="button"
            className="px-4 py-2 bg-[#E5E7EB] rounded font-medium text-[#222B45]"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </button>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
            accept="image/*,video/mp4,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          />
        </div>
        {files.length > 0 && (
          <ul className="mt-2 text-left text-sm">
            {files.map((file, i) => (
              <li key={i} className="truncate">{file.name}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-[#222B45] font-medium mb-2">Date of Progress Update</label>
        <input type="date" className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#222B45] focus:outline-none focus:ring-2 focus:ring-[#1A7F4F]" />
      </div>
      <div className="mb-8">
        <label className="block text-[#222B45] font-medium mb-2">Tags</label>
        <input type="text" placeholder="Optional Tags (e.g., field trip, plantation)" className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#1A7F4F] focus:outline-none focus:ring-2 focus:ring-[#1A7F4F]" />
      </div>
      <div className="flex gap-4">
        <button type="submit" className="px-6 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-900">Submit Update for Review</button>
        <button type="button" className="px-6 py-2 bg-[#E5E7EB] text-[#222B45] rounded-full font-medium text-sm" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
} 