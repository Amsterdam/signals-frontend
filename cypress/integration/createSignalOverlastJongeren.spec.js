// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { JONGEREN } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';

describe('Create signal overlast door groep jongeren and check signal details', () => {
  describe('Create signal overlast door groep jongeren', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should search for an address', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:jongeren.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1018CN 28-H', 'Plantage Doklaan 28-H, 1018CN Amsterdam');
      createSignal.setDescription(
        'De laatste paar weken staat er in de avond een grote groep jongeren voor mijn deur te blowen. Dit zorgt voor veel overlast.'
      );
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Check specific information
      cy.contains(questions.overlastPersonenEnGroepen.extra_jongeren_text.answers).should('be.visible');
      cy.contains('Melding zorg en woonoverlast').should('have.attr', 'href').and('include', 'meldpunt-zorg');
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig.label).should('be.visible');
      cy.get(JONGEREN.radioButtonAantalPersonen).check();
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig_vaker.label).should('be.visible');
      cy.get(JONGEREN.checkBoxVaker).check();
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig_vaker_momenten.label).should('be.visible');
      cy.get(JONGEREN.inputMoment).type('Bijna iedere dag');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      createSignal.setPhonenumber('06-12345678');
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
      cy.contains(Cypress.env('phoneNumber')).should('be.visible');

      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig.shortLabel).should('be.visible');
      cy.contains('4 - 6').should('be.visible');
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig_vaker.shortLabel).should('be.visible');
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig_vaker.answers.ja).should('be.visible');
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig_vaker_momenten.shortLabel).should('be.visible');
      cy.contains('Bijna iedere dag').should('be.visible');

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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Centrum').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Plantage Doklaan 28-H').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1018CN Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', Cypress.env('phoneNumber')).and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Jongerenoverlast (ASC, THO)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory)
        .should('have.text', 'Overlast van en door personen of groepen')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
