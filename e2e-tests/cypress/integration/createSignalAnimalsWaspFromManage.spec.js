// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';
import { generateToken } from '../support/jwt';
import { CREATE_SIGNAL } from '../support/selectorsCreateSignal';

describe('Create signal animals from incident management and chek signal details', () => {
  describe('Create signal animals', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });

    it('Initiate create signal from manage', () => {
      cy.server();
      cy.getManageSignalsRoutes();

      cy.visitFetch('/manage/incidents/');

      // Wait till page is loaded
      cy.waitForManageSignalsRoutes();
      cy.openMenu();
      cy.contains('Melden').click();
      cy.checkHeaderText('Beschrijf uw melding');

      cy.visitFetch('incident/beschrijf');
    });

    it('Should search for an address', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wespen.json').as('prediction');

      createSignal.checkDescriptionPage();
      // Select source
      cy.get(CREATE_SIGNAL.dropdownSource).select('Telefoon – Stadsdeel');

      createSignal.setAddress('1012GX 23', 'Oudekerksplein 23, 1012GX Amsterdam');
      createSignal.setDescription('Er is een wespennest bij de hoofdingang van de Oude kerk');
      createSignal.setDateTime('Nu');

      // Check Urgency
      cy.contains('Wat is de urgentie?').should('be.visible');
      cy.contains('Hoog').should('be.visible').click();
      cy.contains('Hoog: melding met spoed oppakken').should('be.visible');
      cy.contains('Laag').should('be.visible').click();
      cy.contains('Laag: interne melding zonder servicebelofte').should('be.visible');
      cy.contains('Normaal').should('be.visible').click();

      // Check Type
      cy.contains('Type').should('be.visible');
      cy.contains('Klacht').should('be.visible').click();

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');
      cy.get(questions.overlastVanDieren.extra_dieren_text.answers)
        .each($element => {
          cy.contains($element).should('be.visible');
        });
      cy.contains('Dierenambulance Amsterdam').should('have.attr', 'href').and('include', 'dierenambulance-amsterdam');
      cy.contains('overlast van dieren').should('have.attr', 'href').and('include', 'veelgevraagd');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.server();
      cy.route('/maps/topografie?bbox=**').as('map');
      cy.postSignalRoutePrivate();

      cy.contains('Volgende').click();
      cy.wait('@map');
      createSignal.checkSummaryPage();

      // Check information provided by user
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPrivate');
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
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Oudekerksplein 23').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1012GX Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Klacht').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Wespen (GGD)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Overlast van dieren').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'Telefoon – Stadsdeel').and('be.visible');
    });
  });
});
