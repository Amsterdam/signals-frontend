/* eslint-disable cypress/no-unnecessary-waiting */
import { CONTAINERS } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/containerOnMap.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

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

      cy.get(CONTAINERS.panelContainerInfo).invoke('outerWidth').should('be.gt', 400).and('be.lt', 401);
      cy.get(CONTAINERS.buttonCollapsePanel).click();
      cy.get(CONTAINERS.panelContainerInfo).invoke('outerWidth').should('be.gt', 30).and('be.lt', 31);
      cy.get(CONTAINERS.buttonCollapsePanel).click();
      cy.get(CONTAINERS.panelContainerInfo).invoke('outerWidth').should('be.gt', 400).and('be.lt', 401);

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
      cy.wait(500);
      cy.get(CONTAINERS.buttonUitzoomen).click();
      // wait for zoom
      cy.wait(500);
      cy.get(CONTAINERS.clusterIcon).its('length').should('be.gt', 1);
      cy.get(CONTAINERS.buttonInzoomen).click();
      // wait for zoom
      cy.wait(500);
      cy.get(CONTAINERS.buttonInzoomen).click();
      // wait for zoom
      cy.wait(500);
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

      cy.get('.Restafval').should('not.exist');
      cy.get('.Papier').should('not.exist');
      cy.get('.Plastic').should('not.exist');
      cy.get('.Glas').should('not.exist');

      cy.get(CONTAINERS.clusterIcon).click();
      cy.get('.Restafval').should('have.length', 2).and('be.visible');
      cy.get('.Papier').should('have.length', 1).and('be.visible');
      cy.get('.Plastic').should('have.length', 1).and('be.visible');
      cy.get('.Glas').should('have.length', 1).and('be.visible');

      cy.get('.Papier').click();
      cy.get(CONTAINERS.containerListItem).should('contain', 'Papier container');
      cy.get(CONTAINERS.clusterIcon).click();
      cy.get('.Plastic').click();
      cy.get(CONTAINERS.containerListItem).should('contain', 'Plastic container');
      cy.get(CONTAINERS.clusterIcon).click();
      cy.get('.Restafval').first().click();
      cy.get(CONTAINERS.containerListItem).should('contain', 'Restafval container');
      cy.get(CONTAINERS.buttonRemoveContainer).eq(1).click();
      cy.get(CONTAINERS.containerListItem).should('not.contain', 'Plastic container');

      cy.get(CONTAINERS.buttonMeldDezeContainer).click();

      cy.get(CONTAINERS.containerListItem).should('contain', 'Papier container');
      cy.get(CONTAINERS.containerListItem).should('contain', 'Restafval container');

      cy.contains('Wijzigen').click();

      cy.get(CONTAINERS.clusterIcon).click();
      cy.get('.Glas').click();
      cy.wait(500);
      cy.get(CONTAINERS.clusterIcon).click();
      cy.wait(500);
      cy.get('.Papier').click();

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

    it('Should show the signal details', () => {
      routes.stubPreviewMap();
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(signal);
    });
  });
});
