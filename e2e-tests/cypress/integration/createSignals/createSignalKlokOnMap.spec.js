// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL, KLOK } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/klokOnMap.json';

describe('Create signal "Klok" which is on the map and check signal details', () => {
  describe('Create signal klok on the map', () => {
    before(() => {
      cy.postSignalRoutePublic();
      cy.getMapRoute();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath);

      const warning = questions.wegenVerkeerStraatmeubilair.extra_klok_gevaar.answers;
      createSignal.checkSpecificInformationPage(fixturePath);

      // Click on next to invoke error message
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Is de situatie gevaarlijk?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      // First question
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok.label).should('be.visible');
      cy.get(KLOK.radioButtonGevaarlijkAanrijding).check({ force: true }).should('be.checked');
      cy.contains(warning)
        .should('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });
      cy.get(KLOK.radioButtonGevaarlijkOpGrondOfScheef).check({ force: true }).should('be.checked');
      cy.contains(warning).should('be.visible');
      cy.get(KLOK.radioButtonGevaarlijkDeurtje).check({ force: true }).should('be.checked');
      cy.contains(warning).should('be.visible');
      cy.get(KLOK.radioButtonGevaarlijkLosseKabels).check({ force: true }).should('be.checked');
      cy.contains(warning).should('be.visible');
      cy.get(KLOK.radioButtonGevaarlijkNietGevaarlijk).check({ force: true }).should('be.checked');
      cy.contains(warning).should('not.exist');

      // Second question
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_probleem.label).should('be.visible');
      cy.get(KLOK.radioButtonProbleemNietOpTijd).check({ force: true }).should('be.checked');
      cy.get(KLOK.radioButtonProbleemBeschadigd).check({ force: true }).should('be.checked');
      cy.get(KLOK.radioButtonProbleemVervuild).check({ force: true }).should('be.checked');
      cy.get(KLOK.radioButtonProbleemOverig).check({ force: true }).should('be.checked');

      // Third question
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_nummer.label).should('be.visible');
      cy.get(KLOK.iconKlok).click();

      // Check options in legend
      cy.get(KLOK.mapSelectKlok).should('be.visible');
      cy.get(KLOK.legendHeader).should('have.text', 'Legenda').and('be.visible');
      cy.get(KLOK.legendContentText).should('have.text', 'Klok').and('be.visible');

      cy.contains('Volgende').click();

      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

      cy.wait('@getMap');
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
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(fixturePath);
    });
  });
});
