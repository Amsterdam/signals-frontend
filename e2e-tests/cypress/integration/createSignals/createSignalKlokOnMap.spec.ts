// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { CREATE_SIGNAL, KLOK } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { ERROR_MESSAGES } from '../../support/texts';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/klokOnMap.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Create signal "Klok" which is on the map and check signal details', () => {
  describe('Create signal klok on the map', () => {
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

      const warning = questions.wegenVerkeerStraatmeubilair.extra_klok_gevaar.answers;
      createSignal.checkSpecificInformationPage(signal);

      // Click on next to invoke error message
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.errorGlobal).contains(ERROR_MESSAGES.mandatoryFields).should('be.visible');
      cy.get(KLOK.labelMandatoryFieldGevaarlijk).contains(ERROR_MESSAGES.mandatoryField).should('be.visible');

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
      cy.get(KLOK.radioButtonProbleemOverig).check({ force: true }).should('be.checked');

      // Third question
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_nummer.label).should('be.visible');
      cy.get(KLOK.iconKlok).click();

      // Check options in legend
      cy.get(KLOK.mapSelectKlok).should('be.visible');
      cy.get(KLOK.legendHeader).should('have.text', 'Legenda').and('be.visible');
      cy.get(KLOK.legendContentText).should('contain', 'Klok').and('be.visible');
      cy.get(KLOK.legendContentText).should('contain', 'Is gemeld').and('be.visible');

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

      createSignal.checkAllDetails(signal, 'standaardmelding');
    });
  });
});
