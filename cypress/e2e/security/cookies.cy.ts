describe('Cookie Security Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should set secure cookie attributes', () => {
    cy.getCookies().then((cookies) => {
      cookies.forEach((cookie) => {
        // Check for secure flag
        expect(cookie.secure).to.be.true;
        
        // Check for httpOnly flag
        expect(cookie.httpOnly).to.be.true;
        
        // Check for SameSite attribute
        expect(cookie.sameSite).to.be.oneOf(['Strict', 'Lax']);
      });
    });
  });

  it('should not expose sensitive data in cookies', () => {
    cy.getCookies().then((cookies) => {
      cookies.forEach((cookie) => {
        // Check that no sensitive data is stored in cookie names
        expect(cookie.name).to.not.include('password');
        expect(cookie.name).to.not.include('token');
        expect(cookie.name).to.not.include('secret');
        
        // Check that no sensitive data is stored in cookie values
        expect(cookie.value).to.not.include('password');
        expect(cookie.value).to.not.include('token');
        expect(cookie.value).to.not.include('secret');
      });
    });
  });

  it('should properly handle session cookies', () => {
    // Login to get session cookie
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('form').submit();

    // Verify session cookie is set
    cy.getCookie('session').should('exist');
    cy.getCookie('session').should('have.property', 'httpOnly', true);
    cy.getCookie('session').should('have.property', 'secure', true);
  });
}); 