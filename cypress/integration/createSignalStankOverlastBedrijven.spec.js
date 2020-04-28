// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { BEDRIJVEN_HORECA, CREATE_SIGNAL, STANK_OVERLAST } from '../support/selectorsCreateSignal';

describe('Create signal stank overlast bedrijven', () => {
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
    createSignal.searchAddress('1075LB 39');
    cy.wait('@getAddress');

    // Select found item  
    createSignal.selectAddress('Karperweg 39, 1075LB Amsterdam');
    cy.wait('@geoSearchLocation');
  });

  it('Should enter description and date', () => {
    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:stankoverlastBedrijf.json').as('prediction');

    createSignal.inputDescription('De sportschool naast ons zorgt voor een enorme stankoverlast.');

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
    cy.contains('De sportschool naast ons zorgt voor een enorme stankoverlast.');

    // Provide information about smell
    cy.get(BEDRIJVEN_HORECA.radioButtonAnderBedrijf).click();
    cy.get(BEDRIJVEN_HORECA.inputWieWat).eq(0).type('Klanten van de sportsschool');
    cy.get(BEDRIJVEN_HORECA.inputAdres).eq(1).type('Op de Klapperweg nummer 39');
    cy.get(STANK_OVERLAST.inputGeur).eq(2).type('Een zeer indringende zweetgeur');
    cy.get(STANK_OVERLAST.inputOorzaakGeur).eq(3).type('Klanten van de sportschool die voor de deur staan te sporten, maar ook binnen voor een open raam');
    cy.get(STANK_OVERLAST.inputWeersomstandigheden).eq(4).type('Het is erg warm buiten, de zon schijnt volop');
    cy.get(STANK_OVERLAST.radioButtonRaamOpen).click();
    cy.get(BEDRIJVEN_HORECA.radioButtonVakerNee).click();

    // Check specific texts
    cy.contains('Uw gegevens worden vertrouwelijk behandeld en worden niet aan de (horeca)ondernemer of organisator bekend gemaakt.').should('be.visible');
    cy.contains('Anonieme meldingen krijgen een lage prioriteit.').should('be.visible');

    cy.clickButton('Volgende');
  });

  it('Should enter a phonenumber', () => {
    // Check URL
    cy.url().should('include', '/incident/telefoon');

    // Check h1
    cy.checkHeaderText('Mogen we u bellen voor vragen?');

    cy.clickButton('Volgende');
  });

  it('Should enter an email adress', () => {
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

    // Check if map is visible
    cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
    cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

    // Check information provided by user
    cy.contains('Karperweg 39, 1075LB Amsterdam').should('be.visible');
    cy.contains('De sportschool naast ons zorgt voor een enorme stankoverlast.').should('be.visible');
    cy.contains('Ander soort bedrijf, zoals een winkel, supermarkt of sportschool').should('be.visible');
    cy.contains('Klanten van de sportsschool').should('be.visible');
    cy.contains('Op de Klapperweg nummer 39').should('be.visible');
    cy.contains('Een zeer indringende zweetgeur').should('be.visible');
    cy.contains('Klanten van de sportschool die voor de deur staan te sporten, maar ook binnen voor een open raam').should('be.visible');
    cy.contains('Het is erg warm buiten, de zon schijnt volop').should('be.visible');
    cy.contains('Ja, ramen of deuren staan open').should('be.visible');
    cy.contains('Nee, dit is de eerste keer').should('be.visible');
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

