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
  const [lastTap, setLastTap] = useState<number | null>(null);
  const doubleTapTimeout = useRef<NodeJS.Timeout | null>(null);
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
    // Filter for PDFs
    const pdfFiles = files.filter(file => file.type === "application/pdf");

    // Check for non-PDF files
    const hasNonPdf = pdfFiles.length < files.length;

    // Check for oversized PDFs
    const oversizedFiles = pdfFiles.filter(file => file.size > MAX_FILE_SIZE);

    // If no valid PDFs
    if (pdfFiles.length === 0) {
      setDragError("Please select PDF files only");
      return [];
    }

    // Show error if any PDF is too large (priority)
    if (oversizedFiles.length > 0) {
      setDragError("File size exceeds limit");
      return [];
    }

    // Show error if some files were not PDFs
    if (hasNonPdf) {
      setDragError("Some files were not PDFs and were ignored");
    }

    return pdfFiles;
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

  // Double tap handler for mobile gesture
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      // Double tap detected
      setLastTap(null);
      if (doubleTapTimeout.current) {
        clearTimeout(doubleTapTimeout.current);
        doubleTapTimeout.current = null;
      }
      // TODO: Replace this with your desired double tap action
      window.alert("Double tap detected!");
      return;
    }
    setLastTap(now);
    if (doubleTapTimeout.current) {
      clearTimeout(doubleTapTimeout.current);
    }
    doubleTapTimeout.current = setTimeout(() => {
      setLastTap(null);
    }, 350);
  };

  return (
    <div
      className={`w-full max-w-xs sm:max-w-md md:max-w-xl border-dashed rounded-lg p-4 sm:p-6 mb-8 text-center flex flex-col items-center justify-center transition-all ${
        isDragging
          ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30 border-4"
          : "border-gray-400 dark:border-gray-600 border-2"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
      onTouchEnd={handleTouchEnd}
      data-testid="dragdrop-area"
      role="region"
      aria-label="PDF file upload area"
    >
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
