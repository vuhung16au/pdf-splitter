/**
 * Tests for touch events and interactions on mobile devices
 */

describe('Touch Events', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/');
  });
});