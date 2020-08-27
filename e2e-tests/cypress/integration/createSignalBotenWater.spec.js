// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { BOTEN } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';
import { generateToken } from '../support/jwt';

describe('Create signal boten and check signal details', () => {
  describe('Create signal boten', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should search for an address', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:water.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1096AC 7', 'Korte Ouderkerkerdijk 7, 1096AC Amsterdam');
      createSignal.setDescription('Een grote boot vaart al de hele dag hard door het water.');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Select rondvaartboot company and name
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_rondvaartboot.label).should('be.visible');
      cy.get(BOTEN.radioButtonRondvaartbootJa).click();
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_rederij.label).should('be.visible');
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_rederij.subtitle).should('be.visible');
      cy.get('select').select(questions.overlastOpHetWater.extra_boten_snelheid_rederij.values.amsterdam_boat_center);
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_naamboot.label).should('be.visible');
      cy.get(BOTEN.inputNaamBoot).type('Bota Fogo');
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_meer.label).should('be.visible');
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_meer.subtitle).should('be.visible');
      cy.get(BOTEN.inputNogMeer).type('De boot voer richting Ouderkerk aan de Amstel');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
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
      cy.contains(Cypress.env('emailAddress')).should('be.visible');
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_rondvaartboot.shortLabel).should('be.visible');
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_rederij.shortLabel).should('be.visible');
      cy.contains('Amsterdam Boat Center').should('be.visible');
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_naamboot.shortLabel).should('be.visible');
      cy.contains('Bota Fogo').should('be.visible');
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_meer.shortLabel).should('be.visible');
      cy.contains('De boot voer richting Ouderkerk aan de Amstel').should('be.visible');

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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Oost').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Korte Ouderkerkerdijk 7').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1096AC Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', Cypress.env('emailAddress')).and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Snel varen (ASC, WAT)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Overlast op het water').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
