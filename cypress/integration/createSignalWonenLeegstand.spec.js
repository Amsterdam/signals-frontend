// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_LEEGSTAND } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Create signal wonen leegstand and check signal details', () => {
  describe('Create signal wonen leegstand', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wonenLeegstand.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1101DS 600', 'Arena boulevard 600, 1101DS Amsterdam');
      createSignal.setDescription(
        'Woning heeft leeg gestaan. Soms is iemand in de avond aanwezig. Het is verschrikkelijk.'
      );
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Check if fields are mandatory
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.errorItem)
        .should('contain', 'Dit is een verplicht veld')
        .and('have.length', 3);

      // Input specific information
      cy.contains('Weet u wie de eigenaar is van de woning?').should('be.visible');
      cy.get(WONEN_LEEGSTAND.inputEigenaar)
        .eq(0)
        .type('A. Hitchcock');

      cy.contains('Hoe lang staat de woning al leeg?').should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegZesMaandenOfLanger)
        .check()
        .should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegMinderDanZesMaanden)
        .check()
        .should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegPeriodeWeetIkNiet)
        .check()
        .should('be.checked');

      cy.contains('Wordt de woning af en toe nog gebruikt?').should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktWeetIkNiet)
        .check()
        .should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktNee)
        .check()
        .should('be.checked');
      cy.contains('Wat is de naam van de persoon die soms in de woning is?').should('not.be.visible');
      cy.contains('Wat doet deze persoon in de woning?').should('not.be.visible');
      cy.contains('Op welke dag/tijd is deze persoon op het adres?').should('not.be.visible');

      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktJa)
        .check()
        .should('be.checked');

      cy.contains('Wat is de naam van de persoon die soms in de woning is?').should('be.visible');
      cy.contains('Wat doet deze persoon in de woning?').should('be.visible');
      cy.contains('Op welke dag/tijd is deze persoon op het adres?').should('be.visible');

      // Check if inputfields are optional
      cy.contains('Volgende').click();
      cy.url().should('include', '/incident/telefoon');
      cy.contains('Vorige').click();
      cy.url().should('include', '/incident/vulaan');

      cy.get(WONEN_LEEGSTAND.inputNaam)
        .eq(1)
        .type('J. Aniston');
      cy.get(WONEN_LEEGSTAND.inputWatDoetPersoon)
        .eq(2)
        .type('Deze persoon zit de hele dag te acteren');
      cy.get(WONEN_LEEGSTAND.inputTijdstip)
        .eq(3)
        .type('Vooral in de avond');

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

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains('Naam eigenaar').should('be.visible');
      cy.contains('A. Hitchcock').should('be.visible');
      cy.contains('Periode leegstand').should('be.visible');
      cy.contains('Weet ik niet').should('be.visible');
      cy.contains('Woning gebruik').should('be.visible');
      cy.contains('Ja, soms is er iemand in de woning').should('be.visible');
      cy.contains('Naam persoon').should('be.visible');
      cy.contains('J. Aniston').should('be.visible');
      cy.contains('Activiteit in de woning').should('be.visible');
      cy.contains('Deze persoon zit de hele dag te acteren').should('be.visible');
      cy.contains('Iemand aanwezig').should('be.visible');
      cy.contains('Vooral in de avond').should('be.visible');

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
      cy.getSignalDetailsRoutes();
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
        .should('have.text', 'Stadsdeel: Zuidoost')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet)
        .should('have.text', 'Arena boulevard 600')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity)
        .should('have.text', '1101DS Amsterdam')
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
        .should('have.text', 'Leegstand (WON)')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory)
        .should('have.text', 'Wonen')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.source)
        .should('have.text', 'online')
        .and('be.visible');
    });
  });
});
