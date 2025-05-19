# Performance Testing

This directory contains end-to-end tests focused on measuring and monitoring the performance of the PDF Splitter application. These tests help ensure the application remains responsive and efficient for users.

## Key Performance Metrics

The performance tests measure various aspects of the application:

1. **Page Load Time** - How quickly the application loads initially
2. **UI Responsiveness** - How quickly the interface responds to user interactions
3. **PDF Processing Time** - The efficiency of PDF handling operations
4. **Memory Usage** - How well the application manages memory during use
5. **Resource Loading** - How efficiently resources like CSS and JavaScript are loaded
6. **Error Handling Performance** - How quickly and efficiently errors are handled

## Running Performance Tests

To run the performance tests:

```bash
npx cypress run --spec "cypress/e2e/performance.cy.ts"
```

For visual feedback during test development:

```bash
npx cypress open --e2e
```

## Interpreting Results

The performance tests output metrics to the Cypress log. These metrics can be used to:

1. Establish baselines for application performance
2. Detect performance regressions
3. Identify areas for optimization

## Notes for Test Maintenance

- Adjust timeout and threshold values based on your specific environment and requirements
- Some tests rely on browser-specific APIs (like `performance.memory`) and include polyfills for cross-browser compatibility
- Consider your test environment when interpreting results, as performance can vary based on hardware and network conditions
