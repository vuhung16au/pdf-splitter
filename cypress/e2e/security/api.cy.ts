describe('API Security Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should prevent SQL injection', () => {
    const sqlInjectionPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users; --"
    ];
    
    sqlInjectionPayloads.forEach((payload) => {
      cy.request({
        method: 'POST',
        url: '/api/search',
        body: { query: payload },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });
  });

  it('should validate API input data', () => {
    const invalidInputs = [
      { email: 'invalid-email', age: 'not-a-number' },
      { name: 123, email: 'test@example.com' },
      { age: -1, email: 'test@example.com' }
    ];
    
    invalidInputs.forEach((input) => {
      cy.request({
        method: 'POST',
        url: '/api/submit',
        body: input,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('errors');
      });
    });
  });

  it('should implement proper CORS policies', () => {
    const origins = [
      'http://malicious-site.com',
      'https://trusted-site.com',
      'http://localhost:3000'
    ];
    
    origins.forEach((origin) => {
      cy.request({
        method: 'OPTIONS',
        url: '/api/data',
        headers: {
          'Origin': origin
        },
        failOnStatusCode: false
      }).then((response) => {
        if (origin === 'http://localhost:3000') {
          expect(response.headers).to.have.property('access-control-allow-origin');
          expect(response.headers['access-control-allow-origin']).to.equal(origin);
        } else {
          expect(response.headers).to.not.have.property('access-control-allow-origin');
        }
      });
    });
  });

  it('should prevent sensitive data exposure', () => {
    cy.request('/api/user/profile').then((response) => {
      const sensitiveFields = ['password', 'ssn', 'creditCard', 'token'];
      
      sensitiveFields.forEach((field) => {
        expect(response.body).to.not.have.property(field);
      });
    });
  });

  it('should implement proper rate limiting', () => {
    // Make multiple requests in quick succession
    for (let i = 0; i < 100; i++) {
      cy.request({
        method: 'GET',
        url: '/api/data',
        failOnStatusCode: false
      });
    }
    
    // Should be rate limited
    cy.request({
      method: 'GET',
      url: '/api/data',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(429);
    });
  });
}); 