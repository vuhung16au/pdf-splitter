# Browser Compatibility Testing

This document explains how to run browser compatibility tests for the PDF Splitter application.

## Overview

The PDF Splitter application is tested across multiple browsers to ensure consistent functionality and appearance. The testing suite includes:

- **Chrome** (default browser)
- **Microsoft Edge**
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

# Run tests in Microsoft Edge
npm run test:edge

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
./run-tests.sh e2e edge
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

### Browser Installation Requirements

Before running tests in different browsers, you need to install the browsers and ensure they're properly configured for Cypress:

#### Chrome (Already supported)

Chrome should work out of the box with Cypress as long as it's installed on your system.

#### Microsoft Edge

Edge is fully supported in Cypress and should work without additional configuration if the browser is already installed:

```bash
# Verify Edge is detected by Cypress
npx cypress info
```

#### Firefox Installation

Firefox requires additional setup:

```bash
# Install Firefox browser if not already installed
brew install firefox

# For Cypress to recognize Firefox, you may need to install the Cypress Firefox launcher
npm install -D cypress-firefox
```

#### Safari WebKit

Safari testing is more complex and requires WebKit to be installed:

```bash
# Install WebKit for Cypress
brew install --cask safari-technology-preview

# Additional configuration may be needed
# See: https://docs.cypress.io/guides/guides/launching-browsers
```

Note: As of May 2025, Safari has limited support in Cypress. You might need to use Safari Technology Preview or other workarounds.

### Browser Detection

You can check which browsers are available to Cypress by running:

```bash
npx cypress open
```

Then look at the browser dropdown in the Cypress UI to see available browsers.

### Firefox Layout Differences

Firefox may render some flex layouts slightly differently. The tests account for these minor differences.

### Browser-Specific File Handling

Different browsers handle file uploads in slightly different ways. The test suite uses appropriate methods for each browser.
