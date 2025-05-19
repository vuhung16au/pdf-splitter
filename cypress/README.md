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

### Using npm scripts

```bash
# Run all tests (both component and E2E)
npm test

# Run only component tests
npm run test:component

# Run only E2E tests (starts the dev server automatically)
npm run test:e2e

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
│   └── home.cy.ts          # Tests for home page functionality
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
