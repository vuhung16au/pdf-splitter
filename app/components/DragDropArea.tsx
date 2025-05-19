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
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(true);
      setDragError(null);
    }
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

  const validateFiles = (files: File[]): File[] => {
    // Filter for PDFs and check sizes
    const pdfFiles = files.filter(file => file.type === "application/pdf");
    
    // Show an error if non-PDF files were selected
    if (pdfFiles.length < files.length) {
      setDragError("Some files were not PDFs and were ignored");
    }
    
    // If no valid files, show error
    if (pdfFiles.length === 0) {
      setDragError("Please select PDF files only");
      return [];
    }
    
    // Filter out files that are too large
    const validFiles = pdfFiles.filter(file => file.size <= MAX_FILE_SIZE);
    
    // Show error if some files were too large
    if (validFiles.length < pdfFiles.length) {
      setDragError("Some files exceeded the 100MB size limit and were ignored");
    }
    
    return validFiles;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragError(null);
    
    if (isLoading) return;
    
    try {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(files);
      
      if (validFiles.length > 0) {
        onFilesDrop(validFiles);
      }
    } catch (error) {
      console.error("Error handling dropped files:", error);
      setDragError("Failed to process the dropped files");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading || !e.target.files || e.target.files.length === 0) return;
    
    setDragError(null);
    
    try {
      const files = Array.from(e.target.files);
      const validFiles = validateFiles(files);
      
      if (validFiles.length > 0) {
        onFilesDrop(validFiles);
      }
    } catch (error) {
      console.error("Error handling selected files:", error);
      setDragError("Failed to process the selected files");
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
          : dragError 
            ? "border-red-400 bg-red-50 dark:bg-red-900/10"
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
          
          {dragError && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              {dragError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
