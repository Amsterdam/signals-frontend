import { WEGDEK } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/wegdek.json';

describe('Create signal "Wegdek kapot" and check signal details', () => {
  describe('Create signal wegdek kapot', () => {
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

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_onderhoud_stoep_straat_en_fietspad.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_onderhoud_stoep_straat_en_fietspad.subtitle).should('be.visible');
      cy.get(WEGDEK.inputSoortWegdek).type('Asfalt');

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
