// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import subWeeks from 'date-fns/subWeeks'
import * as requests from '../../support/commandsRequests';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as general from '../../support/commandsGeneral';
import { SAMENHANG_TEXT } from '../../support/texts';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { SAME_AREA } from '../../support/selectorsSamenhang';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';

let iconCount: number

// skipping test case; need to re-evaluate what exactly needs to be covered by integration testing
describe.skip('Signals in same area', () => {
  before(() => {
    // Signal state 'Afgehandeld'
    requests.createSignalSameAreaAfgehandeld();
    requests.patchLatestSignalStatus();

    // Create cluster of signals
    requests.createSignalSameAreaCluster('36-1');
    requests.createSignalSameAreaCluster('36-4');
    requests.createSignalSameAreaCluster('36-H');

    // Create single signal with state 'Gemeld'
    requests.createSignalSameAreaSingle();

    // Create hoofdmelding and deelmelding
    requests.createSignalSameAreaDeelmelding();

    // Create signal with other category than filtered category
    requests.createSignalSameAreaOtherCategory();

    localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
  });

  beforeEach(() => {
    iconCount = 0
  })

  it('Should show signals in the same area on map', () => {
    cy.intercept('**/context/near/geography').as('getGeography');
    routes.getManageSignalsRoutes();
    routes.getSignalDetailsRoutes();
    cy.visit('/manage/incidents/');
    routes.waitForManageSignalsRoutes();

    // Startdate of the period is today - 12 week
    const startDate = general.dateToString(new Date(subWeeks(new Date(), 12).toISOString()));
    const todaysDate = general.getTodaysDate();

    createSignal.openCreatedSignal();
    cy.get(SIGNAL_DETAILS.linkMeldingenOmgeving).should('be.visible').click();
    cy.wait('@getGeography');
    cy.wait('@getSignal');
    cy.url().should('include', '/omgeving');

    // Filter
    cy.get('h1').should('have.text', 'Filter').and('be.visible')
    cy.get(SAME_AREA.subcategoryLabel).should('have.text', 'Subcategorie (verantwoordelijke afdeling)').and('be.visible');
    cy.get(SAME_AREA.signalSubcategory).should('contain', 'Container papier vol').and('be.visible');
    cy.get(SAME_AREA.signalDepartments).should('contain', 'AEG').and('be.visible');
    cy.get(SAME_AREA.statusLabel).should('have.text', 'Status').and('be.visible');
    cy.get(SAME_AREA.statusLabel).siblings('ul').should('contain', 'Openstaand').and('contain', 'Afgehandeld').and('be.visible');
    cy.get(SAME_AREA.periodLabel).should('have.text', 'Periode').and('be.visible');
    cy.get(SAME_AREA.period).should('contain', `${startDate} t/m NU`).and('be.visible');
    cy.get(SAME_AREA.areaLabel).should('have.text', 'Omgeving').and('be.visible');
    cy.get(SAME_AREA.areaLabel).siblings('ul').should('contain', 'Locatie huidige melding').and('contain', 'Straal 50m').and('be.visible');
    cy.get(SAME_AREA.kindLabel).should('have.text', 'Soort').and('be.visible');
    cy.get(SAME_AREA.kindLabel).siblings('ul').should('contain', 'Standaardmelding').and('contain', 'Deelmelding').and('be.visible');

    // Map
    cy.get(SAME_AREA.map).should('be.visible');
    cy.get(SAME_AREA.clustericon).should('be.visible');

    cy.get(SAME_AREA.icon).then(($I) => {
      iconCount = $I.length
    })

    cy.get(SAME_AREA.clustericon).eq(1).scrollIntoView().click();

    cy.get(SAME_AREA.icon).then(($I) => {
      expect(iconCount).not.equals($I.length)

      cy.get(SAME_AREA.map).click(50, 50);
      cy.wait(1000);

      cy.get(SAME_AREA.icon).then(($I2) => {
        expect(iconCount).equals($I2.length)

        iconCount = $I2.length

        cy.get(SAME_AREA.clustericon).eq(2).scrollIntoView().click({ force: true });
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

        // Close map
        cy.get(SAME_AREA.buttonCloseMap).click();
        routes.waitForSignalDetailsRoutes();
        cy.get(SIGNAL_DETAILS.linkMeldingenOmgeving).should('be.visible').scrollIntoView({ offset: { top: -100, left: 0 } }).click();
      })
    })
  });
});
