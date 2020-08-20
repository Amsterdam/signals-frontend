// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CONTAINERS } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';
import { generateToken } from '../support/jwt';

describe('Create signal container and check signal details', () => {
  describe('Create signal cointainer', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:container.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1012AB 15', 'Stationsplein 15, 1012AB Amsterdam');
      createSignal.setDescription('De container voor de deur is kapot, de klep gaat niet open.');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Select container soort and number
      cy.contains(questions.afval.extra_container_kind.label).should('be.visible');
      cy.get(CONTAINERS.inputContainerSoort).eq(0).type('Een restafval container');
      cy.contains(questions.afval.extra_container_number.label).should('be.visible');
      cy.get(CONTAINERS.inputContainerNummer).eq(1).type('Nummertje 666');

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
      cy.contains(questions.afval.extra_container_kind.shortLabel);
      cy.contains('Een restafval container').should('be.visible');
      cy.contains(questions.afval.extra_container_number.shortLabel);
      cy.contains('Nummertje 666').should('be.visible');

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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Centrum').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Stationsplein 15').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1012AB Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Container is kapot (AEG)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Afval').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
