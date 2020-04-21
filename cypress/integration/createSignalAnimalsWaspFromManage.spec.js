// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL } from '../support/selectorsCreateSignal';

describe('Create signal from incident management, animals', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', 'TEST123');
  });

  it('Initiate create signal from manage', () => {
    cy.server();
    cy.getManageSignalsRoutes();
    
    cy.visitFetch('/manage/incidents/');

    // Wait till page is loaded
    cy.wait('@getFilters');
    cy.wait('@getCategories');
    cy.wait('@getSignals');
    cy.wait('@getUserInfo');
    cy.openMenu();
    cy.contains('Melden').click();
    cy.checkHeaderText('Beschrijf uw melding');

    // Use visitfetch to open url, this enables Cypress to intercept fetch protocol
    cy.visitFetch('incident/beschrijf');
  });

  it('Should search for an address', () => {
    cy.server();
    cy.defineGeoSearchRoutes();
    cy.getAddressRoute();

    // Check URL
    cy.url().should('include', '/incident/beschrijf');

    // Check h1
    cy.checkHeaderText('Beschrijf uw melding');

    // Select source
    cy.get('select').select('Telefoon – Stadsdeel');

    // Search address
    createSignal.searchAddress('1012GX 23');
    cy.wait('@getAddress');

    // Select found item  
    createSignal.selectAddress('Oudekerksplein 23, 1012GX Amsterdam');
    cy.wait('@geoSearchLocation');
  });

  it('Should enter signal details', () => {
    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:wespen.json').as('prediction');
    createSignal.inputDescription('Er is een wespennest bij de hoofdingang van de Oude kerk');

    // Select datetime
    cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click();

    // Check Urgency
    cy.contains('Wat is de urgentie?').should('be.visible');
    cy.contains('Hoog').should('be.visible').click();
    cy.contains('Hoog: melding met spoed oppakken').should('be.visible');
    cy.contains('Laag').should('be.visible').click();
    cy.contains('Laag: interne melding zonder servicebelofte').should('be.visible');
    cy.contains('Normaal').should('be.visible').click();

    // Check Type
    cy.contains('Type').should('be.visible');
    cy.contains('Klacht').should('be.visible').click();

    // Click on next
    cy.clickButton('Volgende');
  });

  it('Should enter specific information', () => {
    // Check URL
    cy.url().should('include', '/incident/vulaan');

    // Check h1
    cy.checkHeaderText('Dit hebben we nog van u nodig');
    cy.contains('Er is een wespennest bij de hoofdingang van de Oude kerk');

    // Check text
    cy.contains('Let op: u kunt met dit formulier een melding doen van:');

    // Check link dieren ambulance
    cy.contains('Dierenambulance Amsterdam').should('have.attr', 'href').and('include', 'dierenambulance-amsterdam');

    // Check link melden dierenoverlast
    cy.contains('overlast van dieren').should('have.attr', 'href').and('include', 'veelgevraagd');

    // Click on next
    cy.clickButton('Volgende');
  });

  it('Should enter a phonenumber', () => {
    // Check URL
    cy.url().should('include', '/incident/telefoon');

    // Check h1
    cy.checkHeaderText('Mogen we u bellen voor vragen?');

    cy.clickButton('Volgende');
  });

  it('Should enter an email address', () => {
    // Check URL
    cy.url().should('include', '/incident/email');

    // Check h1
    cy.checkHeaderText('Wilt u op de hoogte blijven?');

    cy.clickButton('Volgende');
  });

  it('Should show an overview', () => {
    // Check URL
    cy.url().should('include', '/incident/samenvatting');

    // Check h1
    cy.checkHeaderText('Controleer uw gegevens');

    // Check if map and marker are visible
    cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
    cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

    // Check information provided by user
    cy.contains('Oudekerksplein 23, 1012GX Amsterdam').should('be.visible');
    cy.contains('Er is een wespennest bij de hoofdingang van de Oude kerk');
  });

  it('Should show the last screen', () => {
    cy.server();
    cy.postSignalRoutePrivate();

    cy.clickButton('Verstuur');

    cy.wait('@postSignalPrivate');

    // Check URL
    cy.url().should('include', '/incident/bedankt');

    // Check h1
    cy.checkHeaderText('Bedankt!');

    // TODO capture signal id
  });
});
