import { JONGEREN } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/jongeren.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Create signal overlast "Jongeren" and check signal details', () => {
  describe('Create signal overlast jongeren', () => {
    before(() => {
      routes.postSignalRoutePublic();
      routes.stubPreviewMap();
      routes.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(signal);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(signal);

      cy.contains(questions.overlastPersonenEnGroepen.extra_jongeren_text.answers).should('be.visible');
      cy.contains('Melding zorg en woonoverlast').should('have.attr', 'href').and('include', 'meldpunt-zorg');
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig.label).should('be.visible');
      cy.get(JONGEREN.radioButtonAantalPersonen).check({ force: true });
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig_vaker.label).should('be.visible');
      cy.get(JONGEREN.checkBoxVaker).check({ force: true });
      cy.contains(questions.overlastPersonenEnGroepen.extra_personen_overig_vaker_momenten.label).should('be.visible');
      cy.get(JONGEREN.inputMoment).type('Bijna iedere dag');

      cy.contains('Volgende').click();

      createSignal.setPhonenumber(signal);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(signal);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(signal);
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
      routes.getManageSignalsRoutes();
      routes.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      routes.stubPreviewMap();
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(signal);
    });
  });
});
