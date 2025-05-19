## Browser Compatibility Tests

Our browser compatibility tests ensure the PDF Splitter application works correctly across different browsers (Chrome, Firefox, Safari). These tests are implemented in `cypress/e2e/browser-compatibility.cy.ts`.

### Running Browser Tests

To run browser-specific tests:

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

### How Browser Tests Work

Each browser test verifies that:

1. **UI Components** render correctly in the specific browser
2. **Core Functionality** (file uploading, processing, downloading) works as expected
3. **Browser-specific behaviors** are handled appropriately

The tests use Cypress' browser configuration to run the same test suite in different browsers:

```typescript
// From cypress/e2e/browser-compatibility.cy.ts
context('Chrome browser', () => {
  testCoreFunctionality();
  // Chrome-specific tests...
});

context('Firefox browser', { browser: 'firefox' }, () => {
  testCoreFunctionality();
  // Firefox-specific tests...
});

context('Safari browser', { browser: 'safari' }, () => {
  testCoreFunctionality();
  // Safari-specific tests...
});
```

### Common Browser-Specific Issues

1. **Firefox**: May handle drag-and-drop events differently, requiring alternative approaches
2. **Safari**: May have unique flexbox layout handling and require specific CSS workarounds
3. **Chrome**: Most features work as expected, but serves as our baseline for comparison

For detailed information on browser compatibility testing, see:
- `cypress/e2e/README_BROWSER_TESTING.md`
