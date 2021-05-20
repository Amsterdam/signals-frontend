// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
/* eslint-disable cypress/no-unnecessary-waiting */
import { CONTAINERS } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/containerOnMap.json';
import signalDeelmelding01 from '../../fixtures/signals/containerOnMapDeelmelding01.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';

describe('Create signal "Container" and check signal details, container is on the map', () => {
  describe('Check legend and zoom functionality', () => {
    before(() => {
      routes.postSignalRoutePublic();
      routes.stubPreviewMap();
      routes.stubMap();
      cy.visit('incident/beschrijf');
    });
    it('Should check Legend and zoom in/out', () => {
      createSignal.setDescriptionPage(signal);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(signal);
      cy.contains('Kies de container waar het om gaat').should('be.visible');
      cy.get(CONTAINERS.map).should('be.visible');
      cy.get(CONTAINERS.buttonKiesOpKaart).click();
      cy.contains('U kunt meer dan 1 keuze maken').should('be.visible');
      cy.contains('Maak een keuze op de kaart').should('be.visible');

      cy.get(CONTAINERS.panelContainerInfo).invoke('outerWidth').should('be.at.least', 400).and('be.lt', 401);
      cy.get(CONTAINERS.buttonCollapsePanel).click();
      cy.get(CONTAINERS.panelContainerInfo).invoke('outerWidth').should('be.at.least', 30).and('be.lt', 31);
      cy.get(CONTAINERS.buttonCollapsePanel).click();
      cy.get(CONTAINERS.panelContainerInfo).invoke('outerWidth').should('be.at.least', 400).and('be.lt', 401);

      cy.get(CONTAINERS.buttonLegenda).click();
      cy.get(CONTAINERS.legendaItemRestafval).should('be.visible');
      cy.get(CONTAINERS.legendaItemPapier).should('be.visible');
      cy.get(CONTAINERS.legendaItemGlas).should('be.visible');
      cy.get(CONTAINERS.legendaItemPlastic).should('be.visible');
      cy.get(CONTAINERS.legendaItemTextiel).should('be.visible');
      cy.get(CONTAINERS.legendaItemGFT).should('be.visible');
      cy.get(CONTAINERS.legendaItemBrood).should('be.visible');

      cy.get(CONTAINERS.buttonCloseLegenda).click();

      cy.get(CONTAINERS.clusterIcon).should('have.length', 1);
      cy.get(CONTAINERS.buttonUitzoomen).click();
      // wait for zoom
      cy.wait(1000);
      cy.get(CONTAINERS.buttonUitzoomen).click();
      // wait for zoom
      cy.wait(2000);
      cy.get(CONTAINERS.clusterIcon, { timeout: 10000 } ).its('length').should('be.gt', 1);
      cy.get(CONTAINERS.buttonInzoomen).click();
      // wait for zoom
      cy.wait(1000);
      cy.get(CONTAINERS.buttonInzoomen).click();
      // wait for zoom
      cy.wait(1000);
      cy.get(CONTAINERS.clusterIcon).should('have.length', 1);
    });
  });
  describe('Create signal container', () => {
    before(() => {
      routes.postSignalRoutePublic();
      routes.stubPreviewMap();
      routes.stubMap();
      cy.visit('incident/beschrijf');
    });
    it('Should create the signal', () => {
      createSignal.setDescriptionPage(signal);
      cy.contains('Volgende').click();
      cy.get(CONTAINERS.buttonKiesOpKaart).click();

      cy.get(CONTAINERS.checkBoxContainerNietopKaart).click();
      cy.get(CONTAINERS.inputContainerNummer).type('44Af-1');

      cy.get(CONTAINERS.containerRestafval).should('not.exist');
      cy.get(CONTAINERS.containerPapier).should('not.exist');
      cy.get(CONTAINERS.containerPlastic).should('not.exist');
      cy.get(CONTAINERS.containerGlas).should('not.exist');

      cy.get(CONTAINERS.clusterIcon).click();
      cy.wait(1000);
      cy.get(CONTAINERS.containerRestafval).should('have.length', 2).and('be.visible');
      cy.get(CONTAINERS.containerPapier).should('have.length', 1).and('be.visible');
      cy.get(CONTAINERS.containerPlastic).should('have.length', 1).and('be.visible');
      cy.get(CONTAINERS.containerGlas).should('have.length', 1).and('be.visible');

      cy.get(CONTAINERS.containerPapier).click();
      cy.wait(500);
      cy.get(CONTAINERS.containerListItem).should('contain', 'Papier container');
      cy.get(CONTAINERS.containerPlastic).click();
      cy.wait(500);
      cy.get(CONTAINERS.containerListItem).should('contain', 'Plastic container');
      cy.get(CONTAINERS.containerRestafval).first().click();
      cy.wait(500);
      cy.get(CONTAINERS.containerListItem).should('contain', 'Restafval container');
      cy.get(CONTAINERS.buttonRemoveContainer).eq(1).click();
      cy.get(CONTAINERS.containerListItem).should('not.contain', 'Plastic container');

      cy.get(CONTAINERS.buttonMeldDezeContainer).click();

      cy.contains('De container staat niet op de kaart - 44Af-1').should('be.visible');
      cy.get(CONTAINERS.containerListItem).should('contain', 'Papier container');
      cy.get(CONTAINERS.containerListItem).should('contain', 'Restafval container');

      cy.contains('Wijzigen').click();

      cy.get(CONTAINERS.clusterIcon).click();
      cy.wait(500);
      cy.get(CONTAINERS.containerGlas).click();
      cy.wait(500);
      cy.get(CONTAINERS.containerPapier).click();

      cy.get(CONTAINERS.containerListItem).should('contain', 'Restafval container');
      cy.get(CONTAINERS.containerListItem).should('contain', 'Glas container');
      cy.get(CONTAINERS.buttonMeldDezeContainer).click();
      cy.get(CONTAINERS.containerListItem).should('contain', 'Restafval container');
      cy.get(CONTAINERS.containerListItem).should('contain', 'Glas container');

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

    it('Should show the details of the hoofdmelding and the details of a deelmelding', () => {
      routes.stubPreviewMap();
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(signal, 'standaardmelding');

      // Check if deelmeldingen are visible
      cy.get(SIGNAL_DETAILS.titleDeelmelding).should('have.text', 'Deelmelding').and('be.visible');
      cy.get(SIGNAL_DETAILS.deelmeldingBlock).should('have.length', 3).and('be.visible');
      cy.get(SIGNAL_DETAILS.deelmeldingId).eq(0).click();
      // Check deelmelding details
      createSignal.checkAllDetails(signalDeelmelding01, 'deelmelding');
    });
  });
});
