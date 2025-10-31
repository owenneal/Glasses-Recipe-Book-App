describe('App Navigation', () => {
  it('should navigate to the About page', () => {
    cy.visit('/');
    cy.contains('About').click();
    cy.url().should('include', '/about');
    cy.contains('Welcome to the About Page');
  });
});
