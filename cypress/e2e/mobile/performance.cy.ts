/**
 * Tests for mobile performance and responsiveness
 */

describe('Mobile Performance Tests', () => {
  it('should load resources efficiently', () => {
    cy.window().then((win) => {
      // Get all resources loaded by the page
      const resources = win.performance.getEntriesByType('resource');
      
      // Log resource loading times
      const cssResources = resources.filter(res => res.name.endsWith('.css'));
      const jsResources = resources.filter(res => res.name.endsWith('.js'));
      
      // Check that important resources load quickly
      const slowResources = resources.filter(res => res.duration > 1000);
      expect(slowResources.length).to.equal(0, 'No resources should take >1s to load');
      
      // Log summary of resource loading
      cy.log(`CSS resources: ${cssResources.length}, JS resources: ${jsResources.length}`);
      cy.log(`Total resources: ${resources.length}`);
    });
  });
});