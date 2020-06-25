// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { BEDRIJVEN_HORECA } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Create signal bedrijven en horeca and check signal details', () => {
  describe('Create signal bedrijven en horeca', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should search for an address', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:bedrijvenHoreca.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1012AN 5A', 'Zeedijk 5A, 1012AN Amsterdam');
      createSignal.setDescription(
        'Ik heb ontzettende overlast van cafe het 11e gebod, dronken mensen staan buiten te schreeuwen'
      );
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      cy.get(BEDRIJVEN_HORECA.radioButtonHoreca).click();

      cy.get(BEDRIJVEN_HORECA.inputWieWat)
        .eq(0)
        .type('Klanten van het cafe');
      cy.get(BEDRIJVEN_HORECA.inputAdres)
        .eq(1)
        .type('Op Zeedijk nummer 3');

      cy.get(BEDRIJVEN_HORECA.checkBoxDronken).check();
      cy.get(BEDRIJVEN_HORECA.checkBoxSchreeuwen).check();
      cy.get(BEDRIJVEN_HORECA.checkBoxWildplassen).check();

      cy.get(BEDRIJVEN_HORECA.radioButtonVakerJa).click();

      cy.get(BEDRIJVEN_HORECA.inputDatum)
        .eq(2)
        .type('Elke dag');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      cy.contains('Volgende').click();
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.server();
      cy.postSignalRoutePublic();

      createSignal.checkSummaryPage();

      // Check information provided by user
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains('Horecabedrijf, zoals een café, restaurant, snackbar of kantine').should('be.visible');
      cy.contains('Klanten van het cafe').should('be.visible');
      cy.contains('Op Zeedijk nummer 3').should('be.visible');
      cy.contains('Dronken bezoekers').should('be.visible');
      cy.contains('Schreeuwende bezoekers').should('be.visible');
      cy.contains('Wildplassen').should('be.visible');
      cy.contains('Ja, het gebeurt vaker').should('be.visible');
      cy.contains('Elke dag').should('be.visible');

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
      cy.get('[href*="/manage/incident/"]')
        .contains(Cypress.env('signalId'))
        .click();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.get(SIGNAL_DETAILS.stadsdeel)
        .should('have.text', 'Stadsdeel: Centrum')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet)
        .should('have.text', 'Zeedijk 5A')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity)
        .should('have.text', '1012AN Amsterdam')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.email)
        .should('have.text', '')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber)
        .should('have.text', '')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails)
        .should('have.text', 'Nee')
        .and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency)
        .should('have.text', 'Normaal')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.type)
        .should('have.text', 'Melding')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory)
        .should('have.text', 'Overlast door bezoekers (niet op terras) (ASC, THO)')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory)
        .should('have.text', 'Overlast Bedrijven en Horeca')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.source)
        .should('have.text', 'online')
        .and('be.visible');
    });
  });
});
