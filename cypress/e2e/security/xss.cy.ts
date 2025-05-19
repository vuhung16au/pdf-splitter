describe('XSS Security Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should prevent XSS in input fields', () => {
    const xssPayload = '<script>alert("XSS")</script>';
    
    // Test input field
    cy.get('input[type="text"]').first().type(xssPayload);
    cy.get('input[type="text"]').first().should('have.value', xssPayload);
    
    // Verify the script is not executed
    cy.on('window:alert', () => {
      throw new Error('XSS attack was successful');
    });
  });

  it('should sanitize user input in displayed content', () => {
    const xssPayload = '<img src="x" onerror="alert(\'XSS\')">';
    
    // Test if the payload is sanitized when displayed
    cy.get('input[type="text"]').first().type(xssPayload);
    cy.get('body').should('not.contain', '<img src="x" onerror="alert(\'XSS\')">');
  });

  it('should prevent XSS in URL parameters', () => {
    const xssPayload = '<script>alert("XSS")</script>';
    cy.visit(`/?q=${encodeURIComponent(xssPayload)}`);
    
    // Verify the script is not executed
    cy.on('window:alert', () => {
      throw new Error('XSS attack was successful');
    });
  });
}); 