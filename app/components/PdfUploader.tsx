"use client";

import { useState } from "react";
import { splitPdfToSinglePages, saveSplitPdfAsZip } from "../lib/pdfUtils";
import DragDropArea from "./DragDropArea";

export default function PdfUploader() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("");

  const handleFilesDrop = (files: File[]) => {
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
      setProcessingStatus("Reading PDF files...");
      
      // Calculate total pages for progress indication
      setProcessingStatus("Splitting pages...");
      
      // Process the PDF files
      const zipBlob = await splitPdfToSinglePages(uploadedFiles);
      
      setProcessingStatus("Creating ZIP archive...");
      
      // Save the zip file
      await saveSplitPdfAsZip(zipBlob);
      
      setProcessingStatus("Done! Your download should start automatically.");
      
      // Reset after successful processing
      setTimeout(() => {
        setProcessingStatus("");
      }, 3000);
    } catch (err) {
      console.error("Error processing PDFs:", err);
      setError("Error processing PDF files. Please try again.");
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
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6">
      <DragDropArea onFilesDrop={handleFilesDrop} isLoading={isLoading} />
      
      {uploadedFiles.length > 0 && (
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">
            Selected Files ({uploadedFiles.length})
          </h3>
          <ul className="max-h-40 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="text-sm py-1 flex justify-between items-center">
                <span className="truncate max-w-[300px] pr-4">{file.name}</span>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </li>
            ))}
          </ul>
          
          <div className="flex mt-4 space-x-3">
            <button
              onClick={handleProcessFiles}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:bg-blue-400"
            >
              {isLoading ? "Processing..." : "Split PDFs"}
            </button>
            
            <button
              onClick={clearFiles}
              disabled={isLoading}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      
      {processingStatus && (
        <div className="w-full max-w-xl text-center p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
          {processingStatus}
        </div>
      )}
      
      {error && (
        <div className="w-full max-w-xl text-center p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
