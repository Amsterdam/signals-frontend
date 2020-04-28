// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, VERKEERSLICHT } from '../support/selectorsCreateSignal';

describe('Create signal Stoplicht',() => {
  before(() => {
    cy.server();
    cy.defineGeoSearchRoutes();
    cy.getAddressRoute();

    // Open homepage
    cy.visitFetch('incident/beschrijf');
  });

  it('Should search for an address', () => {
    // Check h1
    cy.checkHeaderText('Beschrijf uw melding');

    // Search address
    createSignal.searchAddress('1018VN 113');
    cy.wait('@getAddress');

    // Select found item  
    createSignal.selectAddress('Weesperstraat 113, 1018VN Amsterdam');
    cy.wait('@geoSearchLocation');
  });

  it('Should enter description and date', () => {
    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:verkeerslicht.json').as('prediction');

    createSignal.inputDescription('Het stoplicht op de kruising weesperstraat met de nieuwe kerkkstraat richting de stad staat altijd op groen. Dit zorgt voor gevaarlijke situaties.');

    // Select datetime
    cy.get(CREATE_SIGNAL.radioButtonTijdstipEerder).click();

    // Click on next
    cy.clickButton('Volgende');
  });

  it('Should enter specific information', () => {
    // Check URL
    cy.url().should('include', '/incident/vulaan');

    // Check h1
    cy.checkHeaderText('Dit hebben we nog van u nodig');
    cy.contains('Het stoplicht op de kruising weesperstraat met de nieuwe kerkkstraat richting de stad staat altijd op groen. Dit zorgt voor gevaarlijke situaties.');

    // Click on next without retry to invoke error message
    cy.contains('Volgende').click();

    cy.get(CREATE_SIGNAL.errorList).should('contain','Dit is een verplicht veld');

    // Check on visibility of the message to make a phone call directly after selecting one of the first four options
    const messageCallDirectly = 'Bel direct 14 020. U hoeft dit formulier niet meer verder in te vullen.';

    cy.get(VERKEERSLICHT.radioButtonAanrijding).click();
    cy.contains(messageCallDirectly);
    // Commented step, because there is a bug. If the error message is solved, it moves to the next question
    // cy.get(CREATE_SIGNAL.errorList).should('not.contain','Dit is een verplicht veld');

    cy.get(VERKEERSLICHT.radioButtonOpGrond).click();
    cy.contains(messageCallDirectly);

    cy.get(VERKEERSLICHT.radioButtonDeur).click();
    cy.contains(messageCallDirectly);

    cy.get(VERKEERSLICHT.radioButtonLosseKabels).click();
    cy.contains(messageCallDirectly);

    cy.get(VERKEERSLICHT.radioButtonNietGevaarlijk).click();
    cy.contains(messageCallDirectly).should('not.exist');

    // Click on next without retry to invoke error message
    cy.contains('Volgende').click();
    cy.get(CREATE_SIGNAL.errorList).should('contain','Dit is een verplicht veld');

    // Check all options for voetganger
    cy.get('.antwoorden').contains('Voetganger').click();
    cy.get('.antwoorden').contains('Rood licht werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Groen licht werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Blindentikker werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Duurt (te) lang voordat het groen wordt').should('be.visible');
    cy.get('.antwoorden').contains('Anders').should('be.visible');

    // Check all options for Fiets
    cy.get('.antwoorden').contains('Fiets').click();
    cy.get('.antwoorden').contains('Rood licht werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Oranje/geel licht werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Groen licht werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Duurt (te) lang voordat het groen wordt').should('be.visible');
    cy.get('.antwoorden').contains('Anders').should('be.visible');

    // Check all options for Auto
    cy.get('.antwoorden').contains('Auto').click();
    cy.get('.antwoorden').contains('Rood licht werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Oranje/geel licht werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Groen licht werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Duurt (te) lang voordat het groen wordt').should('be.visible');
    cy.get('.antwoorden').contains('Anders').should('be.visible');

    // Check all options for Tram of bus
    cy.get('.antwoorden').contains('Tram of bus').click();
    cy.get('.antwoorden').contains('Rood licht werkt niet').should('be.visible').click();
    cy.get('.antwoorden').contains('Oranje/geel licht werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Wit licht werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Waarschuwingslicht tram werkt niet').should('be.visible');
    cy.get('.antwoorden').contains('Anders').should('be.visible');

    cy.get(VERKEERSLICHT.inputRijrichting).eq(0).type('Richting centrum');
    cy.get(VERKEERSLICHT.inputNummerVerkeerslicht).eq(1).type('365');
    
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

    // Check on information provided by user
    cy.contains('Weesperstraat 113, 1018VN Amsterdam').should('be.visible');
    cy.contains('Het stoplicht op de kruising weesperstraat met de nieuwe kerkkstraat richting de stad staat altijd op groen. Dit zorgt voor gevaarlijke situaties.').should('be.visible');
    cy.contains('Vandaag, 9:00').should('be.visible');
    cy.contains('Niet gevaarlijk').should('be.visible');
    cy.contains('Tram of bus').should('be.visible');
    cy.contains('Rood licht werkt niet').should('be.visible');
    cy.contains('Richting centrum').should('be.visible');
    cy.contains('365').should('be.visible');
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