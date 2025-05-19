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
        
        // Add memory usage polyfill for non-Chrome browsers
        if (!('memory' in win.performance)) {
          // @ts-ignore - Adding a polyfill
          win.performance.memory = { usedJSHeapSize: 0 };
        }
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
    
    it('should handle drag events smoothly', () => {
      // Measure performance during drag operations
      const startTime = Date.now();
      
      // Simulate drag operation
      cy.get('[data-testid="pdf-uploader"]')
        .trigger('dragenter')
        .trigger('dragover')
        .then(() => {
          const dragResponseTime = Date.now() - startTime;
          expect(dragResponseTime).to.be.lessThan(100);
          cy.log(`Drag response time: ${dragResponseTime}ms`);
        });
    });
  });

  /**
   * PDF Processing Tests
   */
  describe('PDF Processing Performance', () => {
    it('should process single PDF file efficiently', () => {
      // Get the test PDF and upload it
      cy.get('@testPdf').then(testFile => {
        // Start measuring time
        const startTime = Date.now();
        
        // Upload the file
        cy.get('[data-testid="pdf-uploader"] input[type="file"]')
          .selectFile([testFile], { force: true });
        
        // Click split button
        cy.contains('button', 'Split PDFs').click();
        
        // Wait for processing to complete
        cy.contains('Download', { timeout: 10000 }).should('be.visible')
          .then(() => {
            const processingTime = Date.now() - startTime;
            
            // Processing should complete within reasonable time (adjust threshold as needed)
            expect(processingTime).to.be.lessThan(5000);
            cy.log(`Single PDF processing time: ${processingTime}ms`);
          });
      });
    });
    
    it('should handle concurrent PDF processing efficiently', () => {
      // Upload two PDFs in quick succession to test concurrent processing
      cy.fixture('sample.pdf', 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then(blob => {
          const pdf1 = new File([blob], 'test1.pdf', { type: 'application/pdf' });
          const pdf2 = new File([blob], 'test2.pdf', { type: 'application/pdf' });
          
          // Start measuring time
          const startTime = Date.now();
          
          // Upload both files
          cy.get('[data-testid="pdf-uploader"] input[type="file"]')
            .selectFile([pdf1, pdf2], { force: true });
          
          // Click split
          cy.contains('button', 'Split PDFs').click();
          
          // Wait for processing to complete
          cy.contains('Download', { timeout: 15000 }).should('be.visible')
            .then(() => {
              const processingTime = Date.now() - startTime;
              
              // Check if processing time is reasonable for multiple files
              expect(processingTime).to.be.lessThan(10000);
              cy.log(`Multiple PDF processing time: ${processingTime}ms`);
            });
        });
    });
    
    it('should handle large PDF files without crashing', () => {
      // Attempt to process a larger PDF file
      cy.get('@largePdf').then(largeFile => {
        // Start measuring time
        const startTime = Date.now();
        
        // Upload the large file
        cy.get('[data-testid="pdf-uploader"] input[type="file"]')
          .selectFile([largeFile], { force: true });
        
        // Click split button
        cy.contains('button', 'Split PDFs').click();
        
        // Wait for processing with a longer timeout
        cy.contains('Download', { timeout: 30000 }).should('be.visible')
          .then(() => {
            const processingTime = Date.now() - startTime;
            cy.log(`Large PDF processing time: ${processingTime}ms`);
            
            // We don't assert a specific time here since it depends on file size
            // Just ensure it completes without crashing
          });
      });
    });
  });

  /**
   * Memory Usage Tests
   */
  describe('Memory Usage', () => {
    it('should not have significant memory leaks during usage', () => {
      // Take memory baseline
      cy.window().then(win => {
        const initialMemory = win.performance.memory?.usedJSHeapSize || 0;
        cy.log(`Initial memory usage: ${initialMemory / (1024 * 1024)} MB`);
        
        // Perform a series of operations
        cy.get('@testPdf').then(testFile => {
          cy.get('[data-testid="pdf-uploader"] input[type="file"]')
            .selectFile([testFile], { force: true });
          
          cy.contains('button', 'Split PDFs').click();
          
          // Wait for processing to complete
          cy.contains('Download', { timeout: 10000 }).should('be.visible');
          
          // Clear and repeat to check for memory leaks
          cy.contains('button', 'Clear').click();
          
          // Check memory after operations
          cy.window().then(win => {
            const finalMemory = win.performance.memory?.usedJSHeapSize || 0;
            const memoryDiff = finalMemory - initialMemory;
            
            cy.log(`Memory increase: ${memoryDiff / (1024 * 1024)} MB`);
            
            // Memory increase should not be excessive
            // This is a heuristic and may need adjustment
            expect(memoryDiff).to.be.lessThan(50 * 1024 * 1024); // Less than 50MB increase
          });
        });
      });
    });
  });

  /**
   * Error Handling Performance
   */
  describe('Error Handling Performance', () => {
    it('should gracefully handle invalid file uploads without performance degradation', () => {
      // Create an invalid file
      const invalidFile = new File(['not a PDF'], 'not-a-pdf.txt', { type: 'text/plain' });
      
      const startTime = Date.now();
      
      // Upload the invalid file
      cy.get('[data-testid="pdf-uploader"] input[type="file"]')
        .selectFile([invalidFile], { force: true });
      
      // Verify error is shown quickly
      cy.get('body').then($body => {
        if ($body.find('[role="alert"]').length > 0) {
          cy.get('[role="alert"]').should('be.visible')
            .then(() => {
              const errorTime = Date.now() - startTime;
              expect(errorTime).to.be.lessThan(500);
              cy.log(`Error handling time: ${errorTime}ms`);
            });
        } else {
          // If no error is shown, the app should still be responsive
          const responseTime = Date.now() - startTime;
          expect(responseTime).to.be.lessThan(1000);
        }
      });
    });
  });
});
