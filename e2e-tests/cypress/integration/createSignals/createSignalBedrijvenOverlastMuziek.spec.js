// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { BEDRIJVEN_HORECA } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/bedrijvenMuziek.json';

describe('Create signal "Bedrijven overlast muziek" and check signal details', () => {
  describe('Create signal overlast muziek', () => {
    before(() => {
      cy.getAddressRoute();
      cy.postSignalRoutePublic();
      cy.getMapRoute();
      cy.visit('incident/beschrijf');
    });

    it('Should search for an address', () => {
      createSignal.setDescriptionPage(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath);

      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_wat.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.radioButtonEvenement).click({ force: true });
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_naam.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputWieWat).eq(0).type('Violisten in het Bimhuis');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_adres.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputAdres).eq(1).type('Piet Heinkade 3, maar dat had ik toch al gezegd?');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_evenement.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.radioButtonGeinformeerdJa).click({ force: true });
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_evenement_einde.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputHoeLaatEinde).eq(2).type('Rond middernacht');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.label).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.subtitle).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.radioButtonVakerJa).click({ force: true });
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_tijdstippen.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputTijdstippen).eq(3).type('Meestal op 31 december rond middernacht');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_muziek.label).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_muziek.subtitle).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.radioButtonContactJa).click({ force: true });
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_caution.value).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_ja.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.radioButtonBellenNietNu).click({ force: true });
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_ja_nietnu.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputWanneerBellen).eq(4).type('Wanneer ik er zin in heb.');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_caution.answers).should('be.visible');
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
