import { FILTER, MANAGE_SIGNALS } from './selectorsManageIncidents';

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

export const filterOnCategorySlug = (category_slug, category) => {
  cy.getSortedByTimeRoutes();
  cy.getSortedRoutes();
  cy.get(MANAGE_SIGNALS.buttonFilteren).click();

  cy.get(`[data-testid*="sub_categories/${category_slug}"]`).check();

  cy.get(FILTER.buttonSubmitFilter).should('be.visible').click();
  cy.wait('@getSortedTimeDESC');

  if (category_slug === 'vermoeden') {
    cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'Ondermijning: Alles').and('be.visible');
  }
  else {
    cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', category).and('be.visible');
  }
  cy.get(MANAGE_SIGNALS.firstSignalSubcategorie).should('have.text', category);

  cy.get('th').contains('Id').click();
  cy.wait('@getSortedASC');
  cy.get(MANAGE_SIGNALS.firstSignalSubcategorie).should('have.text', category);

  cy.get('th').contains('Id').click();
  cy.wait('@getSortedDESC');
  cy.get(MANAGE_SIGNALS.firstSignalSubcategorie).should('have.text', category);
};
