// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { JONGEREN } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/jongeren.json';

describe('Create signal overlast "Jongeren" and check signal details', () => {
  describe('Create signal overlast jongeren', () => {
    before(() => {
      cy.server();
      cy.getAddressRoute();
      cy.postSignalRoutePublic();
      cy.intercept('**/maps/topografie?bbox=**').as('map');
      cy.visitFetch('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath);

      cy.contains(questions.overlastPersonenEnGroepen.extra_jongeren_text.answers).should('be.visible');
      cy.contains('Melding zorg en woonoverlast').should('have.attr', 'href').and('include', 'meldpunt-zorg');
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig.label).should('be.visible');
      cy.get(JONGEREN.radioButtonAantalPersonen).check({ force: true });
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig_vaker.label).should('be.visible');
      cy.get(JONGEREN.checkBoxVaker).check({ force: true });
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig_vaker_momenten.label).should('be.visible');
      cy.get(JONGEREN.inputMoment).type('Bijna iedere dag');

      cy.contains('Volgende').click();

      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

      cy.wait('@map');
      createSignal.checkSummaryPage(fixturePath);
      createSignal.checkQuestions(fixturePath);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

      createSignal.checkThanksPage();
      createSignal.saveSignalId();
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

      createSignal.checkAllDetails(fixturePath);
    });
  });
});
