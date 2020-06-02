// <reference types="Cypress" />
import * as requests from '../support/commandsRequests';
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL } from '../support/selectorsCreateSignal';
import { FILTER, MANAGE_SIGNALS, OVERVIEW_MAP } from '../support/selectorsManageIncidents';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Signal overview Map', () => {
  beforeEach(() => { 
    localStorage.setItem('accessToken', (Cypress.env('token')));
  });

  it('Should setup the testdata', () => {
    // Create signals to use on the map
    requests.createSignalOverviewMap();
    requests.createSignalOverviewMap();
    requests.createSignalOverviewMap();
    requests.createSignalOverviewMap();
    requests.createSignalOverviewMap();
    requests.createSignalOverviewMap();
  });

  it('Should open the signals overview map with signals', () => {
    cy.server();
    cy.defineMapRoutes();

    cy.visitFetch('manage/incidents/kaart');

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
    cy.server();
    cy.defineMapRoutes();
    
    cy.get(MANAGE_SIGNALS.buttonFilteren).click();
    cy.get('[value=japanse-duizendknoop]').click();
    cy.get(FILTER.buttonSubmitFilter).click();
    cy.wait('@getGeography');
    cy.get(OVERVIEW_MAP.clusterMarker).should('not.be.visible');
  });

  it('Should show signals again', () => {
    cy.server();
    cy.defineMapRoutes();

    cy.get(MANAGE_SIGNALS.buttonFilteren).click();
    cy.get(FILTER.buttonNieuwFilter).click();
    cy.get(FILTER.buttonSubmitFilter).click();
    cy.wait('@getSignals');
    cy.wait('@getGeography');
    cy.get(OVERVIEW_MAP.markerCluster).should('be.visible');
  });

  it('Should search for an address', () => {
    cy.server();
    cy.route('/locatieserver/v3/suggest?fq=gemeentenaam:**').as('getAddress');
    
    cy.get(OVERVIEW_MAP.buttonZoomIn).click();
    createSignal.searchAddress('1012RJ 147');
    cy.wait('@getAddress');
    createSignal.selectAddress('Nieuwezijds Voorburgwal 147, 1012RJ Amsterdam');
    
    // Wait is needed to finish zoom when selecting address, otherwise test is failing
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  });

  it('Should click on a cluster of signals and open signal details', () => {
    cy.get(OVERVIEW_MAP.overViewMap).click(468,300);
    cy.get(OVERVIEW_MAP.overViewMap).click(440,338);
    cy.get(OVERVIEW_MAP.detailPane).should('be.visible');
    
    cy.get(OVERVIEW_MAP.openSignalDetails).then($signalLink => {
      // Get the signal number
      const signalId = $signalLink.text().match(/\d+/)[0];
      cy.get(OVERVIEW_MAP.openSignalDetails).click();
      // Url contains signal number
      cy.url().should('include', signalId);
    });
  });

  it('Should show the correct details of the signal', () => {
    cy.contains('Er staat een paard in de gang, ja ja een paard in de gang.');
    
    // Check if map and marker are visible
    cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
    cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

    cy.get(SIGNAL_DETAILS.stadsdeel).contains('Stadsdeel: ').and('contain', 'Centrum').should('be.visible');
    cy.get(SIGNAL_DETAILS.addressStreet).contains('Nieuwezijds Voorburgwal').and('contain', '147').should('be.visible');
    cy.get(SIGNAL_DETAILS.addressCity).contains('1012RJ').and('contain', 'Amsterdam').should('be.visible');

    // Check if status is 'gemeld' with red coloured text
    cy.get(SIGNAL_DETAILS.status).contains('Gemeld').should('be.visible').and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });

    // TODO should have a data-testid
    // check urgency
    cy.contains('Normaal').should('be.visible');
    cy.contains('Overig openbare ruimte').should('be.visible');

    cy.get(SIGNAL_DETAILS.mainCategory).contains('Overlast in de openbare ruimte').should('be.visible');
    cy.get(SIGNAL_DETAILS.source).contains('online').should('be.visible');
  });

  it('Should go back to the map', () => {
    cy.get(OVERVIEW_MAP.buttonBack).click();
    cy.get(OVERVIEW_MAP.overViewMap).should('be.visible');
    cy.get(OVERVIEW_MAP.autoSuggest).should('be.visible');
  });
});
