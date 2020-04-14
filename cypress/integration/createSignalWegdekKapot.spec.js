// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, WEGDEK } from '../support/selectorsCreateSignal';

describe('Create signal wegdek kapot', () => {
  before(() => {
    cy.server();
    cy.defineGeoSearchRoutes();
    cy.getAddressRoute('1105AT 50');

    // Open Homepage
    cy.visitFetch('incident/beschrijf');
  });

  it('Should search for an address', () => {
    // Check on h1
    cy.checkHeaderText('Beschrijf uw melding');

    // Search on address
    createSignal.searchAddress('1105AT 50');
    cy.wait('@getAddress');

    // Select found item  
    createSignal.selectAddress('Schepenbergweg 50, 1105AT Amsterdam');
    cy.wait('@lookup')
      .wait('@location')
      .wait('@geoSearchLocation');
  });

  it('Should enter description and date', () => {
    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:wegdek.json').as('prediction');

    createSignal.inputDescription('Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?');

    // Select datetime
    cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click();

    // Click on next
    cy.clickButton('Volgende');
  });

  it('Should enter specific information', () => { 
    // Check URL
    cy.url().should('include', '/incident/vulaan');

    // Check h1
    cy.checkHeaderText('Dit hebben we nog van u nodig');
    cy.contains('Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?');

    // Select road type
    cy.contains('Hebt u verteld om wat voor soort wegdek het gaat?');
    cy.get(WEGDEK.inputSoortWegdek).type('Asfalt');

    // Click on next
    cy.contains('Volgende').click();
  });

  it('Should enter a phonenumber', () => {
    // Check URL
    cy.url().should('include', '/incident/telefoon');

    // Check h1
    cy.checkHeaderText('Mogen we u bellen voor vragen?');

    // Click on next
    cy.clickButton('Volgende');
  });

  it('Should enter an email adress', () => {
    // Check URL
    cy.url().should('include', '/incident/email');

    // Check h1
    cy.checkHeaderText('Wilt u op de hoogte blijven?');

    // Click on next
    cy.clickButton('Volgende');
  });

  it('Should show an overview', () => {
    // Check URL
    cy.url().should('include', '/incident/samenvatting');

    // Check h1
    cy.checkHeaderText('Controleer uw gegevens');

    // Check if map is visible
    cy.get(CREATE_SIGNAL.mapContainer).should('be.visible');

    // Check road type
    cy.contains('Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?');
    cy.contains('Asfalt');

    cy.clickButton('Verstuur');
  });

  it('Should show the last screen', () => {
    // Check URL
    cy.url().should('include', '/incident/bedankt');

    // Check h1
    cy.checkHeaderText('Bedankt!');

    // TODO capture signal id
  });
});
