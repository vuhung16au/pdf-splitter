"use client";

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Splits PDF files into individual pages and creates a ZIP archive
 * @param pdfFiles Array of PDF files to process
 * @returns Promise resolving to a Blob containing the ZIP archive
 * @throws Error if PDF processing fails
 */
export async function splitPdfToSinglePages(pdfFiles: File[]): Promise<Blob> {
  // Create a new zip file
  const zip = new JSZip();
  
  // Process each PDF file
  for (const pdfFile of pdfFiles) {
    try {
      // Validate the file is indeed a PDF
      if (pdfFile.type !== 'application/pdf') {
        throw new Error(`File "${pdfFile.name}" is not a valid PDF`);
      }

      const arrayBuffer = await pdfFile.arrayBuffer().catch(err => {
        throw new Error(`Failed to read "${pdfFile.name}": ${err.message}`);
      });
      
      const pdfDoc = await PDFDocument.load(arrayBuffer).catch(err => {
        throw new Error(`Failed to parse "${pdfFile.name}": ${err.message}`);
      });
      
      // Get the total number of pages
      const pageCount = pdfDoc.getPageCount();
      
      if (pageCount === 0) {
        throw new Error(`PDF file "${pdfFile.name}" has no pages to extract`);
      }
      
      // Get the filename without extension
      const filename = pdfFile.name.replace(/\.pdf$/i, '');
      
      // Process each page
      for (let i = 0; i < pageCount; i++) {
        try {
          // Create a new document for this page
          const newPdfDoc = await PDFDocument.create();
          
          // Copy the page from the original document
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
          newPdfDoc.addPage(copiedPage);
          
          // Save the new document
          const pdfBytes = await newPdfDoc.save();
          
          // Format the page number with leading zeros based on total pages
          const pageNumberStr = String(i + 1).padStart(
            pageCount >= 100 ? 3 : (pageCount >= 10 ? 2 : 1), '0'
          );
          
          // Add to zip with a formatted name
          const newFilename = `${filename}-${pageNumberStr}.pdf`;
          zip.file(newFilename, pdfBytes);
        } catch (pageErr) {
          console.error(`Error processing page ${i + 1} of "${pdfFile.name}":`, pageErr);
          // Continue with next page instead of failing the entire process
        }
      }
    } catch (fileErr) {
      console.error(`Error processing file "${pdfFile.name}":`, fileErr);
      throw new Error(`Failed to process "${pdfFile.name}": ${fileErr instanceof Error ? fileErr.message : 'Unknown error'}`);
    }
  }

  // Check if any files were added to the zip
  if (Object.keys(zip.files).length === 0) {
    throw new Error("No PDF pages could be processed. Please check your files and try again.");
  }
  
  try {
    // Generate the zip file
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE', 
      compressionOptions: {
        level: 6 // Compression level (1-9), higher is more compression but slower
      }
    });
    
    return zipBlob;
  } catch (zipErr) {
    console.error("Error generating ZIP archive:", zipErr);
    throw new Error(`Failed to create ZIP file: ${zipErr instanceof Error ? zipErr.message : 'Unknown error'}`);
  }
}

/**
 * Saves a ZIP blob as a downloadable file
 * @param zipBlob The ZIP file blob to save
 * @returns Promise that resolves when the file has been saved
 * @throws Error if saving fails
 */
export async function saveSplitPdfAsZip(zipBlob: Blob): Promise<void> {
  try {
    saveAs(zipBlob, 'pdf-splitted.zip');
  } catch (err) {
    console.error("Error saving ZIP file:", err);
    throw new Error(`Failed to download ZIP file: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}
