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
});
