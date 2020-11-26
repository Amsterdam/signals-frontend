// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { WEGDEK } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/wegdek.json';

describe('Create signal "Wegdek kapot" and check signal details', () => {
  describe('Create signal wegdek kapot', () => {
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

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_onderhoud_stoep_straat_en_fietspad.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_onderhoud_stoep_straat_en_fietspad.subtitle).should('be.visible');
      cy.get(WEGDEK.inputSoortWegdek).type('Asfalt');

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
