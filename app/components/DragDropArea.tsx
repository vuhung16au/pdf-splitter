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
      className={`w-full border-dashed rounded-lg p-6 mb-8 text-center flex flex-col items-center justify-center transition-all ${
        isDragging
          ? "border-blue-500 bg-blue-50 border-4"
          : "border-gray-300 border-2"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
      data-testid="pdf-uploader"
      role="region"
      aria-label="PDF file upload area"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleButtonClick();
        }
      }}
    >
      {dragError && (
        <div className="text-red-500 mb-4" aria-live="assertive" role="alert">
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
          <h2 className="text-xl font-semibold mb-2">Drag and drop PDF files here</h2>
          <p className="text-gray-600">
            or{" "}
            <span className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" tabIndex={0} role="button" aria-label="click to select PDF files">
              click to select PDF files
            </span>
          </p>
          <p className="mt-4 text-sm text-gray-500">Max file size: 100MB</p>
        </>
      ) : (
        <div className="flex flex-col items-center" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Processing...</p>
        </div>
      )}
    </div>
  );
}
