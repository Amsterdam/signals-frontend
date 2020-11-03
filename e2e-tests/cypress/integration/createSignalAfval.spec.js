// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import { generateToken } from '../support/jwt';

describe('Create signal afval and check signal details', () => {
  describe('Create signal', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:afval.json').as('prediction');

      createSignal.checkDescriptionPage();

      createSignal.setAddress('1035LA 43', 'Sandwijk 43, 1035LA Amsterdam');
      createSignal.setDescription(
        'Voor mijn deur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?',
      );
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      createSignal.setPhonenumber('06-12345678');
      cy.contains('Volgende').click();
      createSignal.setEmailAddress('siafakemail@amsterdam.nl');
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
      cy.contains(Cypress.env('phoneNumber')).should('be.visible');
      cy.contains(Cypress.env('emailAddress')).should('be.visible');

      cy.get(CREATE_SIGNAL.checkBoxSharingAllowed).check().should('be.checked');

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
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Noord').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Sandwijk 43').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1035LA Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', Cypress.env('emailAddress')).and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', Cypress.env('phoneNumber')).and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Ja').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Veeg- / zwerfvuil (STW)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Schoon').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'Interne melding').and('be.visible');
    });
  });
});
