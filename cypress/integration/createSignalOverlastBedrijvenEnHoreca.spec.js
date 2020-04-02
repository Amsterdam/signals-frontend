// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { BEDRIJVEN_HORECA, CREATE_SIGNAL } from '../support/selectorsCreateSignal';

describe('Create signal bedrijven en horeca', () =>{
  before(() => {
    cy.server();
    cy.defineGeoSearchRoutes();
    cy.getAdressRoute('1012AN 5A');
  
    // Open Homepage
    cy.visitFetch('incident/beschrijf');
  });

  it('Search for adress', () => {
    // Check h1
    cy.checkHeader('Beschrijf uw melding');

    // Search adress
    createSignal.searchAdress('1012AN 5A');
    cy.wait('@getAdress');

    // Select found item  
    createSignal.selectAdress('Zeedijk 5A, 1012AN Amsterdam'); 
    cy.wait('@lookup')
      .wait('@location')
      .wait('@geoSearchLocation');
  });

  it('Fill in description and date', () => {
    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:bedrijvenHoreca.json').as('prediction');
    
    createSignal.inputDescription('Ik heb ontzettende overlast van cafe het 11e gebod, dronken mensen staan buiten te schreeuwen');

    // Select datetime
    cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click();

    // Click on next
    cy.clickButton('Volgende');
  });

  it('Fill in specific information', () => {
    // Check URL
    cy.url().should('include', '/incident/vulaan');

    // Check h1
    cy.checkHeader('Dit hebben we nog van u nodig');
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

    // Create signal
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

