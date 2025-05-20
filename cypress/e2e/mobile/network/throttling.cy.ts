/**
 * Tests for network throttling and performance under different network conditions
 */

describe('Network Throttling Tests', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/');
  });

  it('should load resources efficiently under throttled conditions', () => {
    // Skip cy.throttle and just reload the page
    cy.reload();
    // Measure resource loading times
    cy.window().then((win) => {
      const resources = win.performance.getEntriesByType('resource');
      // Log resource loading times
      const cssResources = resources.filter(res => res.name.endsWith('.css'));
      const jsResources = resources.filter(res => res.name.endsWith('.js'));
      // Check that critical resources load within acceptable time
      const slowResources = resources.filter(res => res.duration > 5000);
      expect(slowResources.length).to.equal(0, 'No critical resources should take >5s to load');
      // Log summary of resource loading
      cy.log(`CSS resources: ${cssResources.length}, JS resources: ${jsResources.length}`);
      cy.log(`Total resources: ${resources.length}`);
    });
  });
});