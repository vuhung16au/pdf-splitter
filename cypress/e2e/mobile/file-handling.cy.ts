/**
 * Tests for mobile file handling and interactions
 */

describe('Mobile File Handling', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/');
  });

  it('should handle single file selection', () => {
    cy.get('[data-testid="pdf-uploader"]').find('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('test PDF content'),
      fileName: 'mobile-test.pdf',
      mimeType: 'application/pdf',
      lastModified: Date.now(),
    }, { force: true });

    cy.contains('mobile-test.pdf').should('be.visible');

    // Remove the file using Remove button
    cy.contains('mobile-test.pdf').parent().contains('button', 'Remove').click();
    cy.contains('mobile-test.pdf').should('not.exist');
  });

  it('should handle multiple file selection', () => {
    cy.get('[data-testid="pdf-uploader"]').find('input[type="file"]').selectFile([
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

    cy.contains('mobile-test-1.pdf').should('be.visible');
    cy.contains('mobile-test-2.pdf').should('be.visible');

    // Remove the first file using Remove button
    cy.contains('mobile-test-1.pdf').parent().contains('button', 'Remove').click();
    cy.contains('mobile-test-1.pdf').should('not.exist');
    cy.contains('mobile-test-2.pdf').should('be.visible');

    // Clear all files using Clear button
    cy.contains('button', 'Clear').click();
    cy.contains('mobile-test-2.pdf').should('not.exist');
  });

  it('should handle file removal', () => {
    cy.get('[data-testid="pdf-uploader"]').find('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('test PDF content'),
      fileName: 'mobile-test.pdf',
      mimeType: 'application/pdf',
      lastModified: Date.now(),
    }, { force: true });

    cy.contains('mobile-test.pdf').should('be.visible');

    // Remove the file using Remove button
    cy.contains('mobile-test.pdf').parent().contains('button', 'Remove').click();
    cy.contains('mobile-test.pdf').should('not.exist');
  });
});