// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, JONGEREN } from '../support/selectorsCreateSignal';

describe('Overlast door door groep jongeren',() => {
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
    createSignal.searchAddress('1018CN 28-H');
    cy.wait('@getAddress');

    // Select found item  
    createSignal.selectAddress('Plantage Doklaan 28-H, 1018CN Amsterdam');
    cy.wait('@geoSearchLocation');
  });

  it('Should enter description and date', () => {
    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:jongeren.json').as('prediction');

    createSignal.inputDescription('De laatste paar weken staat er in de avond een grote groep jongeren voor mijn deur te blowen. Dit zorgt voor veel overlast.');

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
    cy.contains('De laatste paar weken staat er in de avond een grote groep jongeren voor mijn deur te blowen. Dit zorgt voor veel overlast.').should('be.visible');

    // Check specific information
    cy.contains('Weet u de naam van de jongere(n)?').should('be.visible');
    cy.contains('Om hoe veel personen gaat het (ongeveer)?').should('be.visible');
    cy.contains('Gebeurt het vaker?').should('be.visible');
    
    // Check link Melding zorg en woonoverlast
    cy.contains('Melding zorg en woonoverlast').should('have.attr', 'href').and('include', 'meldpunt-zorg');

    // Check number of person
    cy.get(JONGEREN.radioButtonAantalPersonen).check();

    // Check if question is NOT visible
    cy.contains('Geef aan op welke momenten het gebeurt').should('be.not.be.visible');

    // Check if it happens more than once?
    cy.get(JONGEREN.checkBoxVaker).check();

    // Check if question is visible
    cy.contains('Geef aan op welke momenten het gebeurt').should('be.visible');

    // Fill in when it happens
    cy.get(JONGEREN.inputMoment).type('Bijna iedere dag');

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
    cy.contains('Plantage Doklaan 28-H, 1018CN Amsterdam').should('be.visible');
    cy.contains('De laatste paar weken staat er in de avond een grote groep jongeren voor mijn deur te blowen. Dit zorgt voor veel overlast.').should('be.visible');
    cy.contains('4 - 6').should('be.visible');
    cy.contains('Ja, het gebeurt vaker').should('be.visible');
    cy.contains('Bijna iedere dag').should('be.visible');
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
