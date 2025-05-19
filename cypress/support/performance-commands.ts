/**
 * Custom Cypress commands for performance testing
 */

export {};

// Add type definitions for custom performance commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to measure the time taken for an operation
       * @param name The name of the operation being measured
       * @param callback The operation to measure
       * @example cy.measureTime('button click', () => cy.get('button').click())
       */
      measureTime(name: string, callback: () => void): Chainable<void>
      
      /**
       * Custom command to check page performance metrics
       */
      checkPagePerformance(): Chainable<void>
      
      /**
       * Custom command to check for console errors during test execution
       */
      checkForConsoleErrors(): Chainable<void>
    }
  }
}

/**
 * Command to measure execution time of operations
 */
Cypress.Commands.add('measureTime', (name, callback) => {
  const startTime = performance.now();
  
  callback();
  
  cy.then(() => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    cy.log(`🕒 ${name} took ${duration.toFixed(2)}ms`);
    
    // Store the timing for later analysis
    const timings = Cypress.env('performanceMetrics') || {};
    timings[name] = duration;
    Cypress.env('performanceMetrics', timings);
  });
});

/**
 * Command to check various page performance metrics
 */
Cypress.Commands.add('checkPagePerformance', () => {
  cy.window().then(win => {
    // Get performance entries
    const perfEntries = win.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (perfEntries) {
      const metrics = {
        // Navigation timing
        pageLoadTime: perfEntries.loadEventEnd - perfEntries.startTime,
        domContentLoaded: perfEntries.domContentLoadedEventEnd - perfEntries.startTime,
        firstPaint: 0,
        firstContentfulPaint: 0,
        
        // Resource metrics
        resourceCount: win.performance.getEntriesByType('resource').length,
        resourceSize: win.performance.getEntriesByType('resource')
          .reduce((total: number, res: PerformanceEntry) => {
            const resource = res as PerformanceResourceTiming;
            return total + (resource.encodedBodySize || 0);
          }, 0)
      };
      
      // Get first paint if available (Chrome only)
      const paintEntries = win.performance.getEntriesByType('paint');
      if (paintEntries.length) {
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        
        if (firstPaint) metrics.firstPaint = firstPaint.startTime;
        if (firstContentfulPaint) metrics.firstContentfulPaint = firstContentfulPaint.startTime;
      }
      
      // Log metrics
      cy.log('📊 Performance Metrics:');
      Object.entries(metrics).forEach(([name, value]) => {
        cy.log(`${name}: ${typeof value === 'number' ? value.toFixed(2) + 'ms' : value}`);
      });
      
      // Store for later analysis
      Cypress.env('pagePerformanceMetrics', metrics);
    }
  });
});

/**
 * Command to check for console errors during test
 */
Cypress.Commands.add('checkForConsoleErrors', () => {
  cy.window().then(win => {
    // Create a spy on console.error
    const errorSpy = cy.spy(win.console, 'error');
    
    // Get error logs from the spy
    const errorMessages = errorSpy.getCalls().map(call => call.args.join(' '));
    
    if (errorMessages.length > 0) {
      throw new Error(`Console errors found: ${errorMessages.join('\n')}`);
    }
  });
});
