// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { CHANGE_STATUS } from '../../support/selectorsSignalDetails';
import { WEGDEK } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/wegdek.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import { STATUS_TEXT } from '../../support/texts';

describe('Create signal "Wegdek kapot" and check signal details', () => {
  describe('Create signal wegdek kapot', () => {
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

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_onderhoud_stoep_straat_en_fietspad.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_onderhoud_stoep_straat_en_fietspad.subtitle).should('be.visible');
      cy.get(WEGDEK.inputSoortWegdek).type('Asfalt');

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

      // It should not be possible to send mail because there is no emailaddress known
      cy.get(CHANGE_STATUS.buttonEdit).click();
      cy.contains(STATUS_TEXT.noMailAddress).should('be.visible');
    });
  });
});
