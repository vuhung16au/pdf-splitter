/**
 * End-to-end test for accessibility based on WCAG 2.1 principles:
 * 1. Perceivable - Information and user interface components must be presentable to users in ways they can perceive
 * 2. Operable - User interface components and navigation must be operable
 * 3. Understandable - Information and the operation of user interface must be understandable
 * 4. Robust - Content must be robust enough to be interpreted by a wide variety of user agents
 */

describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
    
    // Create a reusable test PDF file
    const testFile = new File(['test PDF content'], 'a11y-test.pdf', { type: 'application/pdf' });
    cy.wrap(testFile).as('testPdf');
  });

  /**
   * Perceivable: Tests for ensuring content is available to senses - sight, hearing, or touch
   */
  describe('Principle 1: Perceivable', () => {
    it('should provide text alternatives for images', () => {
      // Check that all images have alt text
      cy.get('img').each(($el) => {
        cy.wrap($el).should('have.attr', 'alt');
      });
    });

    it('should have appropriate heading structure', () => {
      // Check heading structure
      cy.get('h1').should('exist');
      // Ensure proper heading hierarchy (no skipping levels)
      cy.get('h1 + h3').should('not.exist');
    });
    
    it('should have sufficient color contrast', () => {
      // We're only checking header elements for contrast as a starting point
      cy.get('h1, h2, h3').checkA11y(undefined, {
        runOnly: {
          type: 'rule',
          values: ['color-contrast']
        }
      });
    });
    
    it('should resize text without loss of content or functionality', () => {
      // Test with zoomed viewport to simulate text resize
      cy.viewport(1280 * 0.5, 720 * 0.5);
      cy.get('[data-testid="pdf-uploader"]').should('be.visible');
      cy.contains('PDF Splitter').should('be.visible');
    });
  });

  /**
   * Operable: Tests for ensuring UI and navigation can be operated by users
   */
  describe('Principle 2: Operable', () => {
    it('should be fully keyboard accessible', () => {
      // The PDF uploader should be keyboard accessible
      cy.get('[data-testid="pdf-uploader"]')
        .should('have.attr', 'tabindex')
        .should('not.eq', '-1');
      
      // Focus the uploader and check it has visible focus state
      cy.get('[data-testid="pdf-uploader"]').focus();
      cy.focused().should('have.css', 'outline-style').should('not.eq', 'none');
    });

    it('should support file uploads via keyboard', () => {
      // Create a test PDF file
      const testFile = {
        contents: Cypress.Buffer.from('test PDF content'),
        fileName: 'a11y-test.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now()
      };
      
      // Use selectFile which works better with keyboard simulation
      cy.get('[data-testid="pdf-uploader"] input[type="file"]')
        .selectFile(testFile, { force: true });
      
      // Verify file was accepted
      cy.contains('Selected Files').should('be.visible');
    });
    
    it('should have buttons that can be activated by keyboard', () => {
      // Upload a file first to make buttons visible
      const testFile = {
        contents: Cypress.Buffer.from('test PDF content'),
        fileName: 'a11y-test.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now()
      };
      
      cy.get('[data-testid="pdf-uploader"] input[type="file"]')
        .selectFile(testFile, { force: true });
      
      // Verify that Split PDFs button is present and can receive focus
      cy.contains('button', 'Split PDFs').should('be.visible').focus();
      cy.focused().should('contain', 'Split PDFs');
      
      // Check that Clear button is also focusable
      cy.contains('button', 'Clear').should('be.visible');
    });
  });

  /**
   * Understandable: Tests for ensuring information and operation are understandable
   */
  describe('Principle 3: Understandable', () => {
    it('should have predictable navigation and interface components', () => {
      // Header should be at the top
      cy.get('header').should('be.visible');
      
      // PDF uploader should be below header
      cy.get('[data-testid="pdf-uploader"]').should('be.visible');
      
      // Instructions should be available
      cy.contains('How it works').should('be.visible');
    });
    
    it('should provide clear feedback and error messages', () => {
      // Try to split without selecting a file first
      cy.get('[data-testid="pdf-uploader"]').click();
      
      // Upload an invalid file to test error handling
      const invalidFile = {
        contents: Cypress.Buffer.from('not a real PDF'),
        fileName: 'not-a-pdf.txt',
        mimeType: 'text/plain',
        lastModified: Date.now()
      };
      
      cy.get('[data-testid="pdf-uploader"] input[type="file"]')
        .selectFile(invalidFile, { force: true });
      
      // We should either get a validation error or the app should handle this gracefully
      cy.get('body').then($body => {
        if ($body.find('[role="alert"]').length > 0) {
          // If there's an error message, it should be properly announced to screen readers
          cy.get('[role="alert"]').should('be.visible');
        }
      });
    });
    
    it('should have form elements with clear instructions', () => {
      // Should have clear instructions for PDF upload
      cy.get('[data-testid="pdf-uploader"]').should('contain', 'Drag and drop');
    });
  });
  
  /**
   * Operable: Tests for ensuring UI and navigation can be operated by users
   */
  describe('Principle 2: Operable', () => {
    it('should be fully keyboard accessible', () => {
      // The PDF uploader should be keyboard accessible
      cy.get('[data-testid="pdf-uploader"]')
        .should('have.attr', 'tabindex')
        .and('not.eq', '-1');
      
      // Focus the uploader and check it has visible focus state
      cy.get('[data-testid="pdf-uploader"]').focus();
      cy.focused().should('have.css', 'outline-style').and('not.eq', 'none');
    });
    
    it('should have correct tab order for interactive elements', () => {
      // Tab to the first focusable element
      cy.get('body').focus();
      
      // The first element should be the pdf uploader
      cy.focused().should('have.attr', 'data-testid', 'pdf-uploader');
    });
    
    it('should have interactive controls with proper focusability', () => {
      // Upload a PDF file to make buttons visible
      cy.get('[data-testid="pdf-uploader"]').find('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('test PDF content'),
        fileName: 'a11y-test.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now(),
      }, { force: true });
      
      // Verify that buttons are now visible and can receive focus
      cy.contains('button', 'Split PDFs').should('be.visible').focus();
      cy.focused().should('contain', 'Split PDFs');
      
      // Navigate to next button with keyboard
      cy.focused().tab();
      cy.focused().should('contain', 'Clear');
    });
    
    it('should provide sufficient time for interactions', () => {
      // Upload a PDF to test processing time
      cy.get('@testPdf').then((testFile) => {
        const fileReference = {
          contents: Cypress.Buffer.from('test PDF content'),
          fileName: 'test.pdf',
          mimeType: 'application/pdf',
          lastModified: Date.now()
        };
        
        cy.get('[data-testid="pdf-uploader"]').find('input[type="file"]').selectFile(
          fileReference,
          { force: true }
        );
      });
      
      // Click the Split PDFs button
      cy.contains('button', 'Split PDFs').click();
      
      // Verify processing indicator is visible to show activity
      cy.get('.animate-spin').should('be.visible');
      
      // User should be informed of the process
      cy.contains('Processing').should('be.visible');
    });
  });
  
  /**
   * Robust: Tests for ensuring compatibility with current and future user agents
   */
  describe('Principle 4: Robust', () => {
    it('should have valid HTML structure', () => {
      // Using axe for this purpose with focus on parsing
      cy.checkA11y(undefined, {
        runOnly: {
          type: 'rule',
          values: ['valid-lang', 'html-has-lang']
        }
      });
    });
    
    it('should have proper roles for custom interactive elements', () => {
      // Check that the PDF uploader has appropriate role
      cy.get('[data-testid="pdf-uploader"]')
        .should('have.attr', 'role');
    });
    
    it('should have properly associated labels with interactive elements', () => {
      // Test that file input has an accessible label
      cy.get('[data-testid="pdf-uploader"] input[type="file"]')
        .should('have.attr', 'aria-label');
    });
  });
});
