// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
/* eslint-disable cypress/no-unnecessary-waiting */
import { EIKENPROCESSIERUPS, GENERAL_MAP } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/eikenprocessierups.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Create signal "Eikenprocessierups" and check signal details', () => {
  describe('Check legend and zoom functionality', () => {
    before(() => {
      routes.postSignalRoutePublic();
      routes.stubPreviewMap();
      routes.stubMap();
      cy.visit('incident/beschrijf');
    });
    it('Should check Legend and zoom in/out', () => {
      cy.intercept('**/arcgis/rest/services/**', { fixture: 'eikenprocessierups/treeData01' } ).as('getTreeData01');
      
      createSignal.setDescriptionPage(signal);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(signal);
      cy.contains('Kies de boom waarin u de eikenprocessierupsen hebt gezien').should('be.visible');
      cy.get(GENERAL_MAP.map).should('be.visible');
      cy.get(GENERAL_MAP.buttonKiesOpKaart).click();
      cy.wait('@getTreeData01');
      cy.contains('U kunt meer dan 1 keuze maken').should('be.visible');
      cy.contains('Maak een keuze op de kaart').should('be.visible');

      cy.get(GENERAL_MAP.panelInfo).invoke('outerWidth').should('be.at.least', 400).and('be.lt', 401);
      cy.get(GENERAL_MAP.buttonCollapsePanel).click();
      cy.get(GENERAL_MAP.panelInfo).invoke('outerWidth').should('be.at.least', 30).and('be.lt', 31);
      // Should show 2 already reported trees
      cy.wait(1000)
      cy.get('[alt*="is gemeld"]').should('have.length', 2).and('be.visible');

      cy.get(GENERAL_MAP.buttonCollapsePanel).click();
      cy.get(GENERAL_MAP.panelInfo).invoke('outerWidth').should('be.at.least', 400).and('be.lt', 401);

      cy.get(GENERAL_MAP.buttonLegenda).click();
      cy.get(EIKENPROCESSIERUPS.legendaItemEik).should('be.visible');
      cy.get(EIKENPROCESSIERUPS.legendaItemIsGemeld).should('be.visible');

      cy.get(GENERAL_MAP.buttonCloseLegenda).click();

      // Zoom out, zoom in
      cy.get(GENERAL_MAP.icon).should('have.length', 26);
      cy.intercept('**/arcgis/rest/services/**', { fixture: 'eikenprocessierups/treeData02' } ).as('getTreeData02');
      cy.get(GENERAL_MAP.buttonUitzoomen).click();
      cy.wait('@getTreeData02');
      cy.get(GENERAL_MAP.icon).should('have.length', 65);
      cy.intercept('**/arcgis/rest/services/**', { fixture: 'eikenprocessierups/treeData01' } ).as('getTreeData01');
      cy.get(GENERAL_MAP.buttonInzoomen).click();
      cy.wait('@getTreeData01');
      cy.get(GENERAL_MAP.icon).should('have.length', 26);

      cy.get(GENERAL_MAP.buttonCloseMap).click();
      cy.get(GENERAL_MAP.buttonKiesOpKaart).should('be.visible');
    });
  });
  describe('Create signal eikenprocessierups', () => {
    before(() => {
      routes.postSignalRoutePublic();
      routes.stubPreviewMap();
      routes.stubMap();
      cy.visit('incident/beschrijf');
    });
    it('Should create the signal', () => {
      cy.intercept('**/arcgis/rest/services/**', { fixture: 'eikenprocessierups/treeData01' } ).as('getTreeData01');
      createSignal.setDescriptionPage(signal);
      cy.contains('Volgende').click();
      cy.get(GENERAL_MAP.buttonKiesOpKaart).click();

      // Select 1 tree not on map
      cy.get(EIKENPROCESSIERUPS.checkBoxBoomNietOpKaart).click();

      // Select 2 trees
      cy.get(GENERAL_MAP.icon).eq(23).click();
      cy.wait(1000)
      cy.get(GENERAL_MAP.icon).eq(24).click();
      cy.wait(1000)
      cy.get(EIKENPROCESSIERUPS.boomListItem).should('have.length', 2).and('be.visible');

      // Remove first tree from list
      cy.get(EIKENPROCESSIERUPS.buttonRemoveBoom).eq(0).click();
      cy.get(EIKENPROCESSIERUPS.boomListItem).should('have.length', 1).and('be.visible');

      cy.get(EIKENPROCESSIERUPS.buttonMeldDezeBoom).click();

      cy.get(EIKENPROCESSIERUPS.boomListItem).should('have.length', 2).and('be.visible');

      // Change selection of trees, add 1 tree again
      cy.contains('Wijzigen').click();
      cy.get(GENERAL_MAP.icon).eq(23).click();
      cy.get(EIKENPROCESSIERUPS.boomListItem).should('have.length', 2).and('be.visible');

      cy.get(EIKENPROCESSIERUPS.buttonMeldDezeBoom).click();

      cy.get(EIKENPROCESSIERUPS.boomListItem).should('have.length', 3).and('be.visible');

      // Check all answers
      cy.get(EIKENPROCESSIERUPS.radioButtonGeenNest).check( {force: true} ).should('be.checked');
      cy.get(EIKENPROCESSIERUPS.radioButtonNestDeken).check( {force: true} ).should('be.checked');
      cy.get(EIKENPROCESSIERUPS.radiobuttonNestVoetbal).check( {force: true} ).should('be.checked');
      cy.get(EIKENPROCESSIERUPS.radioButtonNestTennisbal).check( {force: true} ).should('be.checked');

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

    it('Should show the details of the signal', () => {
      routes.stubPreviewMap();
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(signal, 'standaardmelding');
    });
  });
});
