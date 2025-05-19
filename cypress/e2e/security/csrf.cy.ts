describe('CSRF Protection Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should include CSRF token in form submissions', () => {
    // Check if CSRF token is present in forms
    cy.get('form').should('have.attr', 'data-csrf-token');
  });

  it('should reject requests without CSRF token', () => {
    // Attempt to submit form without CSRF token
    cy.window().then((win) => {
      const xhr = new win.XMLHttpRequest();
      xhr.open('POST', '/api/submit', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ data: 'test' }));
      
      // Should receive 403 Forbidden
      cy.wrap(xhr).should('have.property', 'status', 403);
    });
  });

  it('should validate CSRF token on each request', () => {
    // Get the CSRF token
    cy.get('form').invoke('attr', 'data-csrf-token').then((token) => {
      // Make a request with invalid token
      cy.request({
        method: 'POST',
        url: '/api/submit',
        headers: {
          'X-CSRF-Token': 'invalid-token',
          'Content-Type': 'application/json'
        },
        body: { data: 'test' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(403);
      });
    });
  });
}); 