/**
 * End-to-end tests for the complete PDF splitting workflow:
 * 1. Upload a single PDF file
 * 2. Split the PDF into single pages
 * 3. Download the ZIP file
 */

import * as fileSaver from 'file-saver';

describe('PDF Splitting Complete Workflow', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // Stub the saveAs function to verify download
    cy.window().then(window => {
      cy.stub(window, 'saveAs').as('saveAsStub');
    });
  });

  it('should upload a PDF file, split it, and download the result', () => {
    // Step 1: Upload a PDF file
    // Using the sample.pdf file from fixtures
    cy.fixture('sample.pdf', 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then(blob => {
        const testFile = new File([blob], 'sample.pdf', { type: 'application/pdf' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        
        cy.get('[data-testid="pdf-uploader"]').trigger('drop', { 
          dataTransfer: {
            files: dataTransfer.files,
            types: ['Files']
          }
        });
      });
    
    // Verify the PDF was uploaded
    cy.contains('Selected Files').should('be.visible');
    cy.contains('sample.pdf').should('be.visible');
    
    // Step 2: Split the PDF
    cy.get('[data-testid="split-button"]').click();
    
    // Wait for processing to complete
    cy.get('[data-testid="loading-indicator"]', { timeout: 10000 })
      .should('not.exist');
      
    // Verify split results are visible
    cy.get('[data-testid="split-results"]').should('be.visible');
    cy.contains('PDF successfully split').should('be.visible');
    
    // Step 3: Download the ZIP file
    cy.get('[data-testid="download-zip-button"]').click();
    
    // Verify the download was triggered
    cy.get('@saveAsStub').should('have.been.calledOnce');
    cy.get('@saveAsStub').should('have.been.calledWith', 
      Cypress.sinon.match.any, 
      'split-pdfs.zip'
    );
  });

  it('should handle errors when trying to split invalid PDFs', () => {
    // Create an invalid PDF (just a text file with PDF extension)
    const invalidFile = new File(['Not a real PDF file'], 'fake.pdf', { type: 'application/pdf' });
    
    // Upload the invalid file
    cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
      dataTransfer: {
        files: [invalidFile],
        types: ['Files']
      }
    });
    
    // Try to split
    cy.get('[data-testid="split-button"]').click();
    
    // Should show an error
    cy.contains('Error processing PDF', { timeout: 10000 }).should('be.visible');
  });
  
  it('should allow splitting multiple PDFs at once', () => {
    // This would require more setup and likely a custom command
    // to handle multiple file uploads. For now, we'll focus on the main workflow.
    // This is a placeholder for future test expansion.
    cy.log('Multiple PDF upload test would go here');
  });
});
