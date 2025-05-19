/// <reference types="cypress-file-upload" />

describe('Client-Side Security Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should prevent XSS in file names', () => {
    const xssPayload = '<script>alert("XSS")</script>.pdf';
    const testFile = new File(['test content'], xssPayload, { type: 'application/pdf' });
    
    // Try to upload file with XSS payload in name
    cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files']
      }
    });

    // Verify the script is not executed
    cy.on('window:alert', () => {
      throw new Error('XSS attack was successful');
    });

    // Verify the file name is sanitized in the UI
    cy.contains('Selected Files').should('be.visible');
    cy.contains(xssPayload).should('not.exist');
  });

  it('should handle memory usage securely', () => {
    // Create a moderately large PDF file (50MB)
    const largeFile = new File(['x'.repeat(50 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    
    // Upload and process the file
    cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
      dataTransfer: {
        files: [largeFile],
        types: ['Files']
      }
    });

    // Click split button
    cy.contains('button', 'Split PDFs').click();

    // Verify memory usage is handled properly
    cy.get('[role="alert"]').should('not.contain', 'Out of memory');
  });

  it('should prevent unauthorized file access', () => {
    // Try to access a file that wasn't uploaded
    cy.window().then((win) => {
      const fileInput = win.document.querySelector('[data-testid="pdf-uploader"] input[type="file"]') as HTMLInputElement;
      if (!fileInput) {
        throw new Error('File input not found');
      }
      const dataTransfer = new DataTransfer();
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      
      // Verify the file is not accessible
      expect(fileInput.files[0]).to.not.exist;
    });
  });

  it('should handle errors gracefully', () => {
    // Create a corrupted PDF file
    const corruptedFile = new File(['invalid pdf content'], 'corrupted.pdf', { type: 'application/pdf' });
    
    // Try to upload the corrupted file
    cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
      dataTransfer: {
        files: [corruptedFile],
        types: ['Files']
      }
    });

    // Click split button
    cy.contains('button', 'Split PDFs').click();

    // Verify error is handled gracefully
    cy.get('[role="alert"]').should('contain', 'Failed to split PDF');
  });
}); 