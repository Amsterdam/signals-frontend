// <reference types="Cypress" />

import * as createSignal from '../support/commands-create-signal';
import { MENU_ITEMS } from '../support/selectors-manage-incidents';
import { CREATE_SIGNAL } from '../support/selectors-create-signal';

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
    cy.get(MENU_ITEMS.openMenu).click();
    cy.contains('Melden').click();
    cy.checkHeader('Beschrijf uw melding');
  });

  it('Search for adress', () => {
    cy.server();
    cy.defineGeoSearchRoutes();
    cy.getAdressRoute('1012GX 23');

    // Check URL
    cy.url().should('include', '/incident/beschrijf');

    // Check h1
    cy.checkHeader('Beschrijf uw melding');

    // Select source
    cy.get('select').select('Telefoon – Stadsdeel');

    // Search adress
    createSignal.searchAdress('1012GX 23');
    cy.wait('@getAdress');

    // Select found item  
    createSignal.selectAdress('Oudekerksplein 23, 1012GX Amsterdam');
    cy.wait('@lookup')
      .wait('@location')
      .wait('@geoSearchLocation');
  });

  it('Fill problem details', () => {
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

  it('Fill in specific information', () => {

    // Check URL
    cy.url().should('include', '/incident/vulaan');

    // Check h1
    cy.checkHeader('Dit hebben we nog van u nodig');
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

  it('Fill in phonenumber', () => {

    // Check URL
    cy.url().should('include', '/incident/telefoon');

    // Check h1
    cy.checkHeader('Mogen we u bellen voor vragen?');

    cy.clickButton('Volgende');
  });

  it('Fill in e-mailadres', () => {

    // Check URL
    cy.url().should('include', '/incident/email');

    // Check h1
    cy.checkHeader('Wilt u op de hoogte blijven?');

    cy.clickButton('Volgende');

  });

  it('Check overview', () => {

    // Check URL
    cy.url().should('include', '/incident/samenvatting');

    // Check h1
    cy.checkHeader('Controleer uw gegevens');

    // Check information provided by user
    cy.contains('Oudekerksplein 23, 1012GX Amsterdam').should('be.visible');
    cy.contains('Er is een wespennest bij de hoofdingang van de Oude kerk');

    // Check marker on map
    cy.get(CREATE_SIGNAL.imageAdressMarker).find("img").should('be.visible');

    // Click on next
    cy.clickButton('Verstuur');

  });

  it('Last screen', () => {

    // Check URL
    cy.url().should('include', '/incident/bedankt');

    // Check h1
    cy.checkHeader('Bedankt!');

    // TODO capture signal id

  });


});
