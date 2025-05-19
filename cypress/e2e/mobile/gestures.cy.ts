/**
 * Tests for mobile gestures and interactions
 */

describe('Mobile Gestures', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/');
  });

  it('should handle pinch-to-zoom gestures', () => {
    // Test pinch gesture
    cy.get('main')
      .trigger('gesturestart', { scale: 1 })
      .trigger('gesturechange', { scale: 2 })
      .trigger('gestureend', { scale: 2 });

    // Verify content remains visible and properly scaled
    cy.get('[data-testid="pdf-uploader"]').should('be.visible');
  });

  it('should handle swipe gestures', () => {
    // Test swipe gesture
    cy.get('main')
      .trigger('touchstart', { touches: [{ clientX: 300, clientY: 300 }] })
      .trigger('touchmove', { touches: [{ clientX: 100, clientY: 300 }] })
      .trigger('touchend');

    // Verify UI responds appropriately to swipe
    cy.get('[data-testid="pdf-uploader"]').should('be.visible');
  });

  it('should handle double tap gestures', () => {
    // Test double tap
    cy.get('[data-testid="pdf-uploader"]')
      .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
      .trigger('touchend')
      .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
      .trigger('touchend');

    // Verify double tap feedback
    cy.get('[data-testid="pdf-uploader"]').should('have.class', 'double-tap');
  });
}); 