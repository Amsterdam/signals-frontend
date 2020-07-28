// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';

describe('Create signal parkeeroverlast and check signal details', () => {
  describe('Create signal parkeeroverlast', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:fietsWrak.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1066CD 1045', 'Sloterweg 1045, 1066CD Amsterdam');
      createSignal.setDescription(
        'Voor het Velodrome ligt een fietswrak, het lijkt een beetje op die van Tom Dumoulin.'
      );
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains(questions.overlastInDeOpenbareRuimte.extra_fietswrak.label).should('be.visible');
      cy.contains(questions.overlastInDeOpenbareRuimte.extra_fietswrak.subtitle).should('be.visible');

      // Check if inputfield is optional
      cy.contains('Volgende').click();
      cy.url().should('include', '/incident/telefoon');
      cy.contains('Vorige').click();
      cy.url().should('include', '/incident/vulaan');

      // Input specific information
      cy.get('input').type('Het is een Cervélo P5, rood met wit het voorwiel ontbreekt.');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      createSignal.setPhonenumber('+31612312112');
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
      cy.contains(questions.overlastInDeOpenbareRuimte.extra_fietswrak.shortLabel).should('be.visible');
      cy.contains('Het is een Cervélo P5, rood met wit het voorwiel ontbreekt.').should('be.visible');

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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Nieuw-West').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Sloterweg 1045').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1066CD Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', Cypress.env('emailAddress')).and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', Cypress.env('phoneNumber')).and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Fietswrak (THO)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Overlast in de openbare ruimte').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
