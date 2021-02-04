import { JONGEREN } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/jongeren.json';

describe('Create signal overlast "Jongeren" and check signal details', () => {
  describe('Create signal overlast jongeren', () => {
    before(() => {
      cy.postSignalRoutePublic();
      cy.stubPreviewMap();
      cy.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      cy.setDescriptionPage(signal);
      cy.contains('Volgende').click();

      cy.checkSpecificInformationPage(signal);

      cy.contains(questions.overlastPersonenEnGroepen.extra_jongeren_text.answers).should('be.visible');
      cy.contains('Melding zorg en woonoverlast').should('have.attr', 'href').and('include', 'meldpunt-zorg');
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig.label).should('be.visible');
      cy.get(JONGEREN.radioButtonAantalPersonen).check({ force: true });
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig_vaker.label).should('be.visible');
      cy.get(JONGEREN.checkBoxVaker).check({ force: true });
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig_vaker_momenten.label).should('be.visible');
      cy.get(JONGEREN.inputMoment).type('Bijna iedere dag');

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
