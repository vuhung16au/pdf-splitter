/**
 * Tests for mobile file handling and interactions
 */

describe('Mobile File Handling', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/');
  });

  it('should handle single file selection', () => {
    // Test file input on mobile
    cy.get('[data-testid="pdf-uploader"]')
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test PDF content'),
        fileName: 'mobile-test.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now(),
      }, { force: true });

    // Verify file appears in the list
    cy.contains('Selected Files (1)').should('be.visible');
    cy.contains('mobile-test.pdf').should('be.visible');
  });

  it('should handle multiple file selection', () => {
    // Test multiple file selection
    cy.get('[data-testid="pdf-uploader"]')
      .find('input[type="file"]')
      .selectFile([
        {
          contents: Cypress.Buffer.from('test PDF content 1'),
          fileName: 'mobile-test-1.pdf',
          mimeType: 'application/pdf',
          lastModified: Date.now(),
        },
        {
          contents: Cypress.Buffer.from('test PDF content 2'),
          fileName: 'mobile-test-2.pdf',
          mimeType: 'application/pdf',
          lastModified: Date.now(),
        }
      ], { force: true });

    // Verify multiple files appear in the list
    cy.contains('Selected Files (2)').should('be.visible');
    cy.contains('mobile-test-1.pdf').should('be.visible');
    cy.contains('mobile-test-2.pdf').should('be.visible');
  });

  it('should handle file removal', () => {
    // Upload a file first
    cy.get('[data-testid="pdf-uploader"]')
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test PDF content'),
        fileName: 'mobile-test.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now(),
      }, { force: true });

    // Verify file is in the list
    cy.contains('mobile-test.pdf').should('be.visible');

    // Remove the file
    cy.contains('button', 'Remove').click();

    // Verify file is removed
    cy.contains('mobile-test.pdf').should('not.exist');
  });

  it('should handle file size limits', () => {
    // Create a large file (over 10MB)
    const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB

    // Try to upload the large file
    cy.get('[data-testid="pdf-uploader"]')
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from(largeContent),
        fileName: 'large-file.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now(),
      }, { force: true });

    // Verify error message is shown
    cy.contains('File size exceeds limit').should('be.visible');
  });
}); 