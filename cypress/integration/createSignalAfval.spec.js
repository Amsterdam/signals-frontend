// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Create signal afval', () => {
  before(() => {
    cy.server();
    cy.defineGeoSearchRoutes();
    cy.getAddressRoute();

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
    cy.wait('@geoSearchLocation');
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

    // Check if map and marker are visible
    cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
    cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

    cy.contains('Sandwijk 43, 1035LA Amsterdam');
    cy.contains('Voor mijn deur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?');
    // Check mail and phonenumber
    cy.contains('06-12345678').should('be.visible');
    cy.contains('siafakemail@fake.nl').should('be.visible');
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
    
    // Capture signal id
    cy.get('.bedankt').first().then($signalLabel => {
      // Get the signal id
      const signalNumber = $signalLabel.text().match(/\d+/)[0];
      cy.log(signalNumber);
      // Set the signal id in variable for later use
      Cypress.env('signalId', signalNumber);
    });
  });
});

describe('Check data created signal', () => {
  before(() => {
    localStorage.setItem('accessToken', 'TEST123');
    cy.server();
    cy.getManageSignalsRoutes();
    cy.visitFetch('/manage/incidents/');
    cy.wait('@getFilters');
    cy.wait('@getCategories');
    cy.wait('@getSignals');
    cy.wait('@getUserInfo');
    cy.log(Cypress.env('signalId'));
  });
  
  it('Should show the signal details', () => {
    cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
    
    cy.contains('Voor mijn deur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?');
    
    // Check if map and marker are visible
    cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
    cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

    cy.get(SIGNAL_DETAILS.stadsdeel).contains('Stadsdeel: ').and('contain', 'Noord').should('be.visible');
    cy.get(SIGNAL_DETAILS.addressStreet).contains('Sandwijk').and('contain', '43').should('be.visible');
    cy.get(SIGNAL_DETAILS.addressCity).contains('1035LA').and('contain', 'Amsterdam').should('be.visible');
    cy.get(SIGNAL_DETAILS.email).contains('siafakemail@fake.nl').should('be.visible');
    cy.get(SIGNAL_DETAILS.phoneNumber).contains('06-12345678').should('be.visible');

    // Check if status is 'gemeld' with red coloured text
    cy.get(SIGNAL_DETAILS.status).contains('Gemeld').should('be.visible').and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });

    // TODO should have a data-testid
    // check urgency
    cy.contains('Normaal').should('be.visible');
    cy.contains('Veeg- / zwerfvuil').should('be.visible');

    cy.get(SIGNAL_DETAILS.mainCategory).contains('Schoon').should('be.visible');
    cy.get(SIGNAL_DETAILS.department).contains('STW').should('be.visible');
    cy.get(SIGNAL_DETAILS.source).contains('online').should('be.visible');
  });
});
