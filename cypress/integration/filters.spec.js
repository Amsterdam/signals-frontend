// <reference types="Cypress" />

import * as overviewMap from '../support/commandsRequests';
import { MANAGE_SIGNALS, FILTER, FILTER_ALL_ITEMS, MY_FILTERS } from '../support/selectorsManageIncidents';

describe('Filtering', () => {
  beforeEach(() => {
    cy.server();
    cy.getManageSignalsRoutes();
    cy.route('DELETE', '**/signals/v1/private/me/filters/*').as('deleteFilter');
    cy.route('/signals/v1/private/signals/?stadsdeel=B&status=m&page=1&ordering=-created_at&page_size=50').as(
      'getFilteredSignals'
    );
    cy.route('POST', '/signals/v1/private/me/filters/').as('postFilter');

    localStorage.setItem('accessToken', Cypress.env('token'));

    cy.visitFetch('/manage/incidents/');

    cy.waitForManageSignalsRoutes();
  });

  it('Should setup the testdata', () => {
    overviewMap.createSignalFilters();
  });

  it('Should have no filters', () => {
    cy.get(MANAGE_SIGNALS.buttonMijnFilters)
      .should('be.visible')
      .click();
    cy.get('p')
      .should('contain', 'U heeft geen eigen filter opgeslagen.')
      .and('contain', 'Ga naar ‘Filteren’ en voer een naam in om een filterinstelling op te slaan.');
    cy.get(MANAGE_SIGNALS.buttonCloseMijnFilters)
      .should('be.visible')
      .click();
  });

  it('Should create a filter and filter results', () => {
    // Open page to create filter
    cy.get(MANAGE_SIGNALS.buttonFilteren)
      .should('be.visible')
      .click();

    // Input filter data
    cy.get(FILTER.inputFilterName).type('Status Gemeld Westpoort');
    cy.get(FILTER.checkboxRefresh)
      .should('be.visible')
      .check();
    cy.get(FILTER.checkboxGemeld).check();
    cy.get('#stadsdeel_B').check();

    // Save and apply filter
    cy.get(FILTER.buttonSubmitFilter)
      .should('be.visible')
      .click();
    cy.wait('@postFilter');
    cy.wait('@getFilteredSignals');
    cy.wait('@getFilters');

    // Check Filter data
    cy.get('h1').should('contain', 'Status Gemeld Westpoort (');
    cy.get(MANAGE_SIGNALS.refreshIcon).should('be.visible');
    cy.get(MANAGE_SIGNALS.filterTagList).should('contain', 'Westpoort');
    cy.get(MANAGE_SIGNALS.filterTagList).should('contain', 'Gemeld');

    // Wait is needed to wait for filter to be applied. cy.wait('@getFilters') is not enough.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('body').then(body => {
      if (body.find('[data-testid="pagination"]').length > 0) {
        // Check if signals on first page have correct stadsdeel
        cy.get(MANAGE_SIGNALS.paginationPages)
          .first()
          .click();
        cy.get(MANAGE_SIGNALS.stadsdeelFromSignal).each($e1 => {
          expect($e1).to.have.text('Westpoort');
        });
        // Check if signals on last page have correct stadsdeel
        cy.get(MANAGE_SIGNALS.paginationPages)
          .last()
          .click();
        cy.get(MANAGE_SIGNALS.stadsdeelFromSignal).each($e2 => {
          expect($e2).to.have.text('Westpoort');
        });
      } else {
        cy.get(MANAGE_SIGNALS.stadsdeelFromSignal).each($e3 => { expect($e3).to.have.text('Westpoort'); });
      }
    });

    cy.get(MANAGE_SIGNALS.buttonMijnFilters)
      .should('be.visible')
      .click();
    cy.get('h4').should('contain', 'Status Gemeld Westpoort');

    // Check on 2 filter attributes
    cy.get(MANAGE_SIGNALS.filterTagList)
      .should('contain', 'Gemeld')
      .and('contain', 'Westpoort');
  });

  it('Should delete all filters', () => {
    // Open private filters
    cy.get(MANAGE_SIGNALS.buttonMijnFilters)
      .should('be.visible')
      .click();

    // Delete all filters. This is needed when the filter test fails, then there are some filters left to delete.
    cy.get(MY_FILTERS.buttonDeleteFilter).each($buttonDeleteFilter => {
      cy.get($buttonDeleteFilter).click();
      cy.wait('@deleteFilter');
    });

    // Check if there are no filters
    cy.get('p')
      .should('contain', 'U heeft geen eigen filter opgeslagen.')
      .and('contain', 'Ga naar ‘Filteren’ en voer een naam in om een filterinstelling op te slaan.');
  });

  it('Should create a new filter, select all filters and reset to default values', () => {
    cy.get(MANAGE_SIGNALS.buttonFilteren)
      .should('be.visible')
      .click();
    cy.get(FILTER.inputFilterName).type('Reset to default');
    cy.get(FILTER.checkboxRefresh)
      .should('be.visible')
      .check();

    // Check all checkboxes
    cy.get(FILTER_ALL_ITEMS.selectAllStatus).click();
    cy.get(FILTER_ALL_ITEMS.selectAllStadsdelen).click();
    cy.get(FILTER_ALL_ITEMS.selectAllSource).click();
    cy.get(FILTER_ALL_ITEMS.selectAllGarbage).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllCivilConstructs).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllSubversion).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllPublicParksWater).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllOther).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllDisturbanceCompanies).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllDisturbancePublicSpace).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllDisturbanceWater).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllDisturbanceAnimals).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllDisturbancePersonsGroups).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllClean).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllRoadsTraffic).click({ force: true });
    cy.get(FILTER_ALL_ITEMS.selectAllLiving).click({ force: true });

    // Reset create filter
    cy.get(FILTER.buttonNieuwFilter)
      .should('be.visible')
      .click();

    // Check some elements are unchecked or empty
    cy.get(FILTER.checkboxGemeld).should('not.be.checked');

    cy.get('[name=afval_category_slug]').should('not.be.checked');
    cy.get(FILTER.checkboxRefresh).should('not.be.checked');
    cy.get(FILTER.inputFilterName).should('be.empty');

    // Click cancel
    cy.get(FILTER.buttonCancel)
      .should('be.visible')
      .click();
  });
});
