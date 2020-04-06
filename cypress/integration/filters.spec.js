// <reference types="Cypress" />

// Import all selector for manage incidents (MI)
import { MANAGE_SIGNALS, FILTER, FILTER_ALL_ITEMS, MY_FILTERS } from '../support/selectorsManageIncidents';

describe('Filtering', () => {
  beforeEach(() => {
    cy.server();
    cy.getManageSignalsRoutes();
    cy.route('DELETE', '**/signals/v1/private/me/filters/*').as('deleteFilter');
    cy.route('**/signals/v1/private/signals/?stadsdeel=A&status=m&page=1&ordering=stadsdeel,-created_at&page_size=50').as('getSortedASC');
    cy.route('**/signals/v1/private/signals/?stadsdeel=A&status=m&page=1&ordering=-stadsdeel,-created_at&page_size=50').as('getSortedDESC');
    localStorage.setItem('accessToken', 'TEST123');

    cy.visitFetch('/manage/incidents/');

    // Wait till page is loaded
    cy.wait('@getFilters');
    cy.wait('@getCategories');
    cy.wait('@getSignals');
    cy.wait('@getUserInfo');
  });

  it('Should have no filters', () => {
    cy.get(MANAGE_SIGNALS.buttonMijnFilters).should('be.visible').click();
    cy.get('p').should('contain', 'U heeft geen eigen filter opgeslagen.').and('contain', 'Ga naar ‘Filteren’ en voer een naam in om een filterinstelling op te slaan.');
    cy.get(MANAGE_SIGNALS.buttonCloseMijnFilters).should('be.visible').click();
  });

  it('Should create a filter', () => {
    // Open page to create filter
    cy.get(MANAGE_SIGNALS.buttonFilteren).should('be.visible').click();

    // Input filter data
    cy.get(FILTER.inputFilterName).type('Status Gemeld Centrum');
    cy.get(FILTER.checkboxRefresh).should('be.visible').check();
    cy.get(FILTER.checkboxGemeld).check();
    cy.get('#stadsdeel_A').check();

    // Save and apply filter
    cy.get(FILTER.buttonSubmitFilter).should('be.visible').click();
    cy.wait('@getFilters');

    // Check Filter data
    cy.get('h1').should('contain', 'Status Gemeld Centrum (');
    cy.get(MANAGE_SIGNALS.refreshIcon).should('be.visible');
    cy.get(MANAGE_SIGNALS.filterTagList).should('contain', 'Centrum');
    cy.get(MANAGE_SIGNALS.filterTagList).should('contain', 'Gemeld');

    // Click on 4th column stadsdeel to sort ASC
    cy.get('th').eq(3).should('contain', 'Stadsdeel').click();
    cy.wait('@getSortedASC');
    cy.get('th.sort.sort-up').should('be.visible');

    // After sorting, first element should contain stadsdeel Centrum
    cy.get(MANAGE_SIGNALS.firstSignalStadsdeelName).should('contain', 'Centrum');

    // Click on 4th column stadsdeel to sort DESC
    cy.get('th').eq(3).should('contain', 'Stadsdeel').click();
    cy.wait('@getSortedDESC');
    cy.get('th.sort.sort-down').should('be.visible');
    cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting

    // After sorting, first element should still contain stadsdeel Centrum. Because there is a filter on Centrum
    cy.get(MANAGE_SIGNALS.firstSignalStadsdeelName).should('contain', 'Centrum');

    // Open private filters
    cy.get(MANAGE_SIGNALS.buttonMijnFilters).should('be.visible').click();
    cy.get('h4').should('contain', 'Status Gemeld Centrum');

    // Check on 2 filter attributes
    cy.get(MANAGE_SIGNALS.filterTagList).should('contain', 'Gemeld').and('contain', 'Centrum');
  });

  it('Should delete all filters', () => {
    // Open private filters
    cy.get(MANAGE_SIGNALS.buttonMijnFilters).should('be.visible').click();

    // Delete all filters. This is needed when the filter test fails, then there are some filters left to delete.
    cy.get(MY_FILTERS.buttonDeleteFilter).each($buttonDeleteFilter => {
      cy.get($buttonDeleteFilter).click();
      cy.wait('@deleteFilter');
    });

    // Check if there are no filters
    cy.get('p').should('contain', 'U heeft geen eigen filter opgeslagen.').and('contain', 'Ga naar ‘Filteren’ en voer een naam in om een filterinstelling op te slaan.');

    // Check if filter is deleted in signal view. At the moment it isn't.
  });

  it('Should create e new filter, select all filters and reset to default values', () => {
    cy.get(MANAGE_SIGNALS.buttonFilteren).should('be.visible').click();
    cy.get(FILTER.inputFilterName).type('Reset to default');
    cy.get(FILTER.checkboxRefresh).should('be.visible').check();

    // Check all checkboxes
    cy.get(FILTER_ALL_ITEMS.selectAllStatus).click();
    cy.get(FILTER_ALL_ITEMS.selectAllStadsdelen).click();
    cy.get(FILTER_ALL_ITEMS.selectAllSource).click();
    cy.get(FILTER_ALL_ITEMS.selectAllGarbage).click();
    cy.get(FILTER_ALL_ITEMS.selectAllCivilConstructs).click();
    cy.get(FILTER_ALL_ITEMS.selectAllSubversion).click();
    cy.get(FILTER_ALL_ITEMS.selectAllPublicParksWater).click();
    cy.get(FILTER_ALL_ITEMS.selectAllOther).click();
    cy.get(FILTER_ALL_ITEMS.selectAllDisturbanceCompanies).click();
    cy.get(FILTER_ALL_ITEMS.selectAllDisturbancePublicSpace).click();
    cy.get(FILTER_ALL_ITEMS.selectAllDisturbanceWater).click();
    cy.get(FILTER_ALL_ITEMS.selectAllDisturbanceAnimals).click();
    cy.get(FILTER_ALL_ITEMS.selectAllDisturbancePersonsGroups).click();
    cy.get(FILTER_ALL_ITEMS.selectAllClean).click();
    cy.get(FILTER_ALL_ITEMS.selectAllRoadsTraffic).click();
    cy.get(FILTER_ALL_ITEMS.selectAllLiving).click();

    // Reset create filter
    cy.get(FILTER.buttonNieuwFilter).should('be.visible').click();

    // Check some elements are unchecked or empty
    cy.get(FILTER.checkboxGemeld).should('not.be.checked');

    cy.get('[name=afval_category_slug]').should('not.be.checked');
    cy.get(FILTER.checkboxRefresh).should('not.be.checked');
    cy.get(FILTER.inputFilterName).should('be.empty');

    // Click cancel
    cy.get(FILTER.buttonCancel).should('be.visible').click();
  });
});
