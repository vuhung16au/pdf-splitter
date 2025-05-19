# Browser Compatibility Testing

This document explains how to run browser compatibility tests for the PDF Splitter application.

## Overview

The PDF Splitter application is tested across multiple browsers to ensure consistent functionality and appearance. The testing suite includes:

- **Chrome** (default browser)
- **Firefox**  
- **Safari**

## Running Browser Tests

### Prerequisites

Before running browser tests, ensure you have the browsers installed on your system that you wish to test against.

### Commands

To run tests in specific browsers, use the following npm scripts:

```bash
# Run tests in Chrome
npm run test:chrome

# Run tests in Firefox
npm run test:firefox

# Run tests in Safari
npm run test:safari

# Run tests in all browsers sequentially
npm run test:browsers
```

You can also use the run-tests.sh script directly:

```bash
# Format: ./run-tests.sh [test-type] [browser]
./run-tests.sh e2e chrome
./run-tests.sh e2e firefox
./run-tests.sh e2e safari
```

## Implementation Details

The browser compatibility tests are implemented in:
- `cypress/e2e/browser-compatibility.cy.ts`

This test suite verifies the following aspects across different browsers:

1. **UI rendering consistency** - ensuring all UI elements display correctly
2. **Core functionality** - verifying that PDF uploads, selections, and operations work in each browser
3. **Browser-specific handling** - addressing known issues or differences in browser implementations
4. **Responsive design** - checking that the responsive design works across browsers

## Browser Configuration

Browser configuration is defined in the Cypress configuration file (`cypress.config.ts`). The browsers section specifies which browsers are available for testing.

## Adding More Browsers

To add additional browsers for testing:

1. Update the `browsers` array in `cypress.config.ts`
2. Add browser-specific tests in `cypress/e2e/browser-compatibility.cy.ts`
3. Update the run scripts in `package.json` if needed

## Common Issues

### Safari WebKit

Safari testing requires the WebKit engine to be installed and available to Cypress.

### Firefox Layout Differences

Firefox may render some flex layouts slightly differently. The tests account for these minor differences.

### Browser-Specific File Handling

Different browsers handle file uploads in slightly different ways. The test suite uses appropriate methods for each browser.
