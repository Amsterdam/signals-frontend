/* eslint-disable max-nested-callbacks */
// <reference types="Cypress" />
import * as requests from '../support/commandsRequests';
import * as deelmelding from '../support/commandsDeelmeldingen';
import * as createSignal from '../support/commandsCreateSignal';
import { CHANGE_STATUS, DEELMELDING, SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import { FILTER } from '../support/selectorsManageIncidents';
import { generateToken } from '../support/jwt';

describe('Deelmeldingen', () => {
  describe('Create Deelmeldingen', () => {
    describe('Set up data', () => {
      it('Should create a signal', () => {
        requests.createSignalDeelmelding();
      });
    });
    describe('Create Deelmeldingen', () => {
      beforeEach(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        cy.server();
        cy.getManageSignalsRoutes();
        cy.getSignalDetailsRoutesById();
        cy.visitFetch('/manage/incidents/');
        cy.waitForManageSignalsRoutes();
        cy.log(Cypress.env('signalId'));
      });
      it('Should cancel creating deelmeldingen', () => {
        cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}/split`);
        cy.get(DEELMELDING.disclaimer).contains('De persoon die de oorspronkelijke melding heeft gedaan, ontvangt een email per deelmelding.');
        cy.get(DEELMELDING.disclaimer).contains('De oorspronkelijke melding wordt afgesloten als deze gesplitst wordt.');
        cy.get(DEELMELDING.disclaimer).contains('Een melding kan maar 1 keer gesplitst worden.');
        cy.get(DEELMELDING.buttonCancel).click();
        createSignal.checkSignalDetailsPage();
      });
      it('Should create 3 deelmeldingen from signal', () => {
        cy.postDeelmeldingen();
        cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}/split`);
        cy.get(DEELMELDING.buttonAdd).click();

        deelmelding.setDeelmelding('1', 'Snel varen (ASC, WAT)', 'Er vaart iemand te hard onder de Berlagebrug door.');
        deelmelding.setDeelmelding('2', 'Brug (STW, WAT)', 'De Berlagebrug is stuk.');
        deelmelding.setDeelmelding('3', 'Olie op het water (AEG, ASC, WAT)', 'In de buurt van de Berlagebrug ligt een plas olie op het water.');

        cy.get(DEELMELDING.buttonCreate).click();
        cy.waitForPostDeelmeldingen();
        cy.get(DEELMELDING.notification).should('have.text', 'De melding is succesvol gesplitst').and('be.visible');
        cy.waitForSignalDetailsRoutes();

        createSignal.checkSignalDetailsPage();
        createSignal.checkRedTextStatus('Gesplitst');
        cy.get(SIGNAL_DETAILS.titleDeelmelding).should('have.text', 'Deelmelding').and('be.visible');
        cy.get(SIGNAL_DETAILS.deelmeldingen).find('li').should('have.length', 3).and('have.css', 'background-color', 'rgb(230, 230, 230)');

        cy.get(SIGNAL_DETAILS.historyAction).eq(0).contains('Update status naar: Gesplitst').should('be.visible');
        cy.get(SIGNAL_DETAILS.historyListItem).eq(0).contains('Deze melding is opgesplitst.').should('be.visible');

        deelmelding.checkDeelmelding('1', 'Snel varen (ASC, WAT)');
        deelmelding.checkDeelmelding('2', 'Brug (STW, WAT)');
        deelmelding.checkDeelmelding('3', 'Olie op het water (ASC, AEG, WAT)');

        // Check signal data deelmelding 01
        cy.get(SIGNAL_DETAILS.deelmeldingId).eq(0).click();
        cy.get(SIGNAL_DETAILS.linkParent).should('have.text', Cypress.env('signalId')).and('be.visible');
        cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Oost').should('be.visible');
        cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Weesperzijde 159-1').should('be.visible');
        cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1097DS Amsterdam').should('be.visible');
        cy.get(SIGNAL_DETAILS.email).should('have.text', '').should('be.visible');
        cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').should('be.visible');
        cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');
        createSignal.checkCreationDate();
        createSignal.checkRedTextStatus('Gemeld');
        cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
        cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').should('be.visible');
        cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Snel varen (ASC, WAT)').and('be.visible');
        cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Overlast op het water').should('be.visible');
        cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').should('be.visible');
        cy.get(SIGNAL_DETAILS.historyAction).eq(0).contains('Notitie toegevoegd').should('be.visible');
        cy.get(SIGNAL_DETAILS.historyListItem).eq(0).contains('Nootje 1').should('be.visible');
      });
    });
  });
  describe('Filter Deelmeldingen', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.route('/maps/topografie?bbox=*').as('getMap');
      cy.route('/signals/v1/private/terms/categories/**').as('getTerms');
      cy.route('**&page=1&ordering=id&page_size=50').as('getSortedASC');
      cy.route('**&page=1&ordering=-id&page_size=50').as('getSortedDESC');
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });
    it('Should filter on melding', () => {
      deelmelding.filterSignalOnType('Melding', FILTER.checkboxMelding);
    });
    it('Should filter on hoofdmelding', () => {
      deelmelding.filterSignalOnType('Hoofdmelding', FILTER.checkboxHoofdmelding);
    });
    it('Should filter on deelmelding', () => {
      deelmelding.filterSignalOnType('Deelmelding', FILTER.checkboxDeelmelding);
    });
  });
  describe.skip('Change status Deelmeldingen', () => {
    describe('Set up testdata', () => {
      it('Should create a signal', () => {
        requests.createSignalDeelmelding();
      });
    });
    describe.skip('Change status Deelmeldingen', () => {
      // Skipped because this test will fail, in upcoming sprints this will be implemented
      it('Change status Deelmeldingen', () => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        cy.server();
        cy.getManageSignalsRoutes();
        cy.getSignalDetailsRoutesById();
        cy.visitFetch('/manage/incidents/');
        cy.waitForManageSignalsRoutes();
        cy.log(Cypress.env('signalId'));
        cy.postDeelmeldingen();
        cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}/split`);
        cy.get(DEELMELDING.buttonAdd).click();
        cy.get(DEELMELDING.buttonCreate).click();
        cy.waitForPostDeelmeldingen();
        cy.get(DEELMELDING.notification).should('have.text', 'De melding is succesvol gesplitst').and('be.visible');
        cy.waitForSignalDetailsRoutes();

        // Check status changes deelmelding
        cy.get(SIGNAL_DETAILS.deelmeldingId).eq(0).click();
        cy.get(SIGNAL_DETAILS.linkParent).should('have.text', Cypress.env('signalId')).and('be.visible');
        cy.get(CHANGE_STATUS.buttonEdit).click();
        cy.get('input[type=radio]').each($el => {
          const message = 'De melder ontvangt deze toelichting niet.';
          cy.wrap($el).check();
          cy.get(CHANGE_STATUS.statusNotification).should('have.text', message);
        });
        cy.get(CHANGE_STATUS.inputToelichting).type('Deze deelmelding wordt geannuleerd');
        cy.get(CHANGE_STATUS.buttonSubmit).click();
      });
    });
  });
});
