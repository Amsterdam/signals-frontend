import { KLOK } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/klokNotOnMap.json';

describe('Create signal "Klok" which is NOT on the map and check signal details', () => {
  describe('Create signal klok not on the map', () => {
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

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok.label).should('be.visible');
      cy.get(KLOK.radioButtonGevaarlijkOpGrondOfScheef).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_probleem.label).should('be.visible');
      cy.get(KLOK.radioButtonProbleemBeschadigd).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_nummer.label).should('be.visible');
      cy.get(KLOK.mapSelectKlok).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_niet_op_kaart.value).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_niet_op_kaart_nummer.label).should('not.exist');
      cy.get(KLOK.checkBoxNietOpKaart).check().should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_niet_op_kaart_nummer.label).should('be.visible');
      cy.contains('+ Voeg een extra nummer toe').click();
      cy.get(KLOK.inputKlokNummer1).type('666');
      cy.get(KLOK.inputKlokNummer2).type('999');

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
