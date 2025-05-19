/**
 * Custom commands for mobile testing
 */

// Add custom command for touch events
Cypress.Commands.add('touch', { prevSubject: 'element' }, (subject, eventType, options = {}) => {
  const defaultOptions = {
    clientX: 100,
    clientY: 100,
    ...options
  };

  return cy.wrap(subject).trigger(eventType, {
    touches: [{ clientX: defaultOptions.clientX, clientY: defaultOptions.clientY }]
  });
});

// Add custom command for swipe gestures
Cypress.Commands.add('swipe', { prevSubject: 'element' }, (subject, direction, distance = 100) => {
  const startX = direction === 'left' ? 300 : direction === 'right' ? 100 : 200;
  const startY = direction === 'up' ? 300 : direction === 'down' ? 100 : 200;
  const endX = direction === 'left' ? startX - distance : direction === 'right' ? startX + distance : startX;
  const endY = direction === 'up' ? startY - distance : direction === 'down' ? startY + distance : startY;

  return cy.wrap(subject)
    .trigger('touchstart', { touches: [{ clientX: startX, clientY: startY }] })
    .trigger('touchmove', { touches: [{ clientX: endX, clientY: endY }] })
    .trigger('touchend');
});

// Add custom command for long press
Cypress.Commands.add('longPress', { prevSubject: 'element' }, (subject, duration = 500) => {
  return cy.wrap(subject)
    .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
    .wait(duration)
    .trigger('touchend');
});

// Add custom command for pinch gesture
Cypress.Commands.add('pinch', { prevSubject: 'element' }, (subject, scale = 2) => {
  return cy.wrap(subject)
    .trigger('gesturestart', { scale: 1 })
    .trigger('gesturechange', { scale })
    .trigger('gestureend', { scale });
});

// Add custom command for double tap
Cypress.Commands.add('doubleTap', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject)
    .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
    .trigger('touchend')
    .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
    .trigger('touchend');
});

// Add custom command for mobile file upload
Cypress.Commands.add('mobileFileUpload', { prevSubject: 'element' }, (subject, file) => {
  return cy.wrap(subject)
    .find('input[type="file"]')
    .selectFile(file, { force: true });
});

// Add custom command for checking touch target size
Cypress.Commands.add('hasTouchTargetSize', { prevSubject: 'element' }, (subject, minSize = 44) => {
  return cy.wrap(subject).then(($el) => {
    const height = $el.height();
    const width = $el.width();
    
    expect(height).to.be.greaterThan(minSize - 1);
    expect(width).to.be.greaterThan(minSize - 1);
    
    return cy.wrap($el);
  });
});

// Add custom command for checking element spacing
Cypress.Commands.add('hasProperSpacing', { prevSubject: 'element' }, (subject, minSpacing = 8) => {
  return cy.wrap(subject).then(($el) => {
    const nextEl = $el.next();
    if (nextEl.length) {
      const spacing = nextEl.offset().top - $el.offset().top;
      expect(spacing).to.be.greaterThan(minSpacing - 1);
    }
    return cy.wrap($el);
  });
}); 