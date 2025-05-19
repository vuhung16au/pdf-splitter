/**
 * Tests for network throttling and performance under different network conditions
 */

describe('Network Throttling Tests', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/');
  });

  it('should handle slow 3G network conditions', () => {
    // Enable slow 3G throttling
    cy.throttle('slow3G');
    
    // Test file upload under slow conditions
    cy.get('[data-testid="pdf-uploader"]')
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test PDF content'),
        fileName: 'slow-network-test.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now(),
      }, { force: true });

    // Verify loading states and progress indicators
    cy.get('[data-testid="upload-progress"]').should('be.visible');
    
    // Verify timeout handling
    cy.get('[data-testid="upload-timeout"]', { timeout: 30000 }).should('not.exist');
  });

  it('should handle fast 3G network conditions', () => {
    // Enable fast 3G throttling
    cy.throttle('fast3G');
    
    // Test file upload under fast 3G conditions
    cy.get('[data-testid="pdf-uploader"]')
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test PDF content'),
        fileName: 'fast-network-test.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now(),
      }, { force: true });

    // Verify upload completes within reasonable time
    cy.get('[data-testid="upload-complete"]', { timeout: 10000 }).should('be.visible');
  });

  it('should handle offline mode', () => {
    // Simulate offline mode using Cypress's built-in offline simulation
    cy.window().then((win) => {
      // @ts-ignore - Chrome DevTools Protocol
      const client = win.Cypress.automation('client:chrome');
      if (client) {
        client.send('Network.enable');
        client.send('Network.emulateNetworkConditions', {
          offline: true,
          latency: 0,
          downloadThroughput: 0,
          uploadThroughput: 0
        });
      }
    });
    
    // Attempt file upload
    cy.get('[data-testid="pdf-uploader"]')
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test PDF content'),
        fileName: 'offline-test.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now(),
      }, { force: true });

    // Verify offline error message
    cy.contains('You are currently offline').should('be.visible');
    
    // Verify retry functionality
    cy.contains('Retry').should('be.visible');
  });

  it('should handle network recovery', () => {
    // Start with offline mode
    cy.window().then((win) => {
      // @ts-ignore - Chrome DevTools Protocol
      const client = win.Cypress.automation('client:chrome');
      if (client) {
        client.send('Network.enable');
        client.send('Network.emulateNetworkConditions', {
          offline: true,
          latency: 0,
          downloadThroughput: 0,
          uploadThroughput: 0
        });
      }
    });
    
    // Attempt upload
    cy.get('[data-testid="pdf-uploader"]')
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test PDF content'),
        fileName: 'recovery-test.pdf',
        mimeType: 'application/pdf',
        lastModified: Date.now(),
      }, { force: true });

    // Verify offline message
    cy.contains('You are currently offline').should('be.visible');
    
    // Restore network
    cy.window().then((win) => {
      // @ts-ignore - Chrome DevTools Protocol
      const client = win.Cypress.automation('client:chrome');
      if (client) {
        client.send('Network.emulateNetworkConditions', {
          offline: false,
          latency: 20,
          downloadThroughput: (4 * 1024 * 1024) / 8,
          uploadThroughput: (3 * 1024 * 1024) / 8
        });
      }
    });
    
    // Click retry
    cy.contains('Retry').click();
    
    // Verify successful upload after recovery
    cy.contains('Upload complete').should('be.visible');
  });

  it('should load resources efficiently under throttled conditions', () => {
    // Enable slow 3G throttling
    cy.throttle('slow3G');
    
    // Reload the page
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

  it('should handle file uploads under varying network conditions', () => {
    const networkConditions = ['slow3G', 'fast3G', 'regular4G'];
    
    networkConditions.forEach(condition => {
      // Set network condition
      cy.throttle(condition);
      
      // Upload file
      cy.get('[data-testid="pdf-uploader"]')
        .find('input[type="file"]')
        .selectFile({
          contents: Cypress.Buffer.from('test PDF content'),
          fileName: `${condition}-test.pdf`,
          mimeType: 'application/pdf',
          lastModified: Date.now(),
        }, { force: true });

      // Verify appropriate loading states
      cy.get('[data-testid="upload-progress"]').should('be.visible');
      
      // Verify upload completes
      cy.get('[data-testid="upload-complete"]', { timeout: 30000 }).should('be.visible');
      
      // Clear for next test
      cy.contains('Clear').click();
    });
  });
}); 