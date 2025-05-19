describe('PDF Splitter App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage correctly', () => {
    cy.contains('h1', 'PDF Splitter').should('be.visible');
    cy.contains('Split multi-page PDF files into single-page PDFs').should('be.visible');
  });

  it('should display the "How it works" section', () => {
    cy.contains('h3', 'How it works').should('be.visible');
    cy.get('ol').children().should('have.length', 4);
    cy.contains('Upload one or more PDF files').should('be.visible');
  });

  it('should show the PDF uploader component', () => {
    cy.get('[data-testid="pdf-uploader"]').should('exist');
    // If the component has a specific class or structure, we can check for that too
    cy.get('[data-testid="pdf-uploader"]').find('input[type="file"]').should('exist');
  });

  it('should have a footer with GitHub repository link', () => {
    cy.get('footer').should('be.visible');
    cy.get('footer a[href*="github.com"]').should('have.attr', 'href', 'https://github.com/vuhung16au/pdf-splitter');
  });

  it('should display the privacy notice', () => {
    cy.contains('🔒').should('be.visible');
    cy.contains('Privacy Notice').should('be.visible');
    cy.contains("We don't store any data in our server").should('be.visible');
  });

  // This test would require a mock for the file upload and PDF processing
  // which would be implemented in a more comprehensive test suite
});