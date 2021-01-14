// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { FIETSNIETJE } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/fietsNietje.json';

describe('Create signal "Fietsnietje" and check signal details', () => {
  describe('Create signal fietsnietje', () => {
    before(() => {
      cy.postSignalRoutePublic();
      cy.stubPreviewMap();
      cy.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath);
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_fietsrek_aanvragen.label).should('be.visible');
      cy.get(FIETSNIETJE.radioButtonNieuwNietjeJa).click({ force: true });
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_fietsrek_aanvraag.label).should('be.visible');
      cy.get(FIETSNIETJE.inputFietsnietje).type('Ik wil graag een extra groot nietje aanvragen voor mijn grote fiets.');
      cy.contains('Volgende').click();

      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

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
      cy.stubPreviewMap();
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(fixturePath);
    });
  });
});
