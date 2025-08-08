"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface FileUploadProps {
  onChange: (files: FileList | null) => void;
  accept?: string;
  className?: string;
  label?: string;
  multiple?: boolean;
}

export function FileUpload({ onChange, accept, className = "", label = "Choose file", multiple = false }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0].name);
    } else {
      setSelectedFile(null);
    }
    onChange(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileChange(files);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileChange(e.target.files)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer
          ${isDragOver 
            ? "border-blue-400 bg-blue-50" 
            : selectedFile 
              ? "border-green-400 bg-green-50" 
              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
          }
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <svg
            className={`w-8 h-8 ${
              selectedFile ? "text-green-500" : isDragOver ? "text-blue-500" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {selectedFile ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            )}
          </svg>
          
          {selectedFile ? (
            <div>
              <p className="text-sm font-medium text-green-700">File selected:</p>
              <p className="text-xs text-green-600 truncate max-w-[200px]">{selectedFile}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isDragOver ? "Drop file here" : label}
              </p>
              <p className="text-xs text-gray-500">
                {isDragOver ? "" : "or drag and drop"}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}