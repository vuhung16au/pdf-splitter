/**
 * Tests for mobile performance and responsiveness
 */

describe('Mobile Performance Tests', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/');
  });

  it('should maintain smooth scrolling', () => {
    // Measure scroll performance
    cy.window().then((win) => {
      const startTime = performance.now();
      
      cy.get('body').scrollTo('bottom', { duration: 1000 })
        .then(() => {
          const endTime = performance.now();
          const scrollTime = endTime - startTime;
          
          // Scroll should complete within 1.5 seconds
          expect(scrollTime).to.be.lessThan(1500);
        });
    });
  });

  it('should handle touch events without lag', () => {
    // Measure touch response time
    cy.window().then((win) => {
      const startTime = performance.now();
      
      cy.get('[data-testid="pdf-uploader"]')
        .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
        .then(() => {
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          
          // Touch response should be under 100ms
          expect(responseTime).to.be.lessThan(100);
        });
    });
  });

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

  it('should handle file operations efficiently', () => {
    // Measure file upload performance
    cy.window().then((win) => {
      const startTime = performance.now();
      
      // Upload a test file
      cy.get('[data-testid="pdf-uploader"]')
        .find('input[type="file"]')
        .selectFile({
          contents: Cypress.Buffer.from('test PDF content'),
          fileName: 'performance-test.pdf',
          mimeType: 'application/pdf',
          lastModified: Date.now(),
        }, { force: true })
        .then(() => {
          const endTime = performance.now();
          const uploadTime = endTime - startTime;
          
          // File upload should complete within 2 seconds
          expect(uploadTime).to.be.lessThan(2000);
        });
    });
  });
}); 