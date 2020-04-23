// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { BEDRIJVEN_HORECA, CREATE_SIGNAL } from '../support/selectorsCreateSignal';

describe('Create signal bedrijven en horeca', () =>{
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
    createSignal.searchAddress('1012AN 5A');
    cy.wait('@getAddress');

    // Select found item  
    createSignal.selectAddress('Zeedijk 5A, 1012AN Amsterdam'); 
    cy.wait('@geoSearchLocation');
  });

  it('Should enter description and date', () => {
    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:bedrijvenHoreca.json').as('prediction');
    
    createSignal.inputDescription('Ik heb ontzettende overlast van cafe het 11e gebod, dronken mensen staan buiten te schreeuwen');

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
    cy.contains('Ik heb ontzettende overlast van cafe het 11e gebod, dronken mensen staan buiten te schreeuwen');

    cy.get(BEDRIJVEN_HORECA.radioButtonHoreca).click();
      
    cy.get(BEDRIJVEN_HORECA.inputWieWat).eq(0).type('Klanten van het cafe');
    cy.get(BEDRIJVEN_HORECA.inputAdres).eq(1).type('Op Zeedijk nummer 3');
   
    cy.get(BEDRIJVEN_HORECA.checkBoxDronken).check();
    cy.get(BEDRIJVEN_HORECA.checkBoxSchreeuwen).check();
    cy.get(BEDRIJVEN_HORECA.checkBoxWildplassen).check();

    cy.get(BEDRIJVEN_HORECA.radioButtonVakerJa).click();

    cy.get(BEDRIJVEN_HORECA.inputDatum).eq(2).type('Elke dag');

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
    cy.contains('Zeedijk 5A, 1012AN Amsterdam').should('be.visible');
    cy.contains('Ik heb ontzettende overlast van cafe het 11e gebod, dronken mensen staan buiten te schreeuwen').should('be.visible');
    cy.contains('Horecabedrijf, zoals een café, restaurant, snackbar of kantine').should('be.visible');
    cy.contains('Klanten van het cafe').should('be.visible');
    cy.contains('Op Zeedijk nummer 3').should('be.visible');
    cy.contains('Dronken bezoekers').should('be.visible');
    cy.contains('Schreeuwende bezoekers').should('be.visible');
    cy.contains('Wildplassen').should('be.visible');
    cy.contains('Ja, het gebeurt vaker').should('be.visible');
    cy.contains('Elke dag').should('be.visible');
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

