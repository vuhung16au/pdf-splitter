describe('Error Handling Security Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should not expose sensitive information in error messages', () => {
    // Try to access a non-existent route
    cy.request({
      url: '/api/non-existent',
      failOnStatusCode: false
    }).then((response) => {
      // Error message should not contain stack traces or internal details
      expect(response.body).to.not.include('at ');
      expect(response.body).to.not.include('Error:');
      expect(response.body).to.not.include('node_modules');
    });
  });

  it('should handle file processing errors securely', () => {
    // Create a corrupted PDF file
    const corruptedFile = new File(['invalid pdf content'], 'corrupted.pdf', { type: 'application/pdf' });
    
    // Try to process the corrupted file
    cy.get('input[type="file"]').attachFile({
      fileContent: corruptedFile,
      fileName: 'corrupted.pdf',
      mimeType: 'application/pdf'
    });

    // Click process button
    cy.contains('button', 'Process').click();

    // Error message should be user-friendly and not expose internal details
    cy.get('[role="alert"]')
      .should('be.visible')
      .and('not.contain', 'Error:')
      .and('not.contain', 'at ')
      .and('not.contain', 'node_modules');
  });

  it('should handle network errors gracefully', () => {
    // Simulate network error
    cy.intercept('POST', '/api/process', {
      forceNetworkError: true
    }).as('networkError');

    // Try to process a file
    const testFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    cy.get('input[type="file"]').attachFile({
      fileContent: testFile,
      fileName: 'test.pdf',
      mimeType: 'application/pdf'
    });

    cy.contains('button', 'Process').click();

    // Should show user-friendly error message
    cy.get('[role="alert"]')
      .should('be.visible')
      .and('contain', 'Unable to process')
      .and('not.contain', 'NetworkError');
  });

  it('should handle concurrent requests properly', () => {
    // Create multiple files
    const files = [
      new File(['test1'], 'test1.pdf', { type: 'application/pdf' }),
      new File(['test2'], 'test2.pdf', { type: 'application/pdf' })
    ];

    // Try to process multiple files simultaneously
    files.forEach(file => {
      cy.get('input[type="file"]').attachFile({
        fileContent: file,
        fileName: file.name,
        mimeType: 'application/pdf'
      });
    });

    cy.contains('button', 'Process').click();

    // Should handle concurrent processing without crashing
    cy.get('[role="alert"]').should('not.contain', 'Internal Server Error');
  });
}); 