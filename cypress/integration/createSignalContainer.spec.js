// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, CONTAINERS } from '../support/selectorsCreateSignal';

describe('Create signal cointainer',() => {
  before(() => {
    cy.server();
    cy.defineGeoSearchRoutes();
    cy.getAddressRoute();
  
    // Open Homepage
    cy.visitFetch('incident/beschrijf');
  });

  it('Should search for an address', () => {
    // Check h1
    cy.checkHeaderText('Beschrijf uw melding');

    // Search address
    createSignal.searchAddress('1012AB 15');
    cy.wait('@getAddress');

    // Select found item  
    createSignal.selectAddress('Stationsplein 15, 1012AB Amsterdam');
    cy.wait('@geoSearchLocation');
  });

  it('Should enter description and date', () => {
    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:container.json').as('prediction');
  
    createSignal.inputDescription('De container voor de deur is kapot, de klep gaat niet open.');

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
    cy.contains('De container voor de deur is kapot, de klep gaat niet open.');

    // Select container soort and number
    cy.get(CONTAINERS.inputContainerSoort).eq(0).type('Een restafval container');
    cy.get(CONTAINERS.inputContainerNummer).eq(1).type('Nummertje 666');

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

  it('Should enter an email address', () => {
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

    // Check if map and marker are visible
    cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
    cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

    // Check information provided by user
    cy.contains('Stationsplein 15, 1012AB Amsterdam').should('be.visible');
    cy.contains('De container voor de deur is kapot, de klep gaat niet open.').should('be.visible');
    cy.contains('Een restafval container').should('be.visible');
    cy.contains('Nummertje 666').should('be.visible');
  });

  it('Should show the last screen', () => {
    cy.server();
    cy.postSignalRoutePublic();

    cy.clickButton('Verstuur');

    cy.wait('@postSignalPublic');
    
    // Check URL
    cy.url().should('include', '/incident/bedankt');

    // Check h1
    cy.checkHeaderText('Bedankt!');
   
    // TODO capture signal id
  });
});
