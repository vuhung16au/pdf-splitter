/**
 * Tests for touch events and interactions on mobile devices
 */

describe('Touch Events', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/');
  });

  it('should handle basic touch events', () => {
    // Test touchstart event
    cy.get('[data-testid="pdf-uploader"]')
      .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
      .should('have.class', 'active');

    // Test touchend event
    cy.get('[data-testid="pdf-uploader"]')
      .trigger('touchend')
      .should('not.have.class', 'active');
  });

  it('should handle touch and drag events', () => {
    // Test touchmove event
    cy.get('[data-testid="pdf-uploader"]')
      .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
      .trigger('touchmove', { touches: [{ clientX: 200, clientY: 200 }] })
      .trigger('touchend');

    // Verify drag feedback is visible
    cy.get('[data-testid="pdf-uploader"]').should('have.class', 'drag-over');
  });

  it('should handle long press events', () => {
    // Test long press
    cy.get('[data-testid="pdf-uploader"]')
      .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
      .wait(500) // Simulate long press
      .trigger('touchend');

    // Verify long press feedback
    cy.get('[data-testid="pdf-uploader"]').should('have.class', 'long-press');
  });
}); 