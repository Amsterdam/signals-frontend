// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/wespen.json';

describe('Create signal "Wespen" when logged in and check signal details', () => {
  describe('Create signal wespen', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });
    it('Should initiate create signal from manage', () => {
      cy.stubMap();
      cy.getManageSignalsRoutes();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.openMenu();
      cy.contains('Melden').click();
      cy.checkHeaderText('Beschrijf uw melding');
    });
    it('Should create the signal', () => {
      cy.stubPreviewMap();
      cy.postSignalRoutePrivate();

      createSignal.setDescriptionPage(fixturePath);

      // Check Urgency texts
      cy.contains('Wat is de urgentie?').should('be.visible');
      cy.contains('Hoog').should('be.visible').click();
      cy.contains('Hoog: melding met spoed oppakken').should('be.visible');
      cy.contains('Laag').should('be.visible').click();
      cy.contains('Laag: interne melding zonder servicebelofte').should('be.visible');
      cy.contains('Normaal').should('be.visible').click();

      cy.contains('Volgende').click();
      createSignal.checkSpecificInformationPage(fixturePath);

      cy.get(questions.overlastVanDieren.extra_dieren_text.answers)
        .each($element => {
          cy.contains($element).should('be.visible');
        });
      cy.contains('Dierenambulance Amsterdam').should('have.attr', 'href').and('include', 'dierenambulance-amsterdam');
      cy.contains('overlast van dieren').should('have.attr', 'href').and('include', 'veelgevraagd');

      cy.contains('Volgende').click();
      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(fixturePath);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPrivate');
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
