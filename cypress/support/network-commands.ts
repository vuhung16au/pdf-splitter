/**
 * Custom commands for network throttling and testing
 */

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Throttle network conditions
       * @param condition - Network condition to simulate ('slow3G', 'fast3G', 'regular4G')
       */
      throttle(condition: 'slow3G' | 'fast3G' | 'regular4G'): void;
    }
  }
}

// Network condition presets
const networkConditions = {
  slow3G: {
    downloadThroughput: (500 * 1024) / 8, // 500 Kbps
    uploadThroughput: (500 * 1024) / 8, // 500 Kbps
    latency: 200 // 200ms
  },
  fast3G: {
    downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps
    uploadThroughput: (750 * 1024) / 8, // 750 Kbps
    latency: 100 // 100ms
  },
  regular4G: {
    downloadThroughput: (4 * 1024 * 1024) / 8, // 4 Mbps
    uploadThroughput: (3 * 1024 * 1024) / 8, // 3 Mbps
    latency: 20 // 20ms
  }
};

Cypress.Commands.add('throttle', (condition: 'slow3G' | 'fast3G' | 'regular4G') => {
  const settings = networkConditions[condition];
  
  cy.window().then((win) => {
    // @ts-ignore - Chrome DevTools Protocol
    const client = win.Cypress.automation('client:chrome');
    
    if (client) {
      // @ts-ignore - Chrome DevTools Protocol
      client.send('Network.enable');
      // @ts-ignore - Chrome DevTools Protocol
      client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: settings.latency,
        downloadThroughput: settings.downloadThroughput,
        uploadThroughput: settings.uploadThroughput
      });
    }
  });
  
  cy.log(`🌐 Network throttled to: ${condition}`);
}); 