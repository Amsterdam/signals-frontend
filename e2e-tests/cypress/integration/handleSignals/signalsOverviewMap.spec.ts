// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import * as requests from '../../support/commandsRequests';
import { FILTER, MANAGE_SIGNALS, OVERVIEW_MAP } from '../../support/selectorsManageIncidents';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Signal overview Map', () => {
  describe('Setup testdata', () => {
    it('Should setup the testdata', () => {
      // Create signals to use on the map
      requests.createSignalOverviewMap();
      requests.createSignalOverviewMap();
      requests.createSignalOverviewMap();
      requests.createSignalOverviewMap();
      requests.createSignalOverviewMap();
      requests.createSignalOverviewMap();
    });
  });

  describe('Use overview Map', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });
    it('Should open the signals overview map with signals', () => {
      routes.defineMapRoutes();

      cy.visit('manage/incidents/kaart');

      cy.wait('@getSignals');
      cy.wait('@getGeography');
      cy.wait('@getFilters');
      cy.wait('@getCategories');

      cy.contains('Afgelopen 24 uur').should('be.visible');
      cy.get(OVERVIEW_MAP.overViewMap).should('be.visible');
      cy.get(OVERVIEW_MAP.autoSuggest).should('be.visible');
      cy.get(OVERVIEW_MAP.buttonZoomOut).should('be.visible');
      cy.get(OVERVIEW_MAP.buttonZoomIn).should('be.visible');
      cy.get(OVERVIEW_MAP.markerCluster).should('be.visible');
    });

    it('Should not show signals if filtered out', () => {
      routes.defineMapRoutes();

      cy.get(MANAGE_SIGNALS.buttonFilter).click();
      cy.get('[value=japanse-duizendknoop]').click();
      cy.get(FILTER.buttonSubmitFilter).click();
      cy.wait('@getSignals');
      cy.wait('@getGeography');
      cy.wait(1000);
      cy.get(OVERVIEW_MAP.markerCluster).should('not.exist');
    });

    it('Should show signals again', () => {
      routes.defineMapRoutes();

      cy.get(MANAGE_SIGNALS.buttonFilter).click();
      cy.get(FILTER.buttonNieuwFilter).click();
      cy.get(FILTER.buttonSubmitFilter).click();
      cy.wait('@getSignals');
      cy.wait('@getGeography');
      cy.get(OVERVIEW_MAP.markerCluster).should('be.visible');
    });

    it('Should search for an address', () => {
      routes.stubAddress('signalForOverviewMap.json');
      cy.get(OVERVIEW_MAP.buttonZoomIn).click();
      createSignal.searchAddress('1012RJ 147');
      createSignal.selectAddress('Nieuwezijds Voorburgwal 147, 1012RJ Amsterdam');

      // Wait is needed to finish zoom when selecting address, otherwise test is failing
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);
    });

    it('Should click on a cluster of signals and open signal details', () => {
      cy.get(OVERVIEW_MAP.overViewMap).click(468, 300);
      cy.get(OVERVIEW_MAP.overViewMap).click(440, 338);
      cy.get(OVERVIEW_MAP.detailPane).should('be.visible');

      cy.get(OVERVIEW_MAP.signalDetails).find('[href*="/manage"]').then($signalLink => {
        // Get the signal number
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const text = $signalLink.text();
        const expression = (/\d+/);
        const signalId = expression.exec(text)[0];

        cy.writeFile('./cypress/fixtures/tempSignalId.json', { signalId: `${signalId}` }, { flag: 'w' });
        cy.get(OVERVIEW_MAP.signalDetails).find('[href*="/manage"]').click();
        // Url contains signal number
        cy.url().should('include', signalId);
      });
    });

    it('Should show the correct details of the signal', () => {
      createSignal.checkSignalDetailsPage();
      cy.contains('Er staat een paard in de gang, ja ja een paard in de gang.');

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Centrum').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Nieuwezijds Voorburgwal 147').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1012RJ Amsterdam').and('be.visible');

      cy.get(SIGNAL_DETAILS.handlingTime).should('have.text', '21 dagen').and('be.visible');
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Overig openbare ruimte (ASC)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Overlast in de openbare ruimte').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });

    it('Should go back to the map', () => {
      cy.get(OVERVIEW_MAP.buttonBack).click();
      cy.get(OVERVIEW_MAP.overViewMap).should('be.visible');
      cy.get(OVERVIEW_MAP.autoSuggest).should('be.visible');
    });
  });
});
