export const filterCategory = (selector, category) => {
  cy.get(selector).click({ force: true });
  cy.get(`[data-testid*="checkbox-${category}"]`).each($el => {
    cy.wrap($el).should('be.checked');
  });
  cy.get(selector).click({ force: true });
  cy.get(`[data-testid*="checkbox-${category}"]`).each($el => {
    cy.wrap($el).should('not.be.checked');
  });
};
