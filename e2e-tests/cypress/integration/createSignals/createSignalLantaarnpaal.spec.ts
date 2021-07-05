// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { CREATE_SIGNAL, LANTAARNPAAL } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { ERROR_MESSAGES } from '../../support/texts';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/lantaarnpaal.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Create signal "Lantaarnpaal" and check signal details', () => {
  describe('Create signal lantaarnpaal', () => {
    before(() => {
      cy.intercept('**/v1/openbareverlichting/openbareverlichting/**Klok', { fixture: 'lantaarnpalen/lantaarnpalenData' }).as('stubLantaarnpalenData');
      cy.intercept('**/v1/openbareverlichting/openbareverlichting/**meldingstatus=1', { fixture: 'lantaarnpalen/lantaarnpalenMetMelding' }).as('stubLantaarnpalenMetMelding');
      routes.postSignalRoutePublic();
      routes.stubPreviewMap();
      routes.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(signal);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(signal);

      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.errorGlobal).contains(ERROR_MESSAGES.mandatoryFields).should('be.visible');
      cy.get(LANTAARNPAAL.labelMandatoryField).contains(ERROR_MESSAGES.mandatoryField).should('be.visible');

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_probleem.label).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemDoetNiet).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemBrandtOverdag)
        .check({ force: true })
        .should('be.checked')
        .and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('not.exist');
      cy.get(LANTAARNPAAL.radioButtonProbleemLichthinder).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('not.exist');
      cy.get(LANTAARNPAAL.radioButtonProbleemBeschadigd).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemOverig).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('be.visible');

      // Check on visibility of the message to make a phone call directly after selecting one of the first four options
      cy.get(LANTAARNPAAL.radioButtonGevaarlijk3OfMeerKapot).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkAanrijding).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkOpGrond).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkDeur).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkLosseKabels).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonNietGevaarlijk).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('not.exist');

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_nummer.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_nummer.subtitle).should('be.visible');

      // Check if 2 lamps are marked as already reported
      cy.get(LANTAARNPAAL.iconAlreadyReported).should('have.length', 2).and('be.visible');

      // Click on lamp based on coordinate
      createSignal.selectLampByCoordinate(414, 135);
      cy.contains('Gekozen op de kaart: 034575').should('be.visible');

      // Check options in legend
      cy.get(LANTAARNPAAL.mapSelectLamp).should('be.visible');
      cy.get(LANTAARNPAAL.legendHeader).should('have.text', 'Legenda').and('be.visible');
      cy.get(LANTAARNPAAL.legendContentText).should('be.visible');
      cy.contains('Grachtmast').should('be.visible');
      cy.contains('Lamp aan kabel').should('be.visible');
      cy.contains('Lamp aan gevel').should('be.visible');
      cy.contains('Schijnwerper').should('be.visible');
      cy.contains('Overig lichtpunt').should('be.visible');
      cy.contains('Is gemeld').should('be.visible');

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
