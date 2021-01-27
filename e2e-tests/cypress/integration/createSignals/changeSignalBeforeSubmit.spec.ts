// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL, LANTAARNPAAL } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath01 = '../fixtures/signals/signalForChangeBeforeSubmit01.json';
const fixturePath02 = '../fixtures/signals/signalForChangeBeforeSubmit02.json';
const fixturePath03 = '../fixtures/signals/signalForChangeBeforeSubmit03.json';
const fixturePath04 = '../fixtures/signals/signalForChangeBeforeSubmit04.json';


describe('Change a signal before submit and check signal details', () => {
  describe('Change signal before submit', () => {
    before(() => {
      cy.postSignalRoutePublic();
      cy.getOpenbareVerlichtingRoute();
      cy.stubPreviewMap();
      cy.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(fixturePath01);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath01);

      cy.get(LANTAARNPAAL.radioButtonProbleemBeschadigd).check({ force: true }).should('be.checked').and('be.visible');
      cy.get(LANTAARNPAAL.radioButtonNietGevaarlijk).check({ force: true }).should('be.checked');
      cy.wait('@getOpenbareVerlichting');
      cy.get(LANTAARNPAAL.checkBoxNietOpKaart).check().should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_niet_op_kaart_nummer.label).should('be.visible');
      cy.contains('+ Voeg een extra nummer toe').click();
      cy.get(LANTAARNPAAL.inputLampNummer1).type('11.11');
      cy.get(LANTAARNPAAL.inputLampNummer2).type('100.199');
      cy.contains('Volgende').click();
      createSignal.setPhonenumber(fixturePath01);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath01);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(fixturePath01);
      createSignal.checkQuestions(fixturePath01);
      cy.get(CREATE_SIGNAL.imageFileUpload).should('not.exist');
    });

    it('Should change location, description, phonenumer and email address', () => {
      cy.stubPreviewMap();
      cy.stubMap();

      // Go to first step of signal creation and change signal information
      cy.get(CREATE_SIGNAL.linkChangeSignalInfo).click();
      cy.get(CREATE_SIGNAL.autoSuggest).find('input').clear();

      createSignal.setDescriptionPage(fixturePath02);
      cy.contains('Volgende').click();

      createSignal.setPhonenumber(fixturePath02);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath02);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(fixturePath02);
    });
    it('Should edit phonenumber and email address', () => {
      cy.stubPreviewMap();
      // Go to the phonenumber page and change phonenumber
      cy.get(CREATE_SIGNAL.linkChangePhoneNumber).click();
      createSignal.setPhonenumber(fixturePath03);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath03);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(fixturePath03);
    });
    it('Should edit email address', () => {
      cy.stubPreviewMap();
      cy.postSignalRoutePublic();
      // Go to the email address page and change emailaddress
      cy.get(CREATE_SIGNAL.linkChangeEmailAddress).click();
      createSignal.setEmailAddress(fixturePath04);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(fixturePath04);
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

      cy.checkAllDetails(fixturePath04);
    });
  });
});
