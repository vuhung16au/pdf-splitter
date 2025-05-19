// Import commands.js using ES2015 syntax:
import './commands';

// Import global styles
// Comment out global styles as they're causing mounting issues
// import '../../app/globals.css';

// For Cypress 14, we need to use @cypress/react
import { mount } from '@cypress/react';

// Add mount command for React components
Cypress.Commands.add('mount', mount);

// Augment the Cypress namespace to include type definitions for
// the custom mount command with React 18
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test on uncaught exceptions
  return false;
});
