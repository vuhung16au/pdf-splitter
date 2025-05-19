describe('Content Security Policy Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have appropriate CSP headers', () => {
    cy.request('/').then((response) => {
      expect(response.headers).to.have.property('content-security-policy');
      const csp = response.headers['content-security-policy'];
      
      // Check for essential CSP directives
      expect(csp).to.include('default-src');
      expect(csp).to.include('script-src');
      expect(csp).to.include('style-src');
      expect(csp).to.include('img-src');
      expect(csp).to.include('connect-src');
    });
  });

  it('should prevent inline scripts execution', () => {
    // Try to execute an inline script
    cy.window().then((win) => {
      const script = win.document.createElement('script');
      script.textContent = 'window.testInlineScript = true;';
      win.document.body.appendChild(script);
      
      // Verify the script was not executed
      expect(win.testInlineScript).to.be.undefined;
    });
  });

  it('should prevent eval() usage', () => {
    // Try to use eval
    cy.window().then((win) => {
      const result = win.eval('2 + 2');
      expect(result).to.be.undefined;
    });
  });

  it('should restrict resource loading to trusted sources', () => {
    // Try to load a script from an untrusted source
    cy.window().then((win) => {
      const script = win.document.createElement('script');
      script.src = 'https://untrusted-site.com/script.js';
      win.document.body.appendChild(script);
      
      // Verify the script was not loaded
      cy.get('script[src="https://untrusted-site.com/script.js"]').should('not.exist');
    });
  });
}); 