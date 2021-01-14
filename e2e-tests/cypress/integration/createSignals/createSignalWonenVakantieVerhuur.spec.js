// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_VAKANTIEVERHUUR } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/wonenVakantieVerhuur.json';

describe('Create signal "Wonen vakantie verhuur" and check signal details', () => {
  describe('Create signal wonen vakantie verhuur', () => {
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
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains(questions.wonen.extra_wonen_vakantieverhuur_toeristen_aanwezig.label)
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      // Input specific information
      const warningPhone = questions.wonen.extra_wonen_vakantieverhuur_bellen_of_formulier.label;
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_toeristen_aanwezig.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenNee).check({ force: true }).should('be.checked');
      cy.contains(warningPhone).should('not.exist');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenWeetIkNiet).check({ force: true }).should('be.checked');
      cy.contains(warningPhone).should('not.exist');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenJa).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_aantal_mensen.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeveelVierOfMinder).check({ force: true }).should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeveelVijfOfMeer).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_hoe_vaak.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('not.exist');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakEersteKeer).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('not.exist');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakWekelijks).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakDagelijks).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('not.exist');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakMaandelijks).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerWeekend).check({ force: true }).should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerDoordeweeks).check({ force: true }).should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerWisselend).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bewoning.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bewoning.subtitle).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningWeetIkNiet).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_naam_bewoner.label).should('not.exist');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_naam_bewoner.label).should('not.exist');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningJa).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_naam_bewoner.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.inputBewoner).eq(0).type('Gijsbrecht van Aemstel');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_online_aangeboden.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonOnlineNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_link_advertentie.label).should('not.exist');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonOnlineJa).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_link_advertentie.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.inputLink).eq(1).type('https://amsterdam.intercontinental.com/nl/');

      cy.contains('Volgende').click();

      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

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
      cy.stubPreviewMap();
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(fixturePath);
    });
  });
});
