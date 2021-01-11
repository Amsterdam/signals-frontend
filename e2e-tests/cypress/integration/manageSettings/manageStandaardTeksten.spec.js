// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { STANDAARDTEKSTEN } from '../../support/selectorsSettings';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { CHANGE_STATUS, SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import * as requests from '../../support/commandsRequests';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/signalForStandaardteksten.json';

describe('Standaardteksten', () => {
  describe('Create standaardteksten', () => {
    beforeEach(() => {
      cy.getManageSignalsRoutes();
      cy.standaardtekstenRoutes();
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should create standaardteksten for duiven', () => {
      cy.openMenu();
      cy.contains('Standaard teksten').click();
      cy.wait('@getAfwateringBrug');

      cy.url().should('include', '/manage/standaard/teksten');
      cy.checkHeaderText('Beheer standaard teksten');

      cy.get(STANDAARDTEKSTEN.dropDownSubcategory).select('Duiven (GGD)');
      cy.wait('@getDuiven');

      // Status Afgehandeld
      cy.get(STANDAARDTEKSTEN.radioButtonAfgehandeld).check({ force: true }).should('be.checked');
      cy.get(STANDAARDTEKSTEN.inputTitle01)
        .clear()
        .type(`{selectall}{del}${STANDAARDTEKSTEN.textTitleAfhandelen01}`);
      cy.get(STANDAARDTEKSTEN.inputText01)
        .clear()
        .type(STANDAARDTEKSTEN.textDescriptionAfhandelen01, { parseSpecialCharSequences: false });
      cy.get(STANDAARDTEKSTEN.inputTitle02)
        .clear()
        .type(`{selectall}{del}${STANDAARDTEKSTEN.textTitleAfhandelen02}`);
      cy.get(STANDAARDTEKSTEN.inputText02)
        .clear()
        .type(STANDAARDTEKSTEN.textDescriptionAfhandelen02, { parseSpecialCharSequences: false });
      cy.get(STANDAARDTEKSTEN.buttonOpslaan).click();
      cy.get(STANDAARDTEKSTEN.notification).should('be.visible');
      cy.get(STANDAARDTEKSTEN.buttonCloseNotification).click();
      cy.get(STANDAARDTEKSTEN.notification).should('not.be.visible');
      cy.wait('@PostDuiven');
      cy.get(STANDAARDTEKSTEN.inputTitle01).should('have.value', STANDAARDTEKSTEN.textTitleAfhandelen01);
      cy.get(STANDAARDTEKSTEN.inputText01).should('have.value', STANDAARDTEKSTEN.textDescriptionAfhandelen01);

      // Status Ingepland
      cy.get(STANDAARDTEKSTEN.radioButtonIngepland).check({ force: true }).should('be.checked');
      cy.wait('@getDuiven');
      cy.get(STANDAARDTEKSTEN.inputTitle01)
        .clear()
        .type(`{selectall}{del}${STANDAARDTEKSTEN.textTitleInplannen}`);
      cy.get(STANDAARDTEKSTEN.inputText01)
        .clear()
        .type(STANDAARDTEKSTEN.textDescriptionInplannen, { parseSpecialCharSequences: false });
      cy.get(STANDAARDTEKSTEN.buttonOpslaan).click();
      cy.wait('@PostDuiven');

      // Status Heropend
      cy.get(STANDAARDTEKSTEN.radioButtonHeropend).check({ force: true }).should('be.checked');
      cy.wait('@getDuiven');
      cy.get(STANDAARDTEKSTEN.inputTitle01)
        .type(`{selectall}{del}${STANDAARDTEKSTEN.textTitleHeropenen}`);
      cy.get(STANDAARDTEKSTEN.inputText01)
        .clear()
        .type(STANDAARDTEKSTEN.textDescriptionHeropenen, { parseSpecialCharSequences: false });
      cy.get(STANDAARDTEKSTEN.buttonOpslaan).click();
      cy.wait('@PostDuiven');
    });
  });
  describe('Create signal duiven', () => {
    before(() => {
      cy.postSignalRoutePublic();
      cy.getMapRoute();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath);
      cy.contains('Volgende').click();
      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

      cy.wait('@getMap');
      createSignal.checkSummaryPage(fixturePath);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

      createSignal.checkThanksPage();
      createSignal.saveSignalId();
    });
  });
  describe('Change status of signal and check standaardtekst', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.patchSignalRoute();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should change the status of the signal to Ingepland and show standaardtekst', () => {
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      cy.get(CHANGE_STATUS.buttonEdit).click();

      cy.contains('Status wijzigen').should('be.visible');
      cy.contains('Huidige status').should('be.visible');
      cy.get(CHANGE_STATUS.currentStatus).contains('Gemeld').should('be.visible');

      cy.get(STANDAARDTEKSTEN.defaultTextTitle).should('be.visible');
      cy.get(CHANGE_STATUS.radioButtonIngepland).click({ force: true }).should('be.checked');
      cy.get(STANDAARDTEKSTEN.defaultTextTitle).should('be.visible');
      cy.get(STANDAARDTEKSTEN.defaultTextItemTitle).should('have.text', STANDAARDTEKSTEN.textTitleInplannen);
      cy.get(STANDAARDTEKSTEN.defaultTextItemText).should('have.text', STANDAARDTEKSTEN.textDescriptionInplannen);
      cy.get(STANDAARDTEKSTEN.buttonGebruikDezeTekst).click();
      cy.get(CHANGE_STATUS.inputToelichting).should('have.value', STANDAARDTEKSTEN.textDescriptionInplannen);

      cy.get(CHANGE_STATUS.buttonSubmit).click();
      cy.on('window:alert', str => {
        expect(str).to.equal(STANDAARDTEKSTEN.textAlert);
      });

      cy.get(CHANGE_STATUS.inputToelichting).clear().type('Beschrijving standaardtekst 1 melding duiven INPLANNEN. De overlastgevende duif is geïdentificeerd als Cher Ami');
      cy.get(CHANGE_STATUS.buttonSubmit).click();
      cy.wait('@getSignals');
      cy.wait('@getHistory');
      cy.get(SIGNAL_DETAILS.historyListItem).should('have.length', 3);
      cy.get(SIGNAL_DETAILS.historyListItem).first().should('have.text', 'Beschrijving standaardtekst 1 melding duiven INPLANNEN. De overlastgevende duif is geïdentificeerd als Cher Ami');
    });
    it('Should change the status of the signal to Afgehandeld and show standaardtekst', () => {
      cy.patchSignalRoute();
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      cy.get(CHANGE_STATUS.buttonEdit).click();
      cy.contains('Status wijzigen').should('be.visible');
      cy.contains('Huidige status').should('be.visible');
      cy.get(CHANGE_STATUS.currentStatus).contains('Ingepland').should('be.visible');
      cy.get(CHANGE_STATUS.radioButtonAfgehandeld).click({ force: true }).should('be.checked');

      cy.get(STANDAARDTEKSTEN.defaultTextTitle).should('be.visible');
      cy.get(STANDAARDTEKSTEN.defaultTextItemTitle).eq(0).should('have.text', STANDAARDTEKSTEN.textTitleAfhandelen01);
      cy.get(STANDAARDTEKSTEN.defaultTextItemText).eq(0).should('have.text', STANDAARDTEKSTEN.textDescriptionAfhandelen01);
      cy.get(STANDAARDTEKSTEN.defaultTextItemTitle).eq(1).should('have.text', STANDAARDTEKSTEN.textTitleAfhandelen02);
      cy.get(STANDAARDTEKSTEN.defaultTextItemText).eq(1).should('have.text', STANDAARDTEKSTEN.textDescriptionAfhandelen02);
      cy.get(STANDAARDTEKSTEN.buttonGebruikDezeTekst).eq(0).click();
      cy.get(CHANGE_STATUS.inputToelichting).should('have.value', STANDAARDTEKSTEN.textDescriptionAfhandelen01);

      cy.get(CHANGE_STATUS.buttonSubmit).click();
      cy.on('window:alert', str => {
        expect(str).to.equal(STANDAARDTEKSTEN.textAlert);
      });

      cy.get(CHANGE_STATUS.inputToelichting).clear().type('Beschrijving standaardtekst 1 melding duiven AFHANDELEN. De overlastgevende duif is geïdentificeerd als Valiant');
      cy.get(CHANGE_STATUS.buttonSubmit).click();
      cy.wait('@patchSignal');
      cy.wait('@getSignals');
      cy.wait('@getHistory');
      cy.get(SIGNAL_DETAILS.historyListItem).should('have.length', 4);
      cy.get(SIGNAL_DETAILS.historyListItem).first().should('have.text', 'Beschrijving standaardtekst 1 melding duiven AFHANDELEN. De overlastgevende duif is geïdentificeerd als Valiant');
    });
    it('Should change the status of the signal to Heropend and show standaardtekst', () => {
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      cy.get(CHANGE_STATUS.buttonEdit).click();

      cy.contains('Status wijzigen').should('be.visible');
      cy.contains('Huidige status').should('be.visible');
      cy.get(CHANGE_STATUS.currentStatus).contains('Afgehandeld').should('be.visible');

      cy.get(CHANGE_STATUS.radioButtonHeropend).click({ force: true }).should('be.checked');
      cy.get(STANDAARDTEKSTEN.defaultTextTitle).should('be.visible');
      cy.get(STANDAARDTEKSTEN.defaultTextItemTitle).should('have.text', STANDAARDTEKSTEN.textTitleHeropenen);
      cy.get(STANDAARDTEKSTEN.defaultTextItemText).should('have.text', STANDAARDTEKSTEN.textDescriptionHeropenen);
      cy.get(STANDAARDTEKSTEN.buttonGebruikDezeTekst).eq(0).click();
      cy.get(CHANGE_STATUS.inputToelichting).should('have.value', STANDAARDTEKSTEN.textDescriptionHeropenen);

      cy.get(CHANGE_STATUS.buttonSubmit).click();
      cy.on('window:alert', str => {
        expect(str).to.equal(STANDAARDTEKSTEN.textAlert);
      });

      cy.get(CHANGE_STATUS.inputToelichting).clear().type('Beschrijving standaardtekst 1 melding duiven HEROPENEN. De overlastgevende duif is geïdentificeerd als Lance Sterling');
      cy.get(CHANGE_STATUS.buttonSubmit).click();
      cy.wait('@getSignals');
      cy.wait('@getHistory');
      cy.get(SIGNAL_DETAILS.historyListItem).should('have.length', 5);
      cy.get(SIGNAL_DETAILS.historyListItem).first().should('have.text', 'Beschrijving standaardtekst 1 melding duiven HEROPENEN. De overlastgevende duif is geïdentificeerd als Lance Sterling');
    });
  });
  describe('Check message if there is no standaardtekst', () => {
    describe('Create signal', () => {
      it('Should create a signal for a category without a standaardtekst', () => {
        requests.createSignalDeelmelding();
      });
    });
    describe('Check message', () => {
      before(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        cy.getManageSignalsRoutes();
        cy.getSignalDetailsRoutesById();
        cy.visit('/manage/incidents/');
        cy.waitForManageSignalsRoutes();
      });
      it('Should show no message when there is no standaardtekst', () => {
        createSignal.openCreatedSignal();
        cy.get(CHANGE_STATUS.buttonEdit).click();
        cy.get(STANDAARDTEKSTEN.defaultTextTitle).should('be.visible').and('have.text', 'Standaard teksten');
        // eslint-disable-next-line max-nested-callbacks
        cy.contains('Er is geen standaard tekst voor deze subcategorie en status combinatie.').should('be.visible').and($labels => {
          expect($labels).to.have.css('color', 'rgb(118, 118, 118)');
        });
      });
    });
  });
});
