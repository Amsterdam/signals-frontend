// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_LEEGSTAND } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/wonenLeegstand.json';

describe('Create signal "Wonen leegstand" and check signal details', () => {
  describe('Create signal wonen leegstand', () => {
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
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.errorItem).should('contain', 'Dit is een verplicht veld').and('have.length', 3);

      // Input specific information
      cy.contains(questions.wonen.extra_wonen_leegstand_naam_eigenaar.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.inputEigenaar).eq(0).type('A. Hitchcock');

      cy.contains(questions.wonen.extra_wonen_leegstand_periode.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegZesMaandenOfLanger).check({ force: true }).should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegMinderDanZesMaanden).check({ force: true }).should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegPeriodeWeetIkNiet).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_leegstand_woning_gebruik.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktWeetIkNiet).check({ force: true }).should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_leegstand_naam_persoon.label).should('not.exist');
      cy.contains(questions.wonen.extra_wonen_leegstand_activiteit_in_woning.label).should('not.exist');
      cy.contains(questions.wonen.extra_wonen_leegstand_iemand_aanwezig.label).should('not.exist');

      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktJa).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_leegstand_naam_persoon.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_activiteit_in_woning.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_iemand_aanwezig.label).should('be.visible');

      // Check if inputfields are optional
      cy.contains('Volgende').click();
      cy.url().should('include', '/incident/telefoon');
      cy.contains('Vorige').click();
      cy.url().should('include', '/incident/vulaan');

      cy.get(WONEN_LEEGSTAND.inputNaam).eq(1).type('J. Aniston');
      cy.get(WONEN_LEEGSTAND.inputWatDoetPersoon).eq(2).type('Deze persoon zit de hele dag te acteren');
      cy.get(WONEN_LEEGSTAND.inputTijdstip).eq(3).type('Vooral in de avond');

      cy.contains('Volgende').click();

      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(fixturePath);
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
