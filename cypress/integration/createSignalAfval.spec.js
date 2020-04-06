// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL } from '../support/selectorsCreateSignal';

describe('Create signal afval', () => {
  before(() => {
    cy.server();
    cy.defineGeoSearchRoutes();
    cy.getAddressRoute('1035LA 43');

    // Open Homepage
    cy.visitFetch('incident/beschrijf');
  });

  it('Should search for an address', () => {
    // Check on h1
    cy.checkHeaderText('Beschrijf uw melding');

    // Search on address
    createSignal.searchAddress('1035LA 43');
    cy.wait('@getAddress');

    // Select found item  
    createSignal.selectAddress('Sandwijk 43, 1035LA Amsterdam');
    cy.wait('@lookup')
      .wait('@location')
      .wait('@geoSearchLocation');
  });

  it('Should enter a description', () => {
    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:afval.json').as('prediction');

    createSignal.inputDescription('Voor mijn deur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?');

    // Select datetime
    cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click();

    // Click on next
    cy.clickButton('Volgende');
  });

  it('Should enter a phonenumber', () => {
    // Check URL
    cy.url().should('include', '/incident/telefoon');

    // Check h1
    cy.checkHeaderText('Mogen we u bellen voor vragen?');

    // Fill phonenumber
    cy.get(CREATE_SIGNAL.inputPhoneNumber).type('06-12345678');
    
    // Click on next
    cy.clickButton('Volgende');
  });

  it('Should enter an email address', () => {
    // Check URL
    cy.url().should('include', '/incident/email');

    // Check h1
    cy.checkHeaderText('Wilt u op de hoogte blijven?');

    // Fill emailaddress
    cy.get(CREATE_SIGNAL.inputEmail).type('siafakemail@fake.nl');

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

    cy.contains('Voor mijn deur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?');
    // Check mail and phonenumber
    cy.contains('06-12345678').should('be.visible');
    cy.contains('siafakemail@fake.nl').should('be.visible');

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
