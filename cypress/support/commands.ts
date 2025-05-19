export {};

// Import type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      tab(): Chainable<Element>
    }
  }
}

Cypress.Commands.add('login', (email, password) => {  
  cy.get('input[name=email]').type(email);  
  cy.get('input[name=password]').type(password);  
  cy.get('button[type=submit]').click();  
});

// Add custom command for keyboard tab navigation testing
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  const focusable = 'a[href]:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
  
  if (subject) {
    cy.wrap(subject).trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });
  }
  
  return cy.document().then(document => {
    const activeElement = document.activeElement;
    
    return cy.wrap(activeElement);
  });
});  