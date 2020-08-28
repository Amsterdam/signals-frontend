// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_LEEGSTAND } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';

describe('Create signal wonen leegstand and check signal details', () => {
  describe('Create signal wonen leegstand', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wonenLeegstand.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1101DS 600', 'Johan Cruijff Boulevard 600, 1101DS Amsterdam');
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
      cy.contains(questions.wonen.extra_wonen_leegstand_naam_eigenaar.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.inputEigenaar)
        .eq(0)
        .type('A. Hitchcock');

      cy.contains(questions.wonen.extra_wonen_leegstand_periode.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegZesMaandenOfLanger)
        .check()
        .should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegMinderDanZesMaanden)
        .check()
        .should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegPeriodeWeetIkNiet)
        .check()
        .should('be.checked');

      cy.contains(questions.wonen.extra_wonen_leegstand_woning_gebruik.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktWeetIkNiet)
        .check()
        .should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktNee)
        .check()
        .should('be.checked');
      cy.contains(questions.wonen.extra_wonen_leegstand_naam_persoon.label).should('not.be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_activiteit_in_woning.label).should('not.be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_iemand_aanwezig.label).should('not.be.visible');

      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktJa)
        .check()
        .should('be.checked');

      cy.contains(questions.wonen.extra_wonen_leegstand_naam_persoon.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_activiteit_in_woning.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_iemand_aanwezig.label).should('be.visible');

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

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_naam_eigenaar.shortLabel).should('be.visible');
      cy.contains('A. Hitchcock').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_periode.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_periode.answers.weet_ik_niet).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_woning_gebruik.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_woning_gebruik.answers.ja).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_naam_persoon.shortLabel).should('be.visible');
      cy.contains('J. Aniston').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_activiteit_in_woning.shortLabel).should('be.visible');
      cy.contains('Deze persoon zit de hele dag te acteren').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_iemand_aanwezig.shortLabel).should('be.visible');
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
        .should('have.text', 'Stadsdeel: Zuidoost')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet)
        .should('have.text', 'Johan Cruijff Boulevard 600')
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
