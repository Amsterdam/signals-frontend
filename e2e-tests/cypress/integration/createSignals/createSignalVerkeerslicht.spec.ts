// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { CREATE_SIGNAL, VERKEERSLICHT } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { ERROR_MESSAGES } from '../../support/texts';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/verkeerslicht.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Create signal "Verkeerslicht" and check signal details', () => {
  describe('Create signal Verkeerslicht', () => {
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
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.errorGlobal).contains(ERROR_MESSAGES.mandatoryFields).should('be.visible');
      cy.get(VERKEERSLICHT.labelMandatoryFieldGevaarlijk).contains(ERROR_MESSAGES.mandatoryField).should('be.visible');

      // Check on visibility of the message to make a phone call directly after selecting one of the first four options
      const messageCallDirectly = questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_gevaar.answers;

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht.label).should('be.visible');
      cy.get(VERKEERSLICHT.radioButtonAanrijding).check({ force: true }).should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonOpGrond).check({ force: true }).should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonDeur).check({ force: true }).should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonLosseKabels).check({ force: true }).should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonNietGevaarlijk).check({ force: true }).should('be.checked');
      cy.contains(messageCallDirectly).should('not.exist');

      // Click on next to invoke error message
      cy.contains('Volgende').click();
      cy.get(VERKEERSLICHT.labelMandatoryFieldWerking).contains(ERROR_MESSAGES.mandatoryField).should('be.visible');

      // Check all options for voetganger
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_welk.label).should('be.visible');
      cy.get(VERKEERSLICHT.radioButtonTypeVoetganger).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_voetganger.label).should(
        'be.visible'
      );
      cy.get(VERKEERSLICHT.checkBoxVoetgangerRoodLicht)
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerGroenLicht)
        .parent()
        .siblings()
        .should('have.text', 'Groen licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerBlindentikker)
        .parent()
        .siblings()
        .should('have.text', 'Blindentikker werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerDuurtLang)
        .parent()
        .siblings()
        .should('have.text', 'Duurt (te) lang voordat het groen wordt')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerAnders)
        .parent()
        .siblings()
        .should('have.text', 'Anders')
        .and('be.visible');

      // Check all options for Fiets
      cy.get(VERKEERSLICHT.radioButtonTypeFiets).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_fiets_auto.label).should(
        'be.visible'
      );
      cy.get(VERKEERSLICHT.checkBoxFietsAutoRoodLicht)
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoOranjeLicht)
        .parent()
        .siblings()
        .should('have.text', 'Oranje/geel licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoGroenLicht)
        .parent()
        .siblings()
        .should('have.text', 'Groen licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoDuurtLang)
        .parent()
        .siblings()
        .should('have.text', 'Duurt (te) lang voordat het groen wordt')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoAnders).parent().siblings().should('have.text', 'Anders').and('be.visible');

      // Check all options for Auto
      cy.get(VERKEERSLICHT.radioButtonTypeAuto).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_fiets_auto.label).should(
        'be.visible'
      );
      cy.get(VERKEERSLICHT.checkBoxFietsAutoRoodLicht)
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoOranjeLicht)
        .parent()
        .siblings()
        .should('have.text', 'Oranje/geel licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoGroenLicht)
        .parent()
        .siblings()
        .should('have.text', 'Groen licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoDuurtLang)
        .parent()
        .siblings()
        .should('have.text', 'Duurt (te) lang voordat het groen wordt')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoAnders).parent().siblings().should('have.text', 'Anders').and('be.visible');

      // Check all options for Tram of bus
      cy.get(VERKEERSLICHT.radioButtonTypeTramBus).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_bus_tram.label).should(
        'be.visible'
      );
      cy.get(VERKEERSLICHT.checkBoxTramRoodLicht)
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramOranjeLicht)
        .parent()
        .siblings()
        .should('have.text', 'Oranje/geel licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramWitLicht)
        .parent()
        .siblings()
        .should('have.text', 'Wit licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramWaarschuwingslicht)
        .parent()
        .siblings()
        .should('have.text', 'Licht dat waarschuwt voor aankomende tram werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramAnders).parent().siblings().should('have.text', 'Anders').and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramRoodLicht).check();

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_rijrichting.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_rijrichting.subtitle).should('be.visible');
      cy.get(VERKEERSLICHT.inputRijrichting).type('Richting centrum');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_nummer.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_nummer.subtitle).should('be.visible');
      cy.get(VERKEERSLICHT.inputNummerVerkeerslicht).type('365');

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
