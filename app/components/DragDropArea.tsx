"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useNetwork } from "../context/NetworkContext";

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
  const { isOnline } = useNetwork();

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
      className={`w-full border-dashed rounded-lg p-6 mb-8 text-center flex flex-col items-center justify-center transition-all ${
        isDragging
          ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30 border-4"
          : !isOnline 
            ? "border-orange-500 bg-orange-100 dark:bg-orange-900/30 border-2" 
            : "border-gray-400 dark:border-gray-600 border-2"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
      data-testid="dragdrop-area"
      role="region"
      aria-label="PDF file upload area"
    >
      {!isOnline && (
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full border border-orange-300 dark:border-orange-700 flex items-center space-x-1">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span>Offline Mode</span>
          </span>
        </div>
      )}
      
      {dragError && (
        <div 
          className="text-red-800 dark:text-red-200 mb-4" 
          aria-live="assertive" 
          role="alert"
        >
          {dragError}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="application/pdf"
        className="hidden"
        multiple
        aria-label="Upload PDF files"
        disabled={isLoading}
      />
      
      {!isLoading ? (
        <>
          <Image
            src="/file.svg"
            alt="Upload PDF icon"
            width={64}
            height={64}
            className="mb-4"
          />
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Drag and drop PDF files here</h2>
          <p className="text-gray-700 dark:text-gray-300">
            or{" "}
            <span 
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" 
              onClick={handleButtonClick}
            >
              click to select PDF files
            </span>
          </p>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Max file size: 100MB</p>
        </>
      ) : (
        <div className="flex flex-col items-center" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" role="status" aria-label="Processing files"></div>
          <p className="text-gray-700 dark:text-gray-300">Processing...</p>
        </div>
      )}
    </div>
  );
}
