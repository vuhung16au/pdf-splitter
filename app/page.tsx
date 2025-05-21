import Image from "next/image";
import PdfUploader from "./components/PdfUploader";
import { Suspense } from "react";

// Error fallback component for the Suspense boundary
const PdfUploaderFallback = () => (
  <div 
    role="status" 
    aria-label="Loading PDF uploader"
    className="w-full flex items-center justify-center p-8 border-2 border-dashed rounded-lg border-gray-400 dark:border-gray-600"
  >
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-md"></div>
      <div className="space-y-2">
        <div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
        <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <div 
      className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen px-2 sm:px-6 pb-16 gap-6 sm:gap-10 font-sans bg-white dark:bg-gray-950"
      role="main"
      style={{
        WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
        overscrollBehavior: 'contain', // Prevent scroll chaining
        willChange: 'scroll-position', // Hint for smooth scrolling
      }}
    >
      {/* Safari support notice */}
      <div className="w-full max-w-2xl mx-auto mt-4 mb-2">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded" role="alert">
          <strong>Notice (21 May 2025):</strong> Our PDF Splitter doesn't support Safari.
        </div>
      </div>
      
      <header className="w-full max-w-2xl text-center mt-6 sm:mt-8">
        <h1 className="text-xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">PDF Splitter</h1>
        <p className="text-xs sm:text-base text-gray-700 dark:text-gray-300">
          Split multi-page PDF files into single-page PDFs and download as a zip
        </p>
      </header>
      
      <main className="flex flex-col gap-6 sm:gap-8 row-start-2 items-center w-full max-w-2xl mx-auto">
        <Suspense fallback={<PdfUploaderFallback />}>
          <div className="w-full">
            <PdfUploader />
          </div>
        </Suspense>
        
        <div 
          className="max-w-2xl w-full text-sm text-gray-700 dark:text-gray-300 mt-4 p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
          role="region"
          aria-label="How it works"
        >
          <h3 className="font-medium mb-2 text-center text-gray-900 dark:text-gray-100">How it works</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Upload one or more PDF files by dragging them into the upload area or clicking to browse (100MB max per file)</li>
            <li>Click &quot;Split PDFs&quot; to process your files</li>
            <li>Each page of your PDFs will be extracted as a separate PDF file</li>
            <li>Download the ZIP file containing all the individual pages</li>
          </ol>
        </div>
        
        <div 
          className="max-w-2xl w-full text-xs sm:text-sm text-blue-700 dark:text-blue-300 p-2 sm:p-3 border border-blue-300 dark:border-blue-700 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-center"
          role="alert"
        >
          <p>🔒 <strong>Privacy Notice:</strong> We don't store any data in our server. All processing happens in your browser.</p>
        </div>
      </main>
      
      <footer 
        className="row-start-3 w-full text-center py-4 sm:py-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300"
        role="contentinfo"
      >
        <p>© {new Date().getFullYear()} Make in 707. PDF Splitter. Built with Next.js and PDF-lib.</p>
        <a 
          href="https://github.com/vuhung16au/pdf-splitter" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          aria-label="Visit our GitHub repository"
        >
          GitHub Repository
        </a>
      </footer>
    </div>
  );
}
