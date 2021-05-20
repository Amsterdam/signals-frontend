// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { CREATE_SIGNAL, LANTAARNPAAL } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal01 from '../../fixtures/signals/signalForChangeBeforeSubmit01.json';
import signal02 from '../../fixtures/signals/signalForChangeBeforeSubmit02.json';
import signal03 from '../../fixtures/signals/signalForChangeBeforeSubmit03.json';
import signal04 from '../../fixtures/signals/signalForChangeBeforeSubmit04.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Change a signal before submit and check signal details', () => {
  describe('Change signal before submit', () => {
    before(() => {
      routes.postSignalRoutePublic();
      routes.getOpenbareVerlichtingRoute();
      routes.stubPreviewMap();
      routes.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(signal01);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(signal01);

      cy.get(LANTAARNPAAL.radioButtonProbleemBeschadigd).check({ force: true }).should('be.checked').and('be.visible');
      cy.get(LANTAARNPAAL.radioButtonNietGevaarlijk).check({ force: true }).should('be.checked');
      cy.wait('@getOpenbareVerlichting');
      cy.get(LANTAARNPAAL.checkBoxNietOpKaart).check().should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_niet_op_kaart_nummer.label).should('be.visible');
      cy.contains('+ Voeg een extra nummer toe').click();
      cy.get(LANTAARNPAAL.inputLampNummer1).type('11.11');
      cy.get(LANTAARNPAAL.inputLampNummer2).type('100.199');
      cy.contains('Volgende').click();
      createSignal.setPhonenumber(signal01);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(signal01);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(signal01);
      createSignal.checkQuestions(signal01, 'full');
      cy.get(CREATE_SIGNAL.imageFileUpload).should('not.exist');
    });

    it('Should change location, description, phonenumer and email address', () => {
      routes.stubPreviewMap();
      routes.stubMap();

      // Go to first step of signal creation and change signal information
      cy.contains('Wijzig melding').click();
      cy.get(CREATE_SIGNAL.autoSuggest).find('input').clear();

      createSignal.setDescriptionPage(signal02);
      cy.contains('Volgende').click();

      createSignal.setPhonenumber(signal02);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(signal02);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(signal02);
    });
    it('Should edit phonenumber and email address', () => {
      routes.stubPreviewMap();
      // Go to the phonenumber page and change phonenumber
      cy.contains('Wijzig uw telefoonnummer').click();
      createSignal.setPhonenumber(signal03);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(signal03);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(signal03);
    });
    it('Should edit email address', () => {
      routes.stubPreviewMap();
      routes.postSignalRoutePublic();
      // Go to the email address page and change emailaddress
      cy.contains('Wijzig uw e-mailadres').click();
      createSignal.setEmailAddress(signal04);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(signal04);
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
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(signal04, 'standaardmelding');
    });
  });
});
