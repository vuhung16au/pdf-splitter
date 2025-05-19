describe('File Upload Security Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should prevent uploading non-PDF files', () => {
    // Create a test file that's not a PDF
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    // Try to upload the file
    cy.get('input[type="file"]').attachFile({
      fileContent: testFile,
      fileName: 'test.txt',
      mimeType: 'text/plain'
    });

    // Should show error message
    cy.get('.error-message').should('contain', 'Please upload PDF files only');
  });

  it('should enforce file size limit', () => {
    // Create a large file (over 100MB)
    const largeFile = new File(['x'.repeat(101 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    
    // Try to upload the file
    cy.get('input[type="file"]').attachFile({
      fileContent: largeFile,
      fileName: 'large.pdf',
      mimeType: 'application/pdf'
    });

    // Should show error message
    cy.get('.error-message').should('contain', 'File size must be less than 100MB');
  });

  it('should sanitize file names', () => {
    // Create a file with potentially malicious name
    const maliciousFile = new File(['test content'], '../../etc/passwd.pdf', { type: 'application/pdf' });
    
    // Try to upload the file
    cy.get('input[type="file"]').attachFile({
      fileContent: maliciousFile,
      fileName: '../../etc/passwd.pdf',
      mimeType: 'application/pdf'
    });

    // Should sanitize the file name
    cy.get('.file-name').should('not.contain', '../../etc/passwd');
  });

  it('should handle multiple files securely', () => {
    // Create multiple test files
    const files = [
      new File(['test1'], 'test1.pdf', { type: 'application/pdf' }),
      new File(['test2'], 'test2.pdf', { type: 'application/pdf' }),
      new File(['test3'], 'test3.txt', { type: 'text/plain' })
    ];
    
    // Try to upload multiple files
    cy.get('input[type="file"]').attachFile(files);

    // Should only accept PDF files
    cy.get('.file-list').find('.file-item').should('have.length', 2);
    cy.get('.error-message').should('contain', 'Please upload PDF files only');
  });
}); 