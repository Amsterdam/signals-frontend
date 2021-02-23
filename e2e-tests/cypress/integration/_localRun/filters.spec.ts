import * as requests from '../../support/commandsRequests';
import { MANAGE_SIGNALS, FILTER, FILTER_ALL_ITEMS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as filters from '../../support/commandsFiltering';

// The duration of these tests is too long for runnign in the e2e environment
describe.skip('Filtering', () => {
  beforeEach(() => {
    routes.getManageSignalsRoutes();
    routes.deleteFilterRoute();
    routes.getFilteredSignalsRoute();
    routes.postFilterRoute();

    localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    cy.visit('/manage/incidents/');

    routes.waitForManageSignalsRoutes();
  });

  it('Should setup the testdata', () => {
    requests.createSignalFilters();
    requests.createPrivateSignalForFilters();
  });
  it('Should check and uncheck all checkboxes', () => {
    cy.get(MANAGE_SIGNALS.buttonFilteren)
      .should('be.visible')
      .click();
    cy.get('[type="checkbox"]').each($el => {
      cy.wrap($el).check({ force: true }).should('be.checked');
    });
    cy.get(FILTER.buttonNieuwFilter)
      .should('be.visible')
      .click();
    cy.get('[type="checkbox"]').each($el => {
      cy.wrap($el).should('not.be.checked');
    });
  });
  it('Should check checkboxes per category', () => {
    cy.get(MANAGE_SIGNALS.buttonFilteren).click();
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllStatus, 'status');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllStadsdelen, 'stadsdeel');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllSource, 'source');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllGarbage, 'afval');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllCivilConstructs, 'civiele-constructies');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllSubversion, 'ondermijning');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllPublicParksWater, 'openbaar-groen-en-water');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllOther, 'overig');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllDisturbanceCompanies, 'overlast-bedrijven-en-horeca');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllDisturbancePublicSpace, 'overlast-in-de-openbare-ruimte');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllDisturbanceWater, 'overlast-op-het-water');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllDisturbanceAnimals, 'overlast-van-dieren');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllDisturbancePersonsGroups, 'overlast-van-en-door-personen-of-groepen');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllClean, 'schoon');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllRoadsTraffic, 'wegen-verkeer-straatmeubilair');
    filters.filterCategory(FILTER_ALL_ITEMS.selectAllLiving, 'wonen');
  });
});
