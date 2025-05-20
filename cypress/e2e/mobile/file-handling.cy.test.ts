// cypress/e2e/mobile/file-handling.cy.test.ts

/**
 * Mobile file handling tests for PDF Splitter
 */

describe('Mobile File Handling', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/');
  });

  it('should handle single file selection', () => {
    cy.get('[data-testid="pdf-uploader"]')
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test PDF content'),
        fileName: 'mobile-test.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now(),
      }, { force: true });

    cy.contains('Selected Files (1)').should('be.visible');
    cy.contains('mobile-test.pdf').should('be.visible');
  });

  it('should handle multiple file selection', () => {
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

    cy.contains('Selected Files (2)').should('be.visible');
    cy.contains('mobile-test-1.pdf').should('be.visible');
    cy.contains('mobile-test-2.pdf').should('be.visible');
  });
});