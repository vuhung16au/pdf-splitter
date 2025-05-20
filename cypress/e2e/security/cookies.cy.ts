describe('Cookie Security Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should set secure cookie attributes', () => {
    cy.getCookies().then((cookies) => {
      cookies.forEach((cookie) => {
        expect(cookie).to.have.property('secure', true);
        expect(cookie).to.have.property('httpOnly', true);
      });
    });
  });

  it('should not expose sensitive data in cookies', () => {
    cy.getCookies().then((cookies) => {
      cookies.forEach((cookie) => {
        expect(cookie.value).to.not.include('password');
        expect(cookie.value).to.not.include('token');
        expect(cookie.value).to.not.include('secret');
      });
    });
  });
}); 