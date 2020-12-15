// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { BOTEN } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/botenSnelVaren.json';

describe('Create signal category "Boten snel varen"', () => {
  describe('Create signal boten', () => {
    before(() => {
      cy.getAddressRoute();
      cy.postSignalRoutePublic();
      cy.getMapRoute();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath);
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_rondvaartboot.label).should('be.visible');
      cy.get(BOTEN.radioButtonRondvaartbootJa).click({ force: true });
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_rederij.label).should('be.visible');
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_rederij.subtitle).should('be.visible');
      cy.get('select').select(questions.overlastOpHetWater.extra_boten_snelheid_rederij.values.amsterdam_boat_center);
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_naamboot.label).should('be.visible');
      cy.get(BOTEN.inputNaamBoot).type('Bota Fogo');
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_meer.label).should('be.visible');
      cy.contains(questions.overlastOpHetWater.extra_boten_snelheid_meer.subtitle).should('be.visible');
      cy.get(BOTEN.inputNogMeer).type('De boot voer richting Ouderkerk aan de Amstel');
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
