// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { STANDAARDTEKSTEN } from '../support/selectorsSettings';
import { MANAGE_SIGNALS } from '../support/selectorsManageIncidents';
import { CHANGE_STATUS, SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import * as requests from '../support/commandsRequests';
import { generateToken } from '../support/jwt';

describe('Standaardteksten', () => {
  describe('Create standaardteksten', () => {
    beforeEach(() => {
      cy.server();
      cy.getManageSignalsRoutes();
      cy.route('**/signals/v1/private/terms/categories/afval/sub_categories/asbest-accu/status-message-templates').as(
        'getAsbestAccu'
      );
      cy.route(
        '/signals/v1/private/terms/categories/overlast-van-dieren/sub_categories/duiven/status-message-templates'
      ).as('getDuiven');
      cy.route(
        'POST',
        '/signals/v1/private/terms/categories/overlast-van-dieren/sub_categories/duiven/status-message-templates'
      ).as('PostDuiven');
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should create standaardteksten for duiven', () => {
      cy.openMenu();
      cy.contains('Standaard teksten').click();
      cy.wait('@getAsbestAccu');

      cy.url().should('include', '/manage/standaard/teksten');
      cy.checkHeaderText('Beheer standaard teksten');

      cy.get(STANDAARDTEKSTEN.dropDownSubcategory).select('Duiven');
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
      cy.get(STANDAARDTEKSTEN.notification).should('be.visible');
      cy.get(STANDAARDTEKSTEN.buttonCloseNotification).click();
      cy.get(STANDAARDTEKSTEN.notification).should('not.be.visible');
      cy.wait('@PostDuiven');
    });
  });
  describe('Create signal duiven', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:duiven.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1017PR 1', 'Leidseplein 1, 1017PR Amsterdam');
      createSignal.setDescription('Ik word lastig gevallen door Duiven');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
      createSignal.checkSpecificInformationPage();
      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.server();
      cy.route('/maps/topografie?bbox=**').as('map');
      cy.postSignalRoutePublic();

      cy.contains('Volgende').click();
      cy.wait('@map');
      createSignal.checkSummaryPage();

      // Check information provided by user
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
    });

    it('Should show the last screen', () => {
      createSignal.checkThanksPage();
      // Capture signal id to check details later
      createSignal.getSignalId();
    });
  });
  describe('Change status of signal and check standaardtekst', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.server();
      cy.route('PATCH', '/signals/v1/private/signals/*').as('patchSignal');
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });

    it('Should change the status of the signal to Ingepland and show standaardtekst', () => {
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

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
      cy.get(SIGNAL_DETAILS.historyListItem).should('have.length', 2);
      cy.get(SIGNAL_DETAILS.historyListItem).first().should('have.text', 'Beschrijving standaardtekst 1 melding duiven INPLANNEN. De overlastgevende duif is geïdentificeerd als Cher Ami');
    });
    it('Should change the status of the signal to Afgehandeld and show standaardtekst', () => {
      cy.server();
      cy.route('PATCH', '/signals/v1/private/signals/*').as('patchSignal');
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

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
      cy.get(SIGNAL_DETAILS.historyListItem).should('have.length', 3);
      cy.get(SIGNAL_DETAILS.historyListItem).first().should('have.text', 'Beschrijving standaardtekst 1 melding duiven AFHANDELEN. De overlastgevende duif is geïdentificeerd als Valiant');
    });
    it('Should change the status of the signal to Heropend and show standaardtekst', () => {
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

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
      cy.get(SIGNAL_DETAILS.historyListItem).should('have.length', 4);
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
        cy.server();
        cy.getManageSignalsRoutes();
        cy.getSignalDetailsRoutesById();
        cy.visitFetch('/manage/incidents/');
        cy.waitForManageSignalsRoutes();
        cy.log(Cypress.env('signalId'));
      });
      it('Should show no message when there is no standaardtekst', () => {
        cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
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
