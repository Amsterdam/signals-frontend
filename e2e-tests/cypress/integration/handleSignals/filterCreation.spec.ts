// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import * as requests from '../../support/commandsRequests';
import { MANAGE_SIGNALS, FILTER, MY_FILTERS } from '../../support/selectorsManageIncidents';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { FILTERS } from '../../support/texts';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as general from '../../support/commandsGeneral';

describe('Testdata', () => {
  it('Should setup the testdata', () => {
    requests.createSignalFilters();
    requests.createPrivateSignalForFilters();
  });
});
describe('Filtering', () => {
  beforeEach(() => {
    routes.getManageSignalsRoutes();
    routes.deleteFilterRoute();
    routes.getFilteredSignalsRoute();
    routes.postFilterRoute();

    localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    cy.visit('/manage/incidents/');

    routes.waitForManageSignalsRoutes();
  });

  it('Should have no filters', () => {
    cy.get(MANAGE_SIGNALS.buttonMijnFilters).should('be.visible').click();
    cy.get('p').should('contain', FILTERS.noSavedFilter).and('contain', FILTERS.helpText);
    cy.get(MANAGE_SIGNALS.buttonCloseMijnFilters).should('be.visible').click();
  });

  it('Should create a filter and filter results', () => {
    routes.getSortedRoutes();
    cy.get(MANAGE_SIGNALS.buttonFilter).should('be.visible').click();

    cy.get(FILTER.inputFilterName).type('Status Gemeld Westpoort');
    cy.get(FILTER.checkboxRefresh).should('be.visible').check();
    cy.get(FILTER.checkboxGemeld).check();
    cy.get('#stadsdeel_B').check();

    cy.get(FILTER.buttonSubmitFilter).should('be.visible').click();
    cy.wait('@postFilter');
    cy.wait('@getFilteredSignals');
    cy.wait('@getFilters');
    cy.get('h1').should('contain', 'Status Gemeld Westpoort (');
    cy.get(MANAGE_SIGNALS.refreshIcon).should('be.visible');
    cy.get(MANAGE_SIGNALS.filterTagList).should('contain', 'Westpoort').and('contain', 'Gemeld').and('be.visible');

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedASC');
    cy.get(MANAGE_SIGNALS.firstSignalStadsdeelName).should('have.text', 'Westpoort');

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedDESC');
    cy.get(MANAGE_SIGNALS.firstSignalStadsdeelName).should('have.text', 'Westpoort');

    cy.get(MANAGE_SIGNALS.buttonMijnFilters).should('be.visible').click();
    cy.get('h4').should('contain', 'Status Gemeld Westpoort');

    cy.get(MANAGE_SIGNALS.filterTagList).should('contain', 'Gemeld').and('contain', 'Westpoort');
  });

  it('Should delete all filters', () => {
    cy.get(MANAGE_SIGNALS.buttonMijnFilters).should('be.visible').click();

    // Delete all filters. This is needed when the filter test fails, then there are some filters left to delete.
    cy.get(MY_FILTERS.buttonDeleteFilter).each((buttonDeleteFilter: string) => {
      cy.get(buttonDeleteFilter).click();
      cy.wait('@deleteFilter');
    });

    // Check if there are no filters
    cy.get('p').should('contain', FILTERS.noSavedFilter).and('contain', FILTERS.helpText);
  });

  it('Should create a new filter and reset to default values', () => {
    cy.get(MANAGE_SIGNALS.buttonFilter).should('be.visible').click();
    cy.get(FILTER.inputFilterName).type('Reset to default');
    cy.get(FILTER.checkboxRefresh).should('be.visible').check();

    // Reset create filter
    cy.get(FILTER.buttonNieuwFilter).should('be.visible').click();

    cy.get(FILTER.checkboxRefresh).should('not.be.checked');
    cy.get(FILTER.inputFilterName).should('be.empty');

    cy.get(FILTER.buttonCancel).should('be.visible').click();
  });
  it('Should filter by address and date without saving the filter', () => {
    const todaysDate = general.getTodaysDate();
    routes.getFilterByAddressRoute();
    cy.get(MANAGE_SIGNALS.buttonFilter).click();
    cy.get(FILTER.inputFilterAddres).type('Ruigoord 36');
    cy.get(FILTER.inputFilterDayFrom).type(todaysDate);
    cy.get(FILTER.inputFilterDayBefore).type(todaysDate);
    cy.get(FILTER.buttonSubmitFilter).should('be.visible').click();
    cy.wait('@getAddressFilter');
    cy.get('tbody > tr:first-child :nth-child(5)').should('contain', todaysDate);
    cy.get('tbody > tr:last-child :nth-child(5)').should('contain', todaysDate);
    cy.get(MANAGE_SIGNALS.filterTagList)
      .should('contain', 'Ruigoord 36')
      .and('contain', `Datum: ${todaysDate} t/m ${todaysDate}`)
      .and('be.visible');
  });
  it('Should filter by urgentie hoog', () => {
    routes.getFilterByUrgencyRoute();
    routes.getSortedRoutes();
    cy.get(MANAGE_SIGNALS.buttonFilter).click();

    cy.get(FILTER.checkboxUrgentieHoog).check();

    cy.get(FILTER.buttonSubmitFilter).should('be.visible').click();
    cy.wait('@getUrgency');

    cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'Hoog').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalUrgentie).get('svg').should('exist');

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedASC');
    cy.get(MANAGE_SIGNALS.firstSignalUrgentie).get('svg').should('exist');

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedDESC');
    cy.get(MANAGE_SIGNALS.firstSignalUrgentie).get('svg').should('exist');
  });
  it('Should filter by type klacht', () => {
    routes.getSignalDetailsRoutes();
    routes.getFilterByTypeRoute();
    routes.getSortedRoutes();
    cy.get(MANAGE_SIGNALS.buttonFilter).click();

    cy.get(FILTER.checkboxTypeKlacht).check();

    cy.get(FILTER.buttonSubmitFilter).should('be.visible').click();
    cy.wait('@getType');
    cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'Klacht').and('be.visible');

    cy.get(MANAGE_SIGNALS.firstSignalId).click();
    routes.waitForSignalDetailsRoutes();
    cy.get(SIGNAL_DETAILS.type).should('have.text', 'Klacht');
    cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedASC');
    cy.get(MANAGE_SIGNALS.firstSignalId).click();
    routes.waitForSignalDetailsRoutes();
    cy.get(SIGNAL_DETAILS.type).should('have.text', 'Klacht');
    cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
  });
});
