import { KLOK } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/klokNotOnMap.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Create signal "Klok" which is NOT on the map and check signal details', () => {
  describe('Create signal klok not on the map', () => {
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
