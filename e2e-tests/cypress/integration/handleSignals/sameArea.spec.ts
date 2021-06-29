// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { subWeeks } from 'date-fns'
import * as requests from '../../support/commandsRequests';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as general from '../../support/commandsGeneral';
import { SAMENHANG_TEXT } from '../../support/texts';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { SAME_AREA } from '../../support/selectorsSamenhang';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';

describe('Setup testdata', () => {
  it('Should setup the testdata', () => {
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
  });
});
describe('Signals in same area', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
  });
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
    cy.get(SAME_AREA.icon).should('have.length', 4);

    // Zoom in and zoom out, waits needed
    cy.get(SAME_AREA.zoomButtons).find(SAME_AREA.buttonZoomIn).click();
    cy.wait(1000);
    cy.get(SAME_AREA.icon).filter(':visible').should('have.length', 3);
    cy.get(SAME_AREA.zoomButtons).find(SAME_AREA.buttonZoomOut).click();
    cy.wait(1000);
    cy.get(SAME_AREA.icon).filter(':visible').should('have.length', 4);

    // Cluster icon
    cy.get(SAME_AREA.clustericon).should('be.visible').find('span').should('have.text', '3');
    cy.get(SAME_AREA.clustericon).click();
    cy.wait(1000);
    cy.get(SAME_AREA.icon).filter(':visible').should('have.length', 7);
    cy.get(SAME_AREA.map).click();
    cy.get(SAME_AREA.icon).filter(':visible').should('have.length', 4);

    cy.get(SAME_AREA.icon).eq(2).click();
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

    // Check Signal data
    cy.get(SAME_AREA.signalLabel).should('contain', 'Deelmelding').and('be.visible');
    cy.get(SAME_AREA.signalText).should('contain', SAMENHANG_TEXT.descriptionText).and('be.visible');
    cy.get(SAME_AREA.locationLabel).should('contain', 'Locatie').and('be.visible');
    cy.get(SAME_AREA.signalLocation).should('contain', 'Locatie is gepind op de kaart').and('be.visible');
    cy.get(SAME_AREA.dateLabel).should('contain', 'Gemeld op').and('be.visible');
    cy.get(SAME_AREA.signalDate).should('contain', todaysDate).and('be.visible');
    cy.get(SAME_AREA.statusLabel).should('contain', 'Status').and('be.visible');
    cy.get(SAME_AREA.signalStatus).should('contain', 'Gemeld').and('be.visible');
    cy.get(SAME_AREA.subcategoryLabel).should('contain', 'Subcategorie (verantwoordelijke afdeling)').and('be.visible');
    cy.get(SAME_AREA.signalSubcategory).should('contain', 'Container papier vol').and('be.visible');
    cy.get(SAME_AREA.signalDepartments).should('contain', 'AEG').and('be.visible');

    // Close map
    cy.get(SAME_AREA.buttonCloseMap).click();
    routes.waitForSignalDetailsRoutes();
    cy.get(SIGNAL_DETAILS.linkMeldingenOmgeving).should('be.visible').click();

    // Open map again and open nearby signal
    cy.get(SAME_AREA.zoomButtons).find(SAME_AREA.buttonZoomOut).click();
    cy.wait(1000);
    cy.get(SAME_AREA.icon).filter(':visible').should('have.length', 3);
    cy.get(SAME_AREA.icon).eq(1).click();
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(SAME_AREA.signalLabel).invoke('removeAttr', 'target').click();
    routes.waitForSignalDetailsRoutes();
    cy.get(SIGNAL_DETAILS.descriptionText).should('be.visible').and('contain', SAMENHANG_TEXT.descriptionText);
    cy.get(SIGNAL_DETAILS.linkMeldingenOmgeving).should('be.visible');
  });
});
