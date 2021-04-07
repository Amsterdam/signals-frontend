// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/wespen.json';
import questions from '../../fixtures/questions/questions.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as general from '../../support/commandsGeneral';

describe('Create signal "Wespen" when logged in and check signal details', () => {
  describe('Create signal wespen', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });
    it('Should initiate create signal from manage', () => {
      routes.stubMap();
      routes.getManageSignalsRoutes();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
      general.openMenu();
      cy.contains('Melden').click();
      general.checkHeaderText('Beschrijf uw melding');
    });
    it('Should create the signal', () => {
      routes.stubPreviewMap();
      routes.postSignalRoutePrivate();

      createSignal.setDescriptionPage(signal);

      // Check Urgency texts
      cy.contains('Wat is de urgentie?').should('be.visible');
      cy.contains('Hoog').should('be.visible').click();
      cy.contains('Hoog: melding met spoed oppakken').should('be.visible');
      cy.contains('Laag').should('be.visible').click();
      cy.contains('Laag: interne melding zonder servicebelofte').should('be.visible');
      cy.contains('Normaal').should('be.visible').click();

      cy.contains('Volgende').click();
      createSignal.checkSpecificInformationPage(signal);

      Object.values(questions.overlastVanDieren.extra_dieren_text.answers).forEach((elementValue: string) => {
        cy.contains(elementValue).should('be.visible');
      });
      cy.contains('Dierenambulance Amsterdam').should('have.attr', 'href').and('include', 'dierenambulance-amsterdam');
      cy.contains('overlast van dieren').should('have.attr', 'href').and('include', 'veelgevraagd');

      cy.contains('Volgende').click();
      createSignal.setPhonenumber(signal);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(signal);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(signal);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPrivate');
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
