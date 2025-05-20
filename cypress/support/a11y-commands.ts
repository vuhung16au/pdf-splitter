/// <reference path="./a11y-commands.d.ts" />

// Additional commands specific to accessibility testing

// Tab key navigation command
Cypress.Commands.add('tabUntil', { prevSubject: 'optional' }, (subject, selector, options = {}): Cypress.Chainable<JQuery<HTMLElement>> => {
  const {
    maxNumberOfTabs = 10, // Default limit of 10 tabs
    timeout = 4000, // Default timeout of 4s
  } = options;

  function tabAndCheck(iteration = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    if (iteration >= maxNumberOfTabs) {
      throw new Error(`Tabbed ${maxNumberOfTabs} times but didn't find element matching "${selector}"`);
    }
    
    // Press the Tab key
    cy.focused().trigger('keydown', { keyCode: 9, key: 'Tab', which: 9 });
    
    // Check if the element matches the selector
    return cy.focused().then(($el: JQuery<HTMLElement>) => {
      const matches = $el.is(selector);
      if (matches) {
        return cy.wrap($el);
      }
      return tabAndCheck(iteration + 1);
    });
  }
  
  // If no subject is provided, start with the first focusable element in body
  if (!subject) {
    cy.get('body').focus();
  } else {
    cy.wrap(subject).focus();
  }
  
  return tabAndCheck();
});

// Check for accessible names on elements
Cypress.Commands.add('hasAccessibleName', { prevSubject: true }, (subject): Cypress.Chainable<JQuery<HTMLElement>> => {
  return cy.wrap(subject).then(($el: JQuery<HTMLElement>) => {
    const text = $el.text().trim();
    const ariaLabel = $el.attr('aria-label');
    const ariaLabelledBy = $el.attr('aria-labelledby');
    const title = $el.attr('title');
    const alt = $el.attr('alt');
    
    // Check various ways an element could have an accessible name
    const hasAccessibleName = (
      text !== '' || 
      ariaLabel !== undefined || 
      ariaLabelledBy !== undefined || 
      title !== undefined || 
      alt !== undefined ||
      $el.find('*[aria-label], img[alt], *[title]').length > 0
    );
    
    expect(hasAccessibleName).to.be.true;
    
    return cy.wrap($el);
  });
});

// Check if an element is keyboard accessible
Cypress.Commands.add('isKeyboardAccessible', { prevSubject: true }, (subject): Cypress.Chainable<JQuery<HTMLElement>> => {
  return cy.wrap(subject).then(($el: JQuery<HTMLElement>) => {
    // Interactive elements that should be natively keyboard accessible
    const nativelyAccessible = ['a', 'button', 'input', 'select', 'textarea'];
    
    const tagName = $el.prop('tagName').toLowerCase();
    const hasTabIndex = $el.attr('tabindex') !== undefined && $el.attr('tabindex') !== '-1';
    const isNativelyAccessible = nativelyAccessible.includes(tagName);
    
    // Element should either be natively accessible or have a non-negative tabindex
    const isAccessible = isNativelyAccessible || hasTabIndex;
    
    expect(isAccessible).to.be.true;
    
    return cy.wrap($el);
  });
});
