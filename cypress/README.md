# Testing Guide for PDF Splitter

This project uses [Cypress](https://www.cypress.io/) for both component and end-to-end testing.

## Quick Start

```bash
# Run only E2E tests (recommended for CI/CD)
npm run test:e2e

# Run all tests
npm test
```

## Test Types

### Component Tests

Component tests verify that individual React components work correctly in isolation. These tests:
- Mount components directly
- Test UI interactions and state changes
- Are faster than E2E tests and focus on component behavior

### End-to-End Tests

E2E tests verify that the application works correctly from the user's perspective. These tests:
- Open a real browser and navigate through the application
- Test complete user flows (uploading PDFs, splitting, downloading)
- Ensure all parts of the application work together

## Running Tests

**Note:** Some component tests are currently being updated to handle React 19 and the latest Cypress version (14.x). For CI/CD pipelines, we recommend focusing on the E2E tests which provide the best coverage of critical user workflows.

### Current Status

✅ **E2E Tests**: All passing and stable  
⚠️ **Component Tests**: Being updated for React 19 compatibility

- DragDropArea component tests: 4 passing, 2 failing
- PdfUploader component tests: 4 passing, 1 failing
- PDF Utilities tests: 1 passing, 2 failing
- E2E Complete Workflow tests: 2 passing
- E2E Multiple PDF Files tests: 4 passing
- E2E Responsive UI tests: 6 passing

### Using npm scripts

```bash
# Run all tests (both component and E2E)
npm test

# Run only component tests
npm run test:component

# Run only E2E tests (starts the dev server automatically)
npm run test:e2e

# Run specific workflow test
npm run cypress run --spec "cypress/e2e/complete-workflow.cy.ts"

# Run multiple PDFs workflow test
npm run cypress run --spec "cypress/e2e/multiple-pdfs.cy.ts"

# Run responsive UI tests
npm run cypress run --spec "cypress/e2e/responsive-ui.cy.ts"

# Open Cypress interactive runner
npm run cypress
```

### Using the Cypress UI

For a more interactive experience with visual feedback:

```bash
npm run cypress
```

This will open the Cypress Test Runner where you can choose to run component tests or E2E tests.

## Test File Structure

```bash
cypress/
├── component/              # Component tests
│   ├── DragDropArea.cy.tsx # Tests for DragDropArea component
│   ├── PdfUploader.cy.tsx  # Tests for PdfUploader component
│   └── pdfUtils.cy.ts      # Tests for PDF utility functions
├── e2e/                    # End-to-end tests
│   ├── home.cy.ts          # Tests for home page functionality
│   ├── complete-workflow.cy.ts # Tests for single PDF workflow
│   ├── multiple-pdfs.cy.ts # Tests for multiple PDF workflow
│   └── responsive-ui.cy.ts # Tests for UI responsiveness across different screen sizes
├── fixtures/               # Test data files
├── support/                # Support files and custom commands
│   ├── commands.ts         # Custom Cypress commands
│   ├── component.ts        # Component test configuration
│   └── e2e.ts              # E2E test configuration
└── tsconfig.json           # TypeScript configuration for tests
```

## Writing New Tests

### Component Test Example

```typescript
import MyComponent from '../../app/components/MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    cy.mount(<MyComponent prop="value" />);
  });

  it('should render correctly', () => {
    cy.contains('Expected text').should('be.visible');
  });
});
```

### E2E Test Example

```typescript
describe('User flow', () => {
  it('should allow uploading and processing a PDF', () => {
    cy.visit('/');
    cy.get('[data-testid="pdf-uploader"]').should('exist');
    // Simulate file upload and verify results
  });
});
```

## Mocking External Services

For tests that require mocking external services or APIs:

```typescript
// Mock file saving
cy.stub(fileSaver, 'saveAs').as('saveAsStub');

// Verify mock was called correctly
cy.get('@saveAsStub').should('have.been.called');
```

## Best Practices

1. Add `data-testid` attributes to important UI elements
2. Keep tests independent and focused
3. Clean up state between tests
4. Minimize test flakiness by using reliable selectors
5. Test both success and error cases

## Core Workflow Tests

We have dedicated end-to-end tests that cover the complete user workflows and responsive UI:

### Single PDF Workflow

```typescript
// From cypress/e2e/complete-workflow.cy.ts
it('should upload a PDF file, split it, and download the result', () => {
  // Step 1: Upload a PDF file
  cy.fixture('sample.pdf', 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then(blob => {
      const testFile = new File([blob], 'sample.pdf', { type: 'application/pdf' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      
      cy.get('[data-testid="pdf-uploader"]').trigger('drop', { 
        dataTransfer: { files: dataTransfer.files }
      });
    });
  
  // Step 2: Split the PDF
  cy.get('[data-testid="split-button"]').click();
  
  // Step 3: Download the ZIP file
  cy.get('[data-testid="download-zip-button"]').click();
  
  // Verify the download was triggered
  cy.get('@saveAsStub').should('have.been.calledOnce');
});
```

### Multiple PDF Files Workflow

```typescript
// From cypress/e2e/multiple-pdfs.cy.ts
it('should upload multiple PDF files one after another', () => {
  // Upload first PDF file
  cy.fixture('sample.pdf', 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then(blob => {
      const testFile = new File([blob], 'sample.pdf', { type: 'application/pdf' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      
      cy.get('[data-testid="pdf-uploader"]').trigger('drop', { 
        dataTransfer: { files: dataTransfer.files, types: ['Files'] }
      });
    });
  
  // Verify first file was uploaded
  cy.contains('Selected Files (1)').should('be.visible');
  
  // Upload second PDF file
  cy.fixture('test.pdf', 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then(blob => {
      const testFile = new File([blob], 'test.pdf', { type: 'application/pdf' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      
      cy.get('[data-testid="pdf-uploader"]').trigger('drop', { 
        dataTransfer: { files: dataTransfer.files, types: ['Files'] }
      });
    });
  
  // Process files and test error handling
  it('should handle error when processing an invalid PDF file', () => {
    // Create an invalid PDF file and verify error message appears
  });
});
```

### UI Responsiveness Tests

Our UI responsiveness tests validate that the PDF Splitter application is fully responsive across different device sizes, from desktop to mobile. These tests:

```typescript
// From cypress/e2e/responsive-ui.cy.ts
describe('UI Responsiveness Tests', () => {
  it('should display correctly on desktop viewport', () => {
    // Set viewport to desktop size
    cy.viewport(1280, 800);
    
    // Check that elements are properly sized and visible
    cy.get('header h1').should('be.visible');
    cy.get('[data-testid="pdf-uploader"]').should('be.visible');
    // More assertions...
  });

  it('should adapt to tablet viewport', () => {
    cy.viewport(768, 1024);
    // Verify that UI adapts to medium-sized screens
  });

  it('should be fully responsive on mobile viewport', () => {
    cy.viewport(375, 667); // iPhone SE size
    // Verify that UI adapts to small screens
  });

  it('should maintain functional upload area in all screen sizes', () => {
    // Test PDF uploading functionality across multiple viewport sizes
    const viewports = [
      { width: 1280, height: 800, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    viewports.forEach(size => {
      cy.viewport(size.width, size.height);
      // Test file uploading and verify UI responses
    });
  });

  it('should maintain proper layout during window resize', () => {
    // Test dynamic resizing from large to small viewports
  });

  it('should handle PDF uploads and display file list responsively', () => {
    // Test that the file list display is properly responsive
  });
});
```

These tests ensure our application:

- Displays correctly across a range of device sizes (desktop, tablet, mobile)
- Maintains functionality on all screen sizes
- Properly handles file uploads and displays on any device
- Adapts properly during window resizing
- Has readable text and properly sized UI elements at all breakpoints

To run the responsive UI tests:

```bash
npm run cypress run --spec "cypress/e2e/responsive-ui.cy.ts"
```

## Troubleshooting

### Common Issues

1. **Component Test Failures with React 19**
   - The `mount` function from Cypress may need updates to work with React 19
   - Use `cy.stub()` inside `beforeEach()` hooks, not outside them
   - Don't directly reference spies across test cases; use aliases

2. **Styling Class Assertions**
   - Target specific elements with more precise selectors
   - Use `data-testid` attributes where possible instead of class names
   - Check for presence of class with `.should('have.class', 'class-name')`

3. **PDF File Mocking**
   - Be aware that you can't fully test PDF processing in component tests
   - Focus on validating function calls and error states
   - Use E2E tests for full validation of the PDF processing workflow

4. **SaveAs Testing Issues**
   - When testing file downloads, you may encounter issues with the saveAs stub
   - For reliable tests, focus on verifying UI state changes rather than the actual download
