import { FILTER, MANAGE_SIGNALS } from './selectorsManageIncidents';
import * as routes from './commandsRouting';

/**
 * Custom command to filter signals by a category slug.
 * @example cy.filterByCategorySlug('overig-afval', 'Overig afval');
*/
export const filterCategory = (selector: string, category: string) => {
  cy.get(selector).click({ force: true });
  cy.get(`[data-testid*="checkbox-${category}"]`).each($el => {
    cy.wrap($el).should('be.checked');
  });
  cy.get(selector).click({ force: true });
  cy.get(`[data-testid*="checkbox-${category}"]`).each($el => {
    cy.wrap($el).should('not.be.checked');
  });
};

/**
 * Custom command to filter signals by a specific attribute.
 * @example cy.filterCategory(FILTER_ALL_ITEMS.selectAllStatus, 'status');
*/
export const filterByCategorySlug = (category_slug: string, category: string) => {
  routes.getSortedByTimeRoutes();
  routes.getSortedRoutes();
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
