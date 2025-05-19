/**
 * End-to-end test for UI responsiveness:
 * 1. Resize the browser window to different dimensions
 * 2. Check if UI elements adapt to different screen sizes
 * 3. Verify key elements remain visible and functional
 */

describe('UI Responsiveness Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display correctly on desktop viewport', () => {
    // Set viewport to desktop size
    cy.viewport(1280, 800);
    
    // Header elements should be properly sized
    cy.get('header h1').should('be.visible');
    cy.get('header p').should('be.visible');
    
    // Main content container should have appropriate spacing
    cy.get('main').should('have.css', 'padding');
    
    // PDF uploader should have appropriate width
    cy.get('[data-testid="pdf-uploader"]').invoke('outerWidth').then((width) => {
      expect(width).to.be.greaterThan(500);
    });
    
    // Verify "How it works" section display
    cy.contains('h3', 'How it works').should('be.visible');
    cy.get('ol').children().should('have.length', 4).and('be.visible');
  });

  it('should adapt to tablet viewport', () => {
    // Set viewport to tablet size
    cy.viewport(768, 1024);
    
    // Header elements should adjust
    cy.get('header h1').should('be.visible');
    
    // PDF uploader should adapt to viewport width
    cy.get('[data-testid="pdf-uploader"]').invoke('outerWidth').then((width) => {
      expect(width).to.be.lessThan(768);
    });
    
    // All main elements should still be visible
    cy.contains('h1', 'PDF Splitter').should('be.visible');
    cy.get('[data-testid="pdf-uploader"]').should('be.visible');
    cy.contains('h3', 'How it works').should('be.visible');
    cy.contains('We don\'t store any data in our server').should('be.visible');
  });

  it('should be fully responsive on mobile viewport', () => {
    // Set viewport to mobile size
    cy.viewport(375, 667); // iPhone SE size
    
    // Header text should be visible
    cy.get('header h1').should('be.visible');
    
    // PDF uploader should fit in the smaller viewport
    cy.get('[data-testid="pdf-uploader"]').invoke('outerWidth').then((width) => {
      expect(width).to.be.lessThan(375);
    });
    cy.get('[data-testid="pdf-uploader"]').should('be.visible');
    
    // All critical elements should remain visible
    cy.contains('PDF Splitter').should('be.visible');
    cy.contains('Drag and drop PDF files here').should('be.visible');
    cy.contains('How it works').should('be.visible');
  });

  it('should maintain functional upload area in all screen sizes', () => {
    // Test upload area in different sizes
    const viewports = [
      { width: 1280, height: 800, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    viewports.forEach(size => {
      cy.viewport(size.width, size.height);
      
      // Check if uploader is visible and functional
      cy.get('[data-testid="pdf-uploader"]').should('be.visible');
      cy.get('[data-testid="pdf-uploader"]').find('input[type="file"]').should('exist');
      
      // Simulate a file drop to test functionality
      const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      
      // Drop the file and verify it appears in the list
      cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
        dataTransfer: {
          files: dataTransfer.files,
          types: ['Files']
        }
      });
      
      // Verify file appears in the list
      cy.contains('Selected Files (1)').should('be.visible');
      cy.contains('test.pdf').should('be.visible');
      
      // Verify Split and Clear buttons are visible and clickable
      cy.contains('button', 'Split PDFs').should('be.visible');
      cy.contains('button', 'Clear').should('be.visible');
      
      // Clear files before next viewport test
      cy.contains('button', 'Clear').click();
    });
  });

  it('should maintain proper layout during window resize', () => {
    // Start with large viewport
    cy.viewport(1280, 800);
    
    // Verify initial layout
    cy.contains('h1', 'PDF Splitter').should('be.visible');
    cy.get('[data-testid="pdf-uploader"]').should('be.visible');
    
    // Resize to medium viewport
    cy.viewport(768, 1024);
    // Wait for any resize adaptations
    cy.wait(500);
    
    // Verify elements are still properly positioned
    cy.contains('h1', 'PDF Splitter').should('be.visible');
    cy.get('[data-testid="pdf-uploader"]').should('be.visible');
    
    // Resize to small viewport
    cy.viewport(375, 667);
    // Wait for any resize adaptations
    cy.wait(500);
    
    // Verify critical elements are still visible and usable
    cy.contains('h1', 'PDF Splitter').should('be.visible');
    cy.get('[data-testid="pdf-uploader"]').should('be.visible');
    
    // Check that important interactive elements remain accessible
    cy.get('[data-testid="pdf-uploader"]').find('input[type="file"]').should('exist');
  });

  it('should handle PDF uploads and display file list responsively', () => {
    // Create test files
    const testFile1 = new File(['test PDF content 1'], 'test1.pdf', { type: 'application/pdf' });
    const testFile2 = new File(['test PDF content 2'], 'test2.pdf', { type: 'application/pdf' });
    
    // Test file list display in different viewport sizes
    const viewports = [
      { width: 1280, height: 800, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    viewports.forEach(size => {
      cy.viewport(size.width, size.height);
      
      // Upload test files
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile1);
      
      cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
        dataTransfer: {
          files: dataTransfer.files,
          types: ['Files']
        }
      });
      
      // Verify the file list is visible and fits within the viewport
      cy.contains('Selected Files (1)').should('be.visible');
      cy.contains('test1.pdf').should('be.visible');
      
      // The file container should fit inside the viewport width
      cy.get('.overflow-y-auto').parent().invoke('outerWidth').then((width) => {
        expect(width).to.be.lessThan(size.width);
      });
      
      // Verify file size information is displayed properly
      cy.contains(/KB$/i).should('be.visible');
      
      // Clear files before next test
      cy.contains('button', 'Clear').click();
    });
  });
});
