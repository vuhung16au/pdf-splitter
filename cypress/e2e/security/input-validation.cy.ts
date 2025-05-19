describe('Input Validation Security Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should validate PDF file input', () => {
    // Create a malicious file with PDF extension but non-PDF content
    const maliciousFile = new File(['malicious content'], 'malicious.pdf', { type: 'application/pdf' });
    
    // Try to upload the file
    cy.get('input[type="file"]').attachFile({
      fileContent: maliciousFile,
      fileName: 'malicious.pdf',
      mimeType: 'application/pdf'
    });

    // Should show validation error
    cy.get('[role="alert"]').should('contain', 'Invalid PDF file');
  });

  it('should prevent SQL injection in search inputs', () => {
    const sqlInjectionPayload = "' OR '1'='1";
    
    // Try to inject SQL in search input
    cy.get('input[type="search"]').type(sqlInjectionPayload);
    cy.get('form').submit();

    // Verify the payload is treated as literal text
    cy.get('[role="alert"]').should('not.contain', 'SQL syntax error');
  });

  it('should sanitize special characters in file names', () => {
    const maliciousFileName = 'file; rm -rf /; .pdf';
    
    // Try to upload file with malicious name
    const testFile = new File(['test content'], maliciousFileName, { type: 'application/pdf' });
    cy.get('input[type="file"]').attachFile({
      fileContent: testFile,
      fileName: maliciousFileName,
      mimeType: 'application/pdf'
    });

    // Verify the filename is sanitized
    cy.get('.file-name').should('not.contain', 'rm -rf');
  });

  it('should validate page range inputs', () => {
    // Try to input invalid page ranges
    const invalidRanges = ['1-2-3', 'abc', '-1', '0', '999999999'];
    
    invalidRanges.forEach(range => {
      cy.get('input[type="text"]').clear().type(range);
      cy.get('form').submit();
      
      // Should show validation error
      cy.get('[role="alert"]').should('contain', 'Invalid page range');
    });
  });
}); 