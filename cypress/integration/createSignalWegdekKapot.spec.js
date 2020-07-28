// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { WEGDEK } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';

describe('Create signal wegdek kapot and check signal details', () => {
  describe('Create signal wegdek kapot', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should search for an address', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wegdek.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1105AT 50', 'Schepenbergweg 50, 1105AT Amsterdam');
      createSignal.setDescription('Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Select road type
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_onderhoud_stoep_straat_en_fietspad.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_onderhoud_stoep_straat_en_fietspad.subtitle).should('be.visible');
      cy.get(WEGDEK.inputSoortWegdek).type('Asfalt');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.server();
      cy.route('/maps/topografie?bbox=**').as('map');
      cy.postSignalRoutePublic();

      cy.contains('Volgende').click();
      cy.wait('@map');
      createSignal.checkSummaryPage();

      // Check information provided by user
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_onderhoud_stoep_straat_en_fietspad.shortLabel).should('be.visible');
      cy.contains('Asfalt');

      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
    });

    it('Should show the last screen', () => {
      createSignal.checkThanksPage();
      // Capture signal id to check details later
      createSignal.getSignalId();
    });
  });
  describe('Check data created signal', () => {
    before(() => {
      localStorage.setItem('accessToken', Cypress.env('token'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });

    it('Should show the signal details', () => {
      cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Zuidoost').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Schepenbergweg 50').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1105AT Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory)
        .should('have.text', 'Onderhoud stoep, straat en fietspad (STW)')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Wegen, verkeer, straatmeubilair').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
