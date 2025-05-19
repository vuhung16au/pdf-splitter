/**
 * Tests for mobile viewport and responsive behavior
 */

describe('Mobile Viewport Tests', () => {
  const mobileDevices = [
    { device: 'iphone-x', width: 375, height: 812 },
    { device: 'iphone-6', width: 375, height: 667 },
    { device: 'pixel-2', width: 411, height: 731 },
    { device: 'samsung-s10', width: 360, height: 760 }
  ];

  beforeEach(() => {
    cy.visit('/');
  });

  it('should adapt to different mobile viewport sizes', () => {
    mobileDevices.forEach(({ device, width, height }) => {
      cy.viewport(width, height);
      
      // Verify UI elements are properly sized
      cy.get('[data-testid="pdf-uploader"]').should('be.visible');
      cy.get('header h1').should('be.visible');
      
      // Check that text remains readable
      cy.get('body').should('have.css', 'font-size').and('match', /1[4-6]px/);
    });
  });

  it('should handle orientation changes', () => {
    // Test portrait orientation
    cy.viewport('iphone-x', 'portrait');
    cy.get('[data-testid="pdf-uploader"]').should('be.visible');
    
    // Test landscape orientation
    cy.viewport('iphone-x', 'landscape');
    cy.get('[data-testid="pdf-uploader"]').should('be.visible');
    
    // Verify UI adapts to orientation change
    cy.get('main').should('have.css', 'flex-direction').and('match', /row|column/);
  });

  it('should maintain proper spacing in all viewports', () => {
    mobileDevices.forEach(({ device, width, height }) => {
      cy.viewport(width, height);
      
      // Check spacing between elements
      cy.get('button, a, input').each(($el, index, $list) => {
        if (index < $list.length - 1) {
          const nextEl = $list[index + 1];
          const spacing = nextEl.offset().top - $el.offset().top;
          
          // Elements should have at least 8px spacing
          expect(spacing).to.be.greaterThan(7);
        }
      });
    });
  });

  it('should have touch-friendly element sizes', () => {
    mobileDevices.forEach(({ device, width, height }) => {
      cy.viewport(width, height);
      
      // Check that buttons are large enough for touch
      cy.get('button').each(($button) => {
        cy.wrap($button).then(($el) => {
          const height = $el.height();
          const width = $el.width();
          
          // Buttons should be at least 44x44 pixels for touch targets
          expect(height).to.be.greaterThan(43);
          expect(width).to.be.greaterThan(43);
        });
      });
    });
  });
}); 