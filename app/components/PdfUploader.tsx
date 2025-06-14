"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { splitPdfToSinglePages, saveSplitPdfAsZip } from "../lib/pdfUtils";
import DragDropArea from "./DragDropArea";
import ErrorBoundary from "./ErrorBoundary";
import { validatePdfFile, sanitizeFilename } from '../lib/validation';
import { trackUpload, trackSplit, trackDownload, trackError } from '../lib/analytics';
import JSZip from 'jszip';
import pdfjsLib from 'pdfjs-dist';

// Set maximum file size to 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;
// Maximum number of files that can be uploaded at once
const MAX_FILES = 10;
// Allowed file types
const ALLOWED_FILE_TYPES = ['application/pdf'];
// Maximum filename length
const MAX_FILENAME_LENGTH = 255;

interface StoredFile {
  id?: number;
  name: string;
  type: string;
  size: number;
  content: ArrayBuffer;
  timestamp: Date;
}

export default function PdfUploader() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const uploaderRef = useRef<HTMLDivElement>(null);

  // Handle files dropped/selected from DragDropArea
  const handleFilesDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length === 0) return;
    const oversized = acceptedFiles.find(f => f.size > MAX_FILE_SIZE);
    if (oversized) {
      const errorMsg = `File \"${oversized.name}\" exceeds the 100MB size limit.`;
      setError(errorMsg);
      trackError(errorMsg, 'file_upload');
      return;
    }
    
    // Track successful upload
    trackUpload(acceptedFiles.length);
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const handleProcessFiles = async () => {
    if (uploadedFiles.length === 0) {
      const errorMsg = "Please upload at least one PDF file";
      setError(errorMsg);
      trackError(errorMsg, 'process_files');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setProcessingStatus("Reading PDF files...");
      
      // Count total pages for analytics
      let totalPages = 0;
      
      for (const file of uploadedFiles) {
        if (!validatePdfFile(file)) {
          const errorMsg = `File \"${file.name}\" is not a valid PDF`;
          trackError(errorMsg, 'pdf_validation');
          throw new Error(errorMsg);
        }
      }
      
      setProcessingStatus("Splitting pages...");
      const zipBlob = await splitPdfToSinglePages(uploadedFiles).catch(err => {
        console.error("Error while splitting PDFs:", err);
        trackError(`Failed to split PDF: ${err.message || 'Unknown error'}`, 'pdf_splitting');
        throw new Error(`Failed to split PDF: ${err.message || 'Unknown error'}`);
      });
      
      // Track successful split
      trackSplit(uploadedFiles.length);
      
      setProcessingStatus("Creating ZIP archive...");
      await saveSplitPdfAsZip(zipBlob).catch(err => {
        console.error("Error while creating ZIP:", err);
        trackError(`Failed to create ZIP file: ${err.message || 'Unknown error'}`, 'zip_creation');
        throw new Error(`Failed to create ZIP file: ${err.message || 'Unknown error'}`);
      });
      
      // Track download
      trackDownload();
      
      setProcessingStatus("Done! Your download should start automatically.");
      setTimeout(() => {
        setProcessingStatus("");
      }, 3000);
    } catch (err) {
      console.error("Error processing PDFs:", err);
      const errorMsg = `${err instanceof Error ? err.message : "Error processing PDF files. Please try again."}`;
      setError(errorMsg);
      trackError(errorMsg, 'pdf_processing');
    } finally {
      setIsLoading(false);
      await new Promise(res => setTimeout(res, 3000));
    }
  };

  const clearFiles = () => {
    setUploadedFiles([]);
    setError(null);
    setProcessingStatus("");
  };

  // Touch event handlers for mobile test
  const handleTouchStart = () => {
    uploaderRef.current?.classList.add("active");
  };
  const handleTouchEnd = () => {
    uploaderRef.current?.classList.remove("active");
  };

  return (
    <ErrorBoundary>
      <div 
        className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6 px-2 sm:px-4 md:px-0" 
        data-testid="pdf-uploader" 
        role="region" 
        aria-label="PDF file upload and processing area"
        tabIndex={0}
        ref={uploaderRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <DragDropArea onFilesDrop={handleFilesDrop} isLoading={isLoading} />

        {/* Only show error for processing, not for file drop (handled by DragDropArea) */}
        {error && (
          <div 
            className="w-full max-w-xl text-center p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div
            className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            role="region"
            aria-labelledby="selected-files-heading"
            data-testid="selected-files-section"
          >
            <h2
              id="selected-files-heading"
              className="text-lg font-medium mb-2 flex items-center justify-between text-gray-900 dark:text-gray-100"
              data-testid="selected-files-title"
            >
              Selected Files ({uploadedFiles.length})
              {!navigator.onLine && (
                <span className="text-xs font-normal px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 rounded-full">
                  Offline Mode
                </span>
              )}
            </h2>
            <ul 
              className="max-h-40 overflow-y-auto min-w-[220px] sm:min-w-[320px] md:min-w-[400px]"
              aria-label="List of selected PDF files"
              data-testid="selected-files-list"
            >
              {uploadedFiles.map((file, index) => (
                <li
                  key={index}
                  className="text-sm py-1 flex justify-between items-center text-gray-700 dark:text-gray-300 min-w-0"
                  data-testid="selected-file-item"
                >
                  <span className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] pr-4" data-testid="selected-file-name">{file.name}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mr-2" aria-label={`Size: ${(file.size / 1024).toFixed(1)} kilobytes`} data-testid="selected-file-size">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  <button
                    className="ml-2 px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => {
                      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                    }}
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex mt-4 space-x-3 flex-col sm:flex-row">
              <button
                onClick={handleProcessFiles}
                disabled={isLoading}
                className={`flex-1 ${!navigator.onLine ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'} text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-2 sm:mb-0`}
                aria-label="Split PDF files into individual pages"
                aria-busy={isLoading}
                data-testid="split-button"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2" role="status" aria-label="Processing">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    Processing...
                  </>
                ) : (
                  "Split PDFs"
                )}
              </button>
              <button
                onClick={clearFiles}
                disabled={isLoading}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Clear selected files"
                data-testid="clear-button"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {processingStatus && (
          <div 
            className={`w-full max-w-xl text-center p-3 ${
              !navigator.onLine ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
            } rounded-lg`}
            aria-live="polite"
            role="status"
          >
            {processingStatus}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
