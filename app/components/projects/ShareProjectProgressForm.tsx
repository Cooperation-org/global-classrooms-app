import React, { useRef, useState } from 'react';
import { createProjectUpdate, uploadFile } from '@/app/services/api';

interface ShareProjectProgressFormProps {
  projectId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function ShareProjectProgressForm({ projectId, onCancel, onSuccess }: ShareProjectProgressFormProps) {
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function removeFile(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Step 1: Upload all files first using POST /upload/image/ or /upload/document/
      // These endpoints accept FormData and return file URLs
      const uploadedFileUrls: string[] = [];
      
      if (files.length > 0) {
        console.log(`Uploading ${files.length} file(s) using /upload/image/ or /upload/document/`);
        const uploadPromises = files.map(async (file, index) => {
          console.log(`Uploading file ${index + 1}: ${file.name} (${file.type})`);
          try {
            const fileUrl = await uploadFile(file);
            console.log(`File ${index + 1} uploaded successfully: ${fileUrl}`);
            return fileUrl;
          } catch (error) {
            console.error(`Failed to upload file ${index + 1}:`, error);
            throw error;
          }
        });
        
        const urls = await Promise.all(uploadPromises);
        uploadedFileUrls.push(...urls);
        console.log('All file URLs to include in update:', uploadedFileUrls);
      }

      // Step 2: Create the project update with description and file URLs
      // POST /projects/{projectId}/updates/ expects JSON with uploaded_files as array of strings
      console.log('Creating project update with:', {
        description: description.trim(),
        uploaded_files: uploadedFileUrls
      });
      
      await createProjectUpdate(projectId, {
        description: description.trim(),
        uploaded_files: uploadedFileUrls,
      });
      
      console.log('Project update created successfully');

      // Reset form
      setDescription('');
      setFiles([]);
      
      // Call success callback to refresh updates
      if (onSuccess) {
        onSuccess();
      }
      
      // Close form
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project update');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="max-w-2xl" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-[#222B45] mb-8">Share Project Progress</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-[#222B45] font-medium mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea 
          placeholder="Describe the progress update..." 
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#222B45] focus:outline-none focus:ring-2 focus:ring-[#1A7F4F]" 
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-[#222B45] font-medium mb-2">Upload Files (Optional)</label>
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
        {files.length > 0 && (
          <div className="mt-2 space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span className="truncate flex-1">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="ml-2 text-red-600 hover:text-red-800"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button 
          type="submit" 
          className="px-6 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || !description.trim()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Update'}
        </button>
        <button 
          type="button" 
          className="px-6 py-2 bg-[#E5E7EB] text-[#222B45] rounded-full font-medium text-sm disabled:opacity-50"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 