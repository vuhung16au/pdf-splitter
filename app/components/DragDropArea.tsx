"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// Set maximum file size to 100MB - same as defined in PdfUploader
const MAX_FILE_SIZE = 100 * 1024 * 1024;

interface DragDropAreaProps {
  onFilesDrop: (files: File[]) => void;
  isLoading: boolean;
}

export default function DragDropArea({ onFilesDrop, isLoading }: DragDropAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isLoading) return;
    
    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );
    
    // Only proceed with files that are valid PDFs and within size limit
    const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE);
    
    if (validFiles.length > 0) {
      onFilesDrop(validFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading || !e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files).filter(
      (file) => file.type === "application/pdf"
    );
    
    // Only proceed with files that are valid PDFs and within size limit
    const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE);
    
    if (validFiles.length > 0) {
      onFilesDrop(validFiles);
    }
  };

  const handleButtonClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`w-full max-w-xl p-8 border-2 border-dashed rounded-lg transition-all ${
        isDragging
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-300 dark:border-gray-700"
      } ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInputChange}
        accept="application/pdf"
        multiple
        disabled={isLoading}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <Image 
          src="/file.svg" 
          alt="Upload PDF" 
          width={64} 
          height={64}
          className="w-16 h-16 text-gray-400 dark:text-gray-600"
        />
        <div className="text-center">
          <p className="mb-2 text-sm font-medium">
            {isLoading ? "Processing..." : "Drag and drop PDF files here"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isLoading 
              ? "Please wait while we split your PDFs" 
              : "or click to select PDF files"
            }
          </p>
        </div>
      </div>
    </div>
  );
}
