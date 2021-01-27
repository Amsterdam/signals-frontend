// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_WONINGKWALITEIT } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/wonenWoningKwaliteit.json';

describe('Create signal "Wonen woningkwaliteit" and check signal details', () => {
  describe('Create signal wonen woningkwaliteit', () => {
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
        .contains('Denkt u dat er direct gevaar is?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      // Input specific information
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonGevaarJa).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar_alert.answers)
        .should('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });
      cy.get(WONEN_WONINGKWALITEIT.radioButtonGevaarNee).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_gemeld_bij_eigenaar.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonKlachtGemeldNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar_ja.answers).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonKlachtGemeldJa).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar_ja.answers).should('not.exist');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_bewoner.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonBewonerJa).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_namens_bewoner.label).should('not.exist');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonBewonerNee).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_namens_bewoner.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonNamensBewonerJa).check({ force: true }).should('be.checked');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonNamensBewonerNee).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact.subtitle).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonContactJa).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact_ja.answers).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonContactNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact_ja.answers).should('not.exist');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_geen_contact.label).should('be.visible');

      cy.get(WONEN_WONINGKWALITEIT.inputGeenContact).type('Vertel ik liever niet');

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

      cy.checkAllDetails(fixturePath);
    });
  });
});
