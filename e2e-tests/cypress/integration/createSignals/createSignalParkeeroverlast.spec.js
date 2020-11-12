// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

describe('Create signal parkeeroverlast and check signal details', () => {
  describe('Create signal parkeeroverlast', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:predictions/parkeeroverlast.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1098VZ 35', 'Anfieldroad 35, 1098VZ Amsterdam');
      createSignal.setDescription(
        'Voor onze deur staat al minimaal 5 maanden een auto geparkeerd, deze wordt nooit verplaatst.',
      );
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      cy.contains(questions.overlastInDeOpenbareRuimte.extra_parkeeroverlast.label).should('be.visible');
      cy.contains(questions.overlastInDeOpenbareRuimte.extra_parkeeroverlast.subtitle).should('be.visible');

      // Check if inputfield is optional
      cy.contains('Volgende').click();
      cy.url().should('include', '/incident/telefoon');
      cy.contains('Vorige').click();
      cy.url().should('include', '/incident/vulaan');

      // Input specific information
      cy.get('input').type('Het gaat om een Bugatti La Voiture Noire met kenteken LL-44-ST');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      createSignal.setPhonenumber('0611');
      cy.contains('Volgende').click();
      createSignal.setEmailAddress('siafakemail@fake.nl');
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
      cy.contains(questions.overlastInDeOpenbareRuimte.extra_parkeeroverlast.shortLabel).should('be.visible');
      cy.contains('Het gaat om een Bugatti La Voiture Noire met kenteken LL-44-ST').should('be.visible');

      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.be.visible');
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
    });

    it('Should show the signal details', () => {
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Oost').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Anfieldroad 35').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1098VZ Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', Cypress.env('emailAddress')).and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', Cypress.env('phoneNumber')).and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Parkeeroverlast (ASC, THO)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Overlast in de openbare ruimte').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
