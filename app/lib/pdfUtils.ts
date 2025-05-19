"use client";

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function splitPdfToSinglePages(pdfFiles: File[]): Promise<Blob> {
  // Create a new zip file
  const zip = new JSZip();
  
  // Process each PDF file
  for (const pdfFile of pdfFiles) {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Get the total number of pages
    const pageCount = pdfDoc.getPageCount();
    
    // Get the filename without extension
    const filename = pdfFile.name.replace(/\.pdf$/i, '');
    
    // Process each page
    for (let i = 0; i < pageCount; i++) {
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
    }
  }
  
  // Generate the zip file
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE', 
    compressionOptions: {
      level: 6 // Compression level (1-9), higher is more compression but slower
    }
  });
  
  return zipBlob;
}

export async function saveSplitPdfAsZip(zipBlob: Blob): Promise<void> {
  saveAs(zipBlob, 'pdf-splitted.zip');
}
