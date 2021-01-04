// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/fietsWrak.json';

describe('Create signal "Fietswrak" and check signal details', () => {
  describe('Create signal fietswrak', () => {
    before(() => {
      cy.postSignalRoutePublic();
      cy.getMapRoute();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath);
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

      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

      cy.wait('@getMap');
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
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(fixturePath);
    });
  });
});
