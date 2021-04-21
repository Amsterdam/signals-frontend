// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { FIETSNIETJE } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateTokenDate } from '../../support/jwt';
import signal from '../../fixtures/signals/fietsNietje.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as general from '../../support/commandsGeneral';

describe('Create signal "Fietsnietje" and check signal details', () => {
  describe('Create signal fietsnietje', () => {
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
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_fietsrek_aanvragen.label).should('be.visible');
      cy.get(FIETSNIETJE.radioButtonNieuwNietjeJa).click({ force: true });
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_fietsrek_aanvraag.label).should('be.visible');
      cy.get(FIETSNIETJE.inputFietsnietje).type('Ik wil graag een extra groot nietje aanvragen voor mijn grote fiets.');
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
      // Set date on today + 10 to check handling time
      const futureDate = general.getFutureDate(10);
      cy.clock(futureDate);
      localStorage.setItem('accessToken', generateTokenDate(futureDate, 'Admin', 'signals.admin@example.com'));
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
      cy.clock().then(clock => {
        clock.restore();
      });
    });
  });
});
