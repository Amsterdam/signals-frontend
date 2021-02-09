import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/afval.json';

describe('Create signal afval and check signal details', () => {
  describe('Create signal in category "Afval"', () => {
    before(() => {
      cy.postSignalRoutePublic();
      cy.stubPreviewMap();
      cy.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      cy.setDescriptionPage(signal);
      cy.contains('Volgende').click();

      cy.setPhonenumber(signal);
      cy.contains('Volgende').click();

      cy.setEmailAddress(signal);
      cy.contains('Volgende').click();

      cy.checkSummaryPage(signal);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

      cy.checkThanksPage();
      cy.saveSignalId();
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
      cy.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      cy.checkAllDetails(signal);
    });
  });
});
