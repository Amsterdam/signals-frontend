// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { BOTEN } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/signalForSearch.json';

// There is no elastic search in the e2e environment, you can run tests on a local machine with elastic search installed
describe('Search signals', () => {
  describe('Create signal boten', () => {
    before(() => {
      cy.postSignalRoutePublic();
      cy.stubPreviewMap();
      cy.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath);

      cy.get(BOTEN.radioButtonRondvaartbootNee).click({ force: true });
      cy.get(BOTEN.inputNaamBoot).type('Pakjesboot 12');
      cy.get(BOTEN.inputNogMeer).type('De boot vaart over de Amstel heen en weer');

      cy.contains('Volgende').click();

      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(fixturePath);
      createSignal.checkQuestions(fixturePath);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

      createSignal.checkThanksPage();
      createSignal.saveSignalId();
    });
  });

  describe('Find signals by search term', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.viewport('macbook-15');
      cy.getManageSignalsRoutes();
      cy.getSearchResultsRoute();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show filtered signals and clear search term', () => {
      cy.get(MANAGE_SIGNALS.searchBar).type('Pakjesboot{enter}');
      cy.wait('@getSearchResults');
      cy.get(MANAGE_SIGNALS.searchResultsTag).should('have.text', 'Zoekresultaten voor "Pakjesboot"').and('be.visible');
      cy.get(MANAGE_SIGNALS.clearSearchTerm).click();
      cy.wait('@getSignals');
      cy.get(MANAGE_SIGNALS.searchResultsTag).should('not.exist');
    });
    it('Should filter on text in description', () => {
      createSignal.searchAndCheck('Pakjesboot', SIGNAL_DETAILS.descriptionText);
    });
    it.skip('Should filter on text in main category', () => {
      createSignal.searchAndCheck('Overlast op het water', SIGNAL_DETAILS.mainCategory);
    });
    it('Should filter on text in subcategory', () => {
      createSignal.searchAndCheck('Snel varen', SIGNAL_DETAILS.subCategory);
    });
    it('Should filter on signal ID', () => {
      cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
        createSignal.searchAndCheck(`${json.signalId}`, SIGNAL_DETAILS.signalId);
      });
    });
    it('Should filter on phonenumber', () => {
      createSignal.searchAndCheck('1122211122', SIGNAL_DETAILS.phoneNumber);
    });
    it('Should filter on email address', () => {
      createSignal.searchAndCheck('ikgagevonden@worden.nl', SIGNAL_DETAILS.email);
    });
  });
});
