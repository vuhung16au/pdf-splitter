"use client";

import { useState, useEffect } from "react";
import { splitPdfToSinglePages, saveSplitPdfAsZip } from "../lib/pdfUtils";
import DragDropArea from "./DragDropArea";
import ErrorBoundary from "./ErrorBoundary";
import { useNetwork } from "../context/NetworkContext";
import OfflineStorage from "../lib/offlineStorage";

// Set maximum file size to 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

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
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);
  const { isOnline, addPendingOperation } = useNetwork();

  // Initialize offline storage and load any stored files when component mounts
  useEffect(() => {
    const initStorage = async () => {
      // Initialize the storage system
      await OfflineStorage.init();

      // Load any previously stored files from offline storage
      try {
        const files = await OfflineStorage.getFiles();
        setStoredFiles(files);

        // If we're back online and have pending operations, we could process them here
        if (isOnline && files.length > 0) {
          setProcessingStatus("Found files saved from your previous offline session");
        }
      } catch (err) {
        console.error("Error loading offline files:", err);
      }
    };

    initStorage();

    // Listen for online events to process stored operations
    const handleOnline = async () => {
      // When we come back online, check for pending operations
      try {
        const operations = await OfflineStorage.getOperations();
        if (operations.length > 0) {
          setProcessingStatus(`Found ${operations.length} pending operation(s) from offline mode`);
          // Process operations here if needed
          await OfflineStorage.clearAllOperations();
        }
      } catch (err) {
        console.error("Error processing pending operations:", err);
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [isOnline]);

  const handleFilesDrop = (files: File[]) => {
    // Check for file size limits
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map((file) => file.name).join(", ");
      setError(`File size exceeds the limit (100MB): ${fileNames}`);
      // Filter out oversized files
      const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);
      setUploadedFiles(validFiles);
      return;
    }

    setUploadedFiles(files);
    setError(null);
  };

  const handleProcessFiles = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload at least one PDF file");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Store files in offline storage for later use
      for (const file of uploadedFiles) {
        try {
          await OfflineStorage.storeFile(file);
        } catch (error) {
          console.warn("Could not store file for offline use:", error);
          // Continue even if storage fails
        }
      }

      // Check if we're online before proceeding with network operations
      if (!isOnline) {
        // If offline, store the operation for later and show offline message
        addPendingOperation({
          type: 'splitPdf',
          data: {
            fileNames: uploadedFiles.map(file => file.name)
          }
        });
        
        await OfflineStorage.addOperation({
          type: 'splitPdf',
          data: {
            fileNames: uploadedFiles.map(file => file.name)
          }
        });
        
        setProcessingStatus("You're offline. Files saved and will be processed when you're back online.");
        setTimeout(() => {
          setIsLoading(false);
          // Don't clear files when offline, so they can be processed later
        }, 500);
        return;
      }
      
      setProcessingStatus("Reading PDF files...");

      // Validate PDF files
      for (const file of uploadedFiles) {
        if (file.type !== 'application/pdf') {
          throw new Error(`File "${file.name}" is not a valid PDF`);
        }
      }

      // Split the PDFs into pages
      setProcessingStatus("Splitting pages...");
      const zipBlob = await splitPdfToSinglePages(uploadedFiles).catch(err => {
        console.error("Error while splitting PDFs:", err);
        throw new Error(`Failed to split PDF: ${err.message || 'Unknown error'}`);
      });

      // Create and save the ZIP file
      setProcessingStatus("Creating ZIP archive...");
      await saveSplitPdfAsZip(zipBlob).catch(err => {
        console.error("Error while creating ZIP:", err);
        throw new Error(`Failed to create ZIP file: ${err.message || 'Unknown error'}`);
      });

      setProcessingStatus("Done! Your download should start automatically.");

      // Reset after successful processing
      setTimeout(() => {
        setProcessingStatus("");
      }, 3000);
    } catch (err) {
      console.error("Error processing PDFs:", err);
      setError(`${err instanceof Error ? err.message : "Error processing PDF files. Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFiles = () => {
    setUploadedFiles([]);
    setError(null);
    setProcessingStatus("");
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md text-red-700 dark:text-red-400 max-w-xl w-full">
          <h3 className="font-medium mb-2">PDF Processing Error</h3>
          <p className="text-sm mb-4">There was an error processing your PDF files. This could be due to a corrupted PDF or insufficient memory.</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6" data-testid="pdf-uploader">
        <DragDropArea onFilesDrop={handleFilesDrop} isLoading={isLoading} />

        {error && (
          <div 
            className="w-full max-w-xl text-center p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div 
            className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            aria-labelledby="selected-files-heading"
          >
            <h3 
              id="selected-files-heading" 
              className="text-lg font-medium mb-2 flex items-center justify-between"
            >
              Selected Files ({uploadedFiles.length})
              {!isOnline && (
                <span className="text-xs font-normal px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                  Offline Mode
                </span>
              )}
            </h3>
            <ul 
              className="max-h-40 overflow-y-auto" 
              aria-label="List of selected PDF files"
            >
              {uploadedFiles.map((file, index) => (
                <li
                  key={index}
                  className="text-sm py-1 flex justify-between items-center"
                >
                  <span className="truncate max-w-[300px] pr-4">{file.name}</span>
                  <span className="text-xs text-gray-500" aria-label={`Size: ${(file.size / 1024).toFixed(1)} kilobytes`}>
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex mt-4 space-x-3">
              <button
                onClick={handleProcessFiles}
                disabled={isLoading}
                className={`flex-1 ${!isOnline ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'} text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                aria-label="Split PDF files into individual pages"
                aria-busy={isLoading}
              >
                {isLoading ? "Processing..." : "Split PDFs"}
              </button>

              <button
                onClick={clearFiles}
                disabled={isLoading}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-md transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Clear selected files"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Show stored files from offline mode if any */}
        {storedFiles.length > 0 && isOnline && (
          <div 
            className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-green-300"
            aria-labelledby="saved-files-heading"
          >
            <h3 
              id="saved-files-heading" 
              className="text-lg font-medium mb-2 flex items-center justify-between"
            >
              <span>Previously Saved Files ({storedFiles.length})</span>
              <span className="text-xs font-normal px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Available Offline
              </span>
            </h3>
            <ul 
              className="max-h-32 overflow-y-auto" 
              aria-label="List of saved PDF files"
            >
              {storedFiles.map((fileData, index) => (
                <li
                  key={index}
                  className="text-sm py-1 flex justify-between items-center"
                >
                  <span className="truncate max-w-[300px] pr-4">{fileData.name}</span>
                  <span className="text-xs text-gray-500">
                    {(fileData.size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex mt-4 justify-end">
              <button
                onClick={() => OfflineStorage.clearAllOperations()}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear Storage
              </button>
            </div>
          </div>
        )}

        {processingStatus && (
          <div 
            className={`w-full max-w-xl text-center p-3 ${
              !isOnline ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            } rounded-lg`}
            aria-live="polite"
            role="status"
          >
            {processingStatus}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
