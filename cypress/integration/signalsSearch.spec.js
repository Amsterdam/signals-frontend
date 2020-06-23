// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import { BOTEN } from '../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../support/selectorsManageIncidents';

describe('Create signal boten', () => {
  describe('Create signal boten', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should search for an address', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:water.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1096AC 45A', 'Korte Ouderkerkerdijk 45A, 1096AC Amsterdam');
      createSignal.setDescription(
        'Een boot met de naam Pakjesboot 12 vaart de hele dag over de Amstel heen en weer met een ongekende snelheid'
      );
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      cy.get(BOTEN.radioButtonRondvaartbootNee).click();
      cy.get(BOTEN.inputNaamBoot).type('Pakjesboot 12');
      cy.get(BOTEN.inputNogMeer).type('De boot vaart over de Amstel heen en weer');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      createSignal.setPhonenumber('1122211122');
      cy.contains('Volgende').click();
      createSignal.setEmailAddress('ikgagevonden@worden.nl');
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.server();
      cy.postSignalRoutePublic();
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
    });

    it('Should show the last screen', () => {
      createSignal.checkThanksPage();
      // Capture signal id to check details later
      createSignal.getSignalId();
    });
  });

  describe('Find signals by search term', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', Cypress.env('token'));
      cy.server();
      cy.viewport('macbook-15');
      cy.getManageSignalsRoutes();
      cy.route('/signals/v1/private/search?*').as('getSearchResults');
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show filtered signals and clear search term', () => {
      cy.get(MANAGE_SIGNALS.searchBar).type('Pakjesboot{enter}');
      cy.wait('@getSearchResults');
      cy.get(MANAGE_SIGNALS.searchResultsTag).should('have.text', 'Zoekresultaten voor "Pakjesboot"').and('be.visible');
      cy.get(MANAGE_SIGNALS.clearSearchTerm).click();
      cy.wait('@getSignals');
      cy.get(MANAGE_SIGNALS.searchResultsTag).should('not.be.visible');
    });
    it('Should filter on text in description', () => {
      createSignal.searchAndCheck('Pakjesboot', SIGNAL_DETAILS.descriptionText);
    });
    it('Should filter on text in main category', () => {
      createSignal.searchAndCheck('Overlast op het water', SIGNAL_DETAILS.mainCategory);
    });
    it('Should filter on text in subcategory', () => {
      createSignal.searchAndCheck('Snel varen', SIGNAL_DETAILS.subCategory);
    });
    it('Should filter on signal ID', () => {
      createSignal.searchAndCheck(`${Cypress.env('signalId')}`, SIGNAL_DETAILS.signalId);
    });
    it('Should filter on phonenumber', () => {
      createSignal.searchAndCheck('1122211122', SIGNAL_DETAILS.phoneNumber);
    });
    it('Should filter on email address', () => {
      createSignal.searchAndCheck('ikgagevonden@worden.nl', SIGNAL_DETAILS.email);
    });
  });
});
