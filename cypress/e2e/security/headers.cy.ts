describe('Security Headers Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have proper security headers', () => {
    cy.request('/').then((response) => {
      // Check Content Security Policy
      expect(response.headers).to.have.property('content-security-policy');
      
      // Check X-Frame-Options
      expect(response.headers).to.have.property('x-frame-options');
      expect(response.headers['x-frame-options']).to.equal('DENY');
      
      // Check X-Content-Type-Options
      expect(response.headers).to.have.property('x-content-type-options');
      expect(response.headers['x-content-type-options']).to.equal('nosniff');
      
      // Check X-XSS-Protection
      expect(response.headers).to.have.property('x-xss-protection');
      expect(response.headers['x-xss-protection']).to.equal('1; mode=block');
      
      // Check Strict-Transport-Security
      expect(response.headers).to.have.property('strict-transport-security');
      expect(response.headers['strict-transport-security']).to.include('max-age=');
    });
  });

  it('should have proper CORS headers', () => {
    cy.request({
      method: 'OPTIONS',
      url: '/api/data',
      headers: {
        'Origin': 'http://localhost:3000'
      }
    }).then((response) => {
      expect(response.headers).to.have.property('access-control-allow-origin');
      expect(response.headers).to.have.property('access-control-allow-methods');
      expect(response.headers).to.have.property('access-control-allow-headers');
    });
  });
}); 