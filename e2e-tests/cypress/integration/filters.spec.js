// <reference types="Cypress" />

import * as requests from '../support/commandsRequests';
import * as filtering from '../support/commandsFiltering';
import { MANAGE_SIGNALS, FILTER, FILTER_ALL_ITEMS, MY_FILTERS } from '../support/selectorsManageIncidents';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import { generateToken } from '../support/jwt';

describe('Filtering', () => {
  beforeEach(() => {
    cy.server();
    cy.getManageSignalsRoutes();
    cy.route('DELETE', '**/signals/v1/private/me/filters/*').as('deleteFilter');
    cy.route('/signals/v1/private/signals/?stadsdeel=B&status=m&page=1&ordering=-created_at&page_size=50').as(
      'getFilteredSignals'
    );
    cy.route('POST', '/signals/v1/private/me/filters/').as('postFilter');

    localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));

    cy.visitFetch('/manage/incidents/');

    cy.waitForManageSignalsRoutes();
  });

  it('Should setup the testdata', () => {
    requests.createSignalFilters();

    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/afval/sub_categories/overig-afval`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/civiele-constructies/sub_categories/afwatering-brug`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/ondermijning/sub_categories/vermoeden`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/eikenprocessierups`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/overig/sub_categories/overige-dienstverlening`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overlast-terrassen`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/overlast-in-de-openbare-ruimte/sub_categories/markten`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/overlast-op-het-water/sub_categories/olie-op-het-water`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/overlast-van-dieren/sub_categories/ganzen`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/overlast-van-en-door-personen-of-groepen/sub_categories/overlast-door-afsteken-vuurwerk`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/schoon/sub_categories/uitwerpselen`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/parkeerautomaten`);
    requests.createPublicSignalForFilters(`${Cypress.env('backendUrl')}/signals/v1/public/terms/categories/wonen/sub_categories/vakantieverhuur`);

    requests.createPrivateSignalForFilters();
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
    cy.route('**&page=1&ordering=id&page_size=50').as('getSortedASC');
    cy.route('**&page=1&ordering=-id&page_size=50').as('getSortedDESC');
    cy.get(MANAGE_SIGNALS.buttonFilteren)
      .should('be.visible')
      .click();

    cy.get(FILTER.inputFilterName).type('Status Gemeld Westpoort');
    cy.get(FILTER.checkboxRefresh)
      .should('be.visible')
      .check();
    cy.get(FILTER.checkboxGemeld).check();
    cy.get('#stadsdeel_B').check();

    cy.get(FILTER.buttonSubmitFilter)
      .should('be.visible')
      .click();
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

    cy.get(MANAGE_SIGNALS.buttonMijnFilters)
      .should('be.visible')
      .click();
    cy.get('h4').should('contain', 'Status Gemeld Westpoort');

    cy.get(MANAGE_SIGNALS.filterTagList)
      .should('contain', 'Gemeld')
      .and('contain', 'Westpoort');
  });

  it('Should delete all filters', () => {
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

  it('Should create a new filter and reset to default values', () => {
    cy.get(MANAGE_SIGNALS.buttonFilteren)
      .should('be.visible')
      .click();
    cy.get(FILTER.inputFilterName).type('Reset to default');
    cy.get(FILTER.checkboxRefresh)
      .should('be.visible')
      .check();

    // Reset create filter
    cy.get(FILTER.buttonNieuwFilter)
      .should('be.visible')
      .click();

    cy.get(FILTER.checkboxRefresh).should('not.be.checked');
    cy.get(FILTER.inputFilterName).should('be.empty');

    cy.get(FILTER.buttonCancel)
      .should('be.visible')
      .click();
  });
  it.skip('Should check and uncheck all checkboxes', () => {
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
  it('Should filter on address and date without saving the filter', () => {
    cy.route('/signals/v1/private/signals/?address_text=**').as('getAddressFilter');
    const todaysDate = Cypress.moment().format('DD-MM-YYYY');
    cy.get(MANAGE_SIGNALS.buttonFilteren).click();
    cy.get(FILTER.inputFilterAddres).type('Ruigoord 36');
    cy.get(FILTER.inputFilterDayFrom).type(todaysDate);
    cy.get(FILTER.inputFilterDayBefore).type(todaysDate);
    cy.get(FILTER.buttonSubmitFilter)
      .should('be.visible')
      .click();
    cy.wait('@getAddressFilter');
    cy.get('tbody > tr:first-child :nth-child(3)').should('contain', todaysDate);
    cy.get('tbody > tr:last-child :nth-child(3)').should('contain', todaysDate);
    cy.get(MANAGE_SIGNALS.filterTagList)
      .should('contain', 'Ruigoord 36')
      .and('contain', `Datum: ${todaysDate} t/m ${todaysDate}`)
      .and('be.visible');
  });
  it('Should check checkboxes per category', () => {
    cy.get(MANAGE_SIGNALS.buttonFilteren).click();
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllStatus, 'status');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllStadsdelen, 'stadsdeel');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllSource, 'source');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllGarbage, 'afval');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllCivilConstructs, 'civiele-constructies');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllSubversion, 'ondermijning');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllPublicParksWater, 'openbaar-groen-en-water');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllOther, 'overig');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllDisturbanceCompanies, 'overlast-bedrijven-en-horeca');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllDisturbancePublicSpace, 'overlast-in-de-openbare-ruimte');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllDisturbanceWater, 'overlast-op-het-water');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllDisturbanceAnimals, 'overlast-van-dieren');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllDisturbancePersonsGroups, 'overlast-van-en-door-personen-of-groepen');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllClean, 'schoon');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllRoadsTraffic, 'wegen-verkeer-straatmeubilair');
    filtering.filterCategory(FILTER_ALL_ITEMS.selectAllLiving, 'wonen');
  });

  it('Should filter on Afval', () => {
    filtering.filterOnCategorySlug('overig-afval', 'Overig afval');
  });
  it('Should filter on Civiele constructies', () => {
    filtering.filterOnCategorySlug('afwatering-brug', 'Afwatering brug');
  });
  it('Should filter on Ondermijning', () => {
    filtering.filterOnCategorySlug('vermoeden', 'Vermoeden');
  });
  it('Should filter on Openbaar groen en water', () => {
    filtering.filterOnCategorySlug('eikenprocessierups', 'Eikenprocessierups');
  });
  it('Should filter on Overig', () => {
    filtering.filterOnCategorySlug('overige-dienstverlening', 'Overige dienstverlening');
  });
  it('Should filter on Overlast bedrijven en horeca', () => {
    filtering.filterOnCategorySlug('overlast-terrassen', 'Overlast terrassen');
  });
  it('Should filter on Overlast in de openbare ruimte', () => {
    filtering.filterOnCategorySlug('markten', 'Markten');
  });
  it('Should filter on Overlast op het water', () => {
    filtering.filterOnCategorySlug('olie-op-het-water', 'Olie op het water');
  });
  it('Should filter on Overlast van dieren', () => {
    filtering.filterOnCategorySlug('ganzen', 'Ganzen');
  });
  it('Should filter on Overlast van en door personen of groepen', () => {
    filtering.filterOnCategorySlug('overlast-door-afsteken-vuurwerk', 'Overlast door afsteken vuurwerk');
  });
  it('Should filter on Schoon', () => {
    filtering.filterOnCategorySlug('uitwerpselen', 'Uitwerpselen');
  });
  it('Should filter on Wegen verkeer straatmeubilair', () => {
    filtering.filterOnCategorySlug('parkeerautomaten', 'Parkeerautomaten');
  });
  it('Should filter on Wonen', () => {
    filtering.filterOnCategorySlug('vakantieverhuur', 'Vakantieverhuur');
  });
  it('Should filter on urgentie hoog', () => {
    cy.route('**?priority=high&page=1&ordering=-created_at&page_size=50').as('getUrgencyHigh');
    cy.route('**&page=1&ordering=id&page_size=50').as('getSortedASC');
    cy.route('**&page=1&ordering=-id&page_size=50').as('getSortedDESC');
    cy.get(MANAGE_SIGNALS.buttonFilteren).click();

    cy.get(FILTER.checkboxUrgentieHoog).check();

    cy.get(FILTER.buttonSubmitFilter).should('be.visible').click();
    cy.wait('@getUrgencyHigh');

    cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'Hoog').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalUrgentie).should('have.text', 'Hoog');

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedASC');
    cy.get(MANAGE_SIGNALS.firstSignalUrgentie).should('have.text', 'Hoog');

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedDESC');
    cy.get(MANAGE_SIGNALS.firstSignalUrgentie).should('have.text', 'Hoog');
  });
  it('Should filter on type klacht', () => {
    cy.getSignalDetailsRoutes();
    cy.route('**?type=COM&page=1&ordering=-created_at&page_size=50').as('getTypeKlacht');
    cy.route('**&page=1&ordering=id&page_size=50').as('getSortedASC');
    cy.route('**&page=1&ordering=-id&page_size=50').as('getSortedDESC');
    cy.get(MANAGE_SIGNALS.buttonFilteren).click();

    cy.get(FILTER.checkboxTypeKlacht).check();

    cy.get(FILTER.buttonSubmitFilter).should('be.visible').click();
    cy.wait('@getTypeKlacht');
    cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'Klacht').and('be.visible');

    cy.get(MANAGE_SIGNALS.firstSignalId).click();
    cy.waitForSignalDetailsRoutes();
    cy.get(SIGNAL_DETAILS.type).should('have.text', 'Klacht');
    cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedASC');
    cy.get(MANAGE_SIGNALS.firstSignalId).click();
    cy.waitForSignalDetailsRoutes();
    cy.get(SIGNAL_DETAILS.type).should('have.text', 'Klacht');
    cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
  });
  it('Should filter on Bron Interswitch', () => {
    cy.getSignalDetailsRoutes();
    cy.route('**?source=Telefoon – Interswitch&page=1&ordering=-created_at&page_size=50').as('getBronInterswitch');
    cy.route('**&page=1&ordering=id&page_size=50').as('getSortedASC');
    cy.route('**&page=1&ordering=-id&page_size=50').as('getSortedDESC');
    cy.get(MANAGE_SIGNALS.buttonFilteren).click();

    cy.get(FILTER.checkboxBronInterswitch).check();

    cy.get(FILTER.buttonSubmitFilter).should('be.visible').click();
    cy.wait('@getBronInterswitch');
    cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'Telefoon – Interswitch').and('be.visible');

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedASC');
    cy.get(MANAGE_SIGNALS.firstSignalId).click();
    cy.waitForSignalDetailsRoutes();
    cy.get(SIGNAL_DETAILS.source).should('have.text', 'Telefoon – Interswitch');
    cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedDESC');
    cy.get(MANAGE_SIGNALS.firstSignalId).click();
    cy.waitForSignalDetailsRoutes();
    cy.get(SIGNAL_DETAILS.source).should('have.text', 'Telefoon – Interswitch');
    cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
  });
});
