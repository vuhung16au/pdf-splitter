"use client";

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { csrfFetch } from './csrf';
import { saveAs } from 'file-saver';

/**
 * Splits PDF files into individual pages and creates a ZIP archive
 * @param files Array of PDF files to process
 * @returns Promise resolving to a Blob containing the ZIP archive
 * @throws Error if PDF processing fails
 */
export async function splitPdfToSinglePages(files: File[]): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    try {
      // Read the PDF file
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      // Split each page into a separate PDF
      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);

        // Save the single-page PDF
        const pdfBytes = await newPdf.save();
        
        // Add to zip with sanitized filename
        const fileName = file.name.replace(/\.pdf$/i, '');
        const pageNumber = i + 1;
        zip.file(`${fileName}_page${pageNumber}.pdf`, pdfBytes);
      }
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      throw new Error(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate the zip file
  return zip.generateAsync({ type: 'blob' });
}

/**
 * Saves a ZIP blob as a downloadable file
 * @param zipBlob The ZIP file blob to save
 * @returns Promise that resolves when the file has been saved
 * @throws Error if saving fails
 */
export async function saveSplitPdfAsZip(zipBlob: Blob): Promise<void> {
  try {
    saveAs(zipBlob, 'split_pdfs.zip');
  } catch (error) {
    console.error('Error saving ZIP file:', error);
    throw new Error('Failed to save ZIP file');
  }
}

// Function to validate PDF file structure
export async function validatePdfStructure(file: File): Promise<boolean> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return pdfDoc.getPageCount() > 0;
  } catch (error) {
    return false;
  }
}

// Function to get PDF metadata
export async function getPdfMetadata(file: File): Promise<{
  pageCount: number;
  fileSize: number;
  fileName: string;
}> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return {
      pageCount: pdfDoc.getPageCount(),
      fileSize: file.size,
      fileName: file.name,
    };
  } catch (error) {
    throw new Error(`Failed to get PDF metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
