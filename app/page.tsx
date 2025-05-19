import Image from "next/image";
import PdfUploader from "./components/PdfUploader";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-6 pb-16 gap-10 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-2xl text-center mt-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">PDF Splitter</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Split multi-page PDF files into single-page PDFs and download as a zip
        </p>
      </header>
      
      <main className="flex flex-col gap-8 row-start-2 items-center w-full">
        <PdfUploader />
        
        <div className="max-w-2xl text-sm text-gray-600 dark:text-gray-400 mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-medium mb-2 text-center">How it works</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Upload one or more PDF files by dragging them into the upload area or clicking to browse</li>
            <li>Click &quot;Split PDFs&quot; to process your files</li>
            <li>Each page of your PDFs will be extracted as a separate PDF file</li>
            <li>Download the ZIP file containing all the individual pages</li>
          </ol>
        </div>
        
        <div className="max-w-2xl w-full text-sm text-blue-600 dark:text-blue-400 p-3 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center">
          <p>🔒 <strong>Privacy Notice:</strong> We don't store any data in our server. All processing happens in your browser.</p>
        </div>
      </main>
      
      <footer className="row-start-3 w-full text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} PDF Splitter. Built with Next.js and PDF-lib.</p>
      </footer>
    </div>
  );
}
