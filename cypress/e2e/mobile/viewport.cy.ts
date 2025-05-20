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
});