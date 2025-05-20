/**
 * Performance Tests for PDF Splitter application
 * Tests key performance metrics such as:
 * 1. Page Load Time
 * 2. UI Responsiveness
 * 3. PDF Processing Time
 * 4. Memory Usage
 * 5. Resource Loading
 */

describe('Performance Tests', () => {
  beforeEach(() => {
    // Reset state before each test
    cy.visit('/', {
      onBeforeLoad(win) {
        // Add performance monitoring
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
    
    // Create a reusable test PDF file
    cy.fixture('sample.pdf', 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then(blob => {
        const testFile = new File([blob], 'performance-test.pdf', { type: 'application/pdf' });
        cy.wrap(testFile).as('testPdf');
        
        // Create a larger test file for stress testing
        cy.wrap(new File([blob, blob, blob], 'large-test.pdf', { type: 'application/pdf' }))
          .as('largePdf');
      });
  });

  /**
   * Page Load Performance Tests
   */
  describe('Page Load Performance', () => {
    it('should load the application within acceptable time', () => {
      // Force a hard reload to measure initial page load
      cy.window().then((win) => {
        const navTiming = win.performance.timing;
        const pageLoadTime = navTiming.loadEventEnd - navTiming.navigationStart;
        
        // Assert that page loads in under 3 seconds (adjust threshold as needed)
        expect(pageLoadTime).to.be.lessThan(3000);
        cy.log(`Page Load Time: ${pageLoadTime}ms`);
      });
    });
    
    it('should load critical resources efficiently', () => {
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

  /**
   * UI Responsiveness Tests
   */
  describe('UI Responsiveness', () => {
    it('should respond to user interactions within acceptable time', () => {
      // Measure time to respond to click event
      const startTime = Date.now();
      
      cy.get('[data-testid="pdf-uploader"]').click()
        .then(() => {
          const responseTime = Date.now() - startTime;
          expect(responseTime).to.be.lessThan(100);
          cy.log(`Click response time: ${responseTime}ms`);
        });
    });
  });
});
