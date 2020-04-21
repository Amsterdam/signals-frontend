// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, BOTEN } from '../support/selectorsCreateSignal';

describe('Create signal boten',() => {
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
    createSignal.searchAddress('1096AC 7');
    cy.wait('@getAddress');

    // Select found item  
    createSignal.selectAddress('Korte Ouderkerkerdijk 7, 1096AC Amsterdam');
    cy.wait('@geoSearchLocation');
  });

  it('Should enter description and date', () => {
    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:water.json').as('prediction');
  
    createSignal.inputDescription('Een grote boot vaart al de hele dag hard door het water.');

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
    cy.contains('Een grote boot vaart al de hele dag hard door het water.');

    // Select rondvaartboot company and name
    cy.get(BOTEN.radioButtonRondvaartbootJa).click();
    cy.get('select').select('Amsterdam Boat Center');
    cy.get(BOTEN.inputNaamBoot).type('Bota Fogo');
    cy.get(BOTEN.inputNogMeer).type('De boot voer richting Ouderkerk aan de Amstel');

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

    // Check if map and marker are visible
    cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
    cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

    // Check information provided by user
    cy.contains('Korte Ouderkerkerdijk 7, 1096AC Amsterdam').should('be.visible');
    cy.contains('Een grote boot vaart al de hele dag hard door het water.').should('be.visible');
    cy.contains('Amsterdam Boat Center').should('be.visible');
    cy.contains('Bota Fogo').should('be.visible');
    cy.contains('De boot voer richting Ouderkerk aan de Amstel').should('be.visible');
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
