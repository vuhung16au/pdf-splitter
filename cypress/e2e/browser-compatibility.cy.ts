/**
 * End-to-end test for browser compatibility:
 * 1. Test the application in different browsers (Chrome, Firefox, Safari)
 * 2. Verify functionality and UI consistency across browsers
 * 3. Check for browser-specific issues
 */

describe('Browser Compatibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  /**
   * Core functionality tests that will be run in each browser
   */
  const testCoreFunctionality = () => {
    // Check if main elements are visible and styled correctly
    it('should display main UI elements properly', () => {
      // Header content should be visible
      cy.get('header h1').should('be.visible').and('contain', 'PDF Splitter');
      cy.get('header p').should('be.visible');
      
      // PDF uploader should be visible and styled correctly
      cy.get('[data-testid="pdf-uploader"]').should('be.visible');
      cy.get('[data-testid="pdf-uploader"]')
        .should('have.css', 'border-style', 'solid')
        .and('have.css', 'border-radius');
      
      // How it works section should be visible
      cy.contains('h3', 'How it works').should('be.visible');
      cy.get('ol').children().should('have.length', 4);
    });

    it('should handle file upload correctly', () => {
      // Create a test PDF file
      const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      
      // Drop the file on the uploader
      cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
        dataTransfer: {
          files: dataTransfer.files,
          types: ['Files']
        }
      });
      
      // Verify file appears in the list
      cy.contains('Selected Files (1)').should('be.visible');
      cy.contains('test.pdf').should('be.visible');
      
      // Verify buttons are visible and enabled
      cy.contains('button', 'Split PDFs').should('be.visible').and('be.enabled');
      cy.contains('button', 'Clear').should('be.visible').and('be.enabled');
    });
    
    it('should allow file removal', () => {
      // Upload a file first
      const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      
      cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
        dataTransfer: {
          files: dataTransfer.files,
          types: ['Files']
        }
      });
      
      // Verify file appears in the list
      cy.contains('Selected Files (1)').should('be.visible');
      
      // Click the Clear button
      cy.contains('button', 'Clear').click();
      
      // Verify file list is cleared
      cy.contains('Selected Files').should('not.exist');
      cy.contains('test.pdf').should('not.exist');
      cy.contains('Drag and drop PDF files here').should('be.visible');
    });
    
    it('should handle multiple file uploads', () => {
      // Create two test PDF files
      const testFile1 = new File(['test PDF content 1'], 'test1.pdf', { type: 'application/pdf' });
      const testFile2 = new File(['test PDF content 2'], 'test2.pdf', { type: 'application/pdf' });
      
      // Upload first file
      const dataTransfer1 = new DataTransfer();
      dataTransfer1.items.add(testFile1);
      
      cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
        dataTransfer: {
          files: dataTransfer1.files,
          types: ['Files']
        }
      });
      
      // Verify first file appears
      cy.contains('Selected Files (1)').should('be.visible');
      cy.contains('test1.pdf').should('be.visible');
      
      // Files are replaced rather than added in the current implementation
      // So we'll verify that the second file appears and the first one is replaced
      const dataTransfer2 = new DataTransfer();
      dataTransfer2.items.add(testFile2);
      
      cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
        dataTransfer: {
          files: dataTransfer2.files,
          types: ['Files']
        }
      });
      
      // Verify second file appears and first is replaced
      cy.contains('Selected Files (1)').should('be.visible');
      cy.contains('test2.pdf').should('be.visible');
      cy.contains('test1.pdf').should('not.exist');
    });

    it('should maintain interactive elements functionality', () => {
      // Check that the file input is functional
      cy.get('[data-testid="pdf-uploader"]').find('input[type="file"]')
        .should('exist')
        .and('have.attr', 'accept', 'application/pdf');
      
      // Verify visible text and interactive elements
      cy.contains('click to select PDF files').should('be.visible');
      cy.get('[data-testid="pdf-uploader"]').should('have.css', 'cursor', 'auto');
      
      // Hover effect on uploader area
      cy.get('[data-testid="pdf-uploader"]').trigger('mouseover');
      cy.get('[data-testid="pdf-uploader"]').trigger('mouseout');
    });
  };

  /**
   * Chrome browser tests
   * Note: Cypress runs in Chrome by default
   */
  context('Chrome browser', () => {
    testCoreFunctionality();
    
    it('should render SVG elements correctly in Chrome', () => {
      // Check for proper SVG rendering in Chrome
      cy.get('img[src*="svg"]').should('be.visible');
      
      // Upload a test PDF
      const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      
      cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
        dataTransfer: {
          files: dataTransfer.files,
          types: ['Files']
        }
      });
      
      // Check for file information display
      cy.contains('test.pdf').should('be.visible');
    });
  });

  /**
   * Firefox browser tests
   * Note: These tests will only run if Cypress is configured with Firefox
   */
  context('Firefox browser', { browser: 'firefox' }, () => {
    testCoreFunctionality();
    
    it('should handle file drag and drop properly in Firefox', () => {
      // Firefox sometimes handles drag and drop events differently
      // Test standard file upload via input instead
      cy.get('[data-testid="pdf-uploader"]').find('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from('test PDF content'),
          fileName: 'firefox-test.pdf',
          mimeType: 'application/pdf',
          lastModified: Date.now(),
        },
        { force: true }
      );
      
      // Verify file appears in the list
      cy.contains('Selected Files (1)').should('be.visible');
      cy.contains('firefox-test.pdf').should('be.visible');
    });
  });

  /**
   * Safari browser tests
   * Note: These tests will only run if Cypress is configured with Safari
   */
  context('Safari browser', { browser: 'safari' }, () => {
    testCoreFunctionality();
    
    it('should properly handle flexbox layout in Safari', () => {
      // Safari sometimes handles flexbox differently
      // Check that layout is still correct
      cy.get('[data-testid="pdf-uploader"]').should('have.css', 'display', 'flex');
      cy.get('main').should('have.css', 'display', 'flex');
      
      // Safari has particular issues with flexbox gap sometimes
      cy.get('main > div').should('be.visible');
    });
    
    it('should process file uploads correctly in Safari', () => {
      cy.get('[data-testid="pdf-uploader"]').find('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from('test PDF content'),
          fileName: 'safari-test.pdf',
          mimeType: 'application/pdf',
          lastModified: Date.now(),
        },
        { force: true }
      );
      
      // Verify file appears in the list
      cy.contains('Selected Files (1)').should('be.visible');
      cy.contains('safari-test.pdf').should('be.visible');
    });
  });

  /**
   * Edge browser tests
   * Note: These tests will only run if Cypress is configured with Edge
   */
  context('Edge browser', { browser: 'edge' }, () => {
    testCoreFunctionality();
    
    it('should handle PDF display specifics in Edge', () => {
      // Edge-specific PDF handling tests
      cy.get('[data-testid="pdf-uploader"]').should('be.visible');
      
      // Upload a test PDF
      const testFile = new File(['test PDF content'], 'edge-test.pdf', { type: 'application/pdf' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      
      cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
        dataTransfer: {
          files: dataTransfer.files,
          types: ['Files']
        }
      });
      
      // Verify file appears in the list
      cy.contains('Selected Files (1)').should('be.visible');
      cy.contains('edge-test.pdf').should('be.visible');
    });
    
    it('should properly handle UI rendering in Edge', () => {
      // Edge sometimes renders differently
      // Check specific styling
      cy.get('header').should('be.visible');
      cy.get('[data-testid="pdf-uploader"]').should('have.css', 'border-style', 'solid');
      
      // Check responsive layout in Edge
      cy.viewport(768, 1024); // Tablet size
      cy.wait(200); // Give time for responsive adjustments
      cy.get('header h1').should('be.visible');
      cy.get('[data-testid="pdf-uploader"]').should('be.visible');
    });
  });
});
