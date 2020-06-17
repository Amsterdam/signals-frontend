// <reference types="Cypress" />

// Import all selector for manage incidents (MI)
import { MANAGE_SIGNALS } from '../support/selectorsManageIncidents';

describe('Sorting', () => {
  beforeEach(() => {
    cy.server();
    cy.getManageSignalsRoutes();
    cy.route('**/signals/v1/private/signals/?page=1&ordering=stadsdeel,-created_at&page_size=50').as('getSortedASC');
    cy.route('**/signals/v1/private/signals/?page=1&ordering=-stadsdeel,-created_at&page_size=50').as('getSortedDESC');
    localStorage.setItem('accessToken', Cypress.env('token'));
    cy.visitFetch('/manage/incidents/');
    cy.waitForManageSignalsRoutes();
  });

  it('Should have no filters', () => {
    // Click on 4th column stadsdeel to sort ASC
    cy.get('th')
      .eq(3)
      .should('contain', 'Stadsdeel')
      .click();
    cy.wait('@getSortedASC');
    cy.get('th.sort.sort-up').should('be.visible');

    // After sorting, first element should contain stadsdeel Centrum
    cy.get(MANAGE_SIGNALS.firstSignalStadsdeelName).should('contain', 'Centrum');

    // Click on 4th column stadsdeel to sort DESC
    cy.get('th')
      .eq(3)
      .should('contain', 'Stadsdeel')
      .click();
    cy.wait('@getSortedDESC');
    cy.get('th.sort.sort-down').should('be.visible');

    // After sorting, first element should still contain stadsdeel Centrum. Because there is a filter on Centrum
    cy.get(MANAGE_SIGNALS.firstSignalStadsdeelName).should('contain', 'Zuidoost');
  });
});
