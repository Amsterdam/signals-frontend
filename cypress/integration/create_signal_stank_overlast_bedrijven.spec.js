// <reference types="Cypress" />

import * as createSignal from '../support/commands-create-signal';
import { BEDRIJVEN_HORECA, CREATE_SIGNAL, STANK_OVERLAST } from '../support/selectors-create-signal';

describe('Create signal stank overlast bedrijven', () => {

  before(() => {

    cy.server();
    cy.defineGeoSearchRoutes();
    cy.getAdressRoute('1075LB 39');

    // Open Homepage
    cy.visitFetch('incident/beschrijf');

  });

  it('Search for adress', () => {

    // Check h1
    cy.checkHeader('Beschrijf uw melding');

    // Search adress
    createSignal.searchAdress('1075LB 39');
    cy.wait('@getAdress');

    // Select found item  
    createSignal.selectAdress('Karperweg 39, 1075LB Amsterdam');
    cy.wait('@lookup')
      .wait('@location')
      .wait('@geoSearchLocation');

  });

  it('Fill in description and date', () => {

    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:stankoverlastBedrijf.json').as('prediction');

    createSignal.inputDescription('De sportschool naast ons zorgt voor een enorme stankoverlast.');

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
    cy.contains('De sportschool naast ons zorgt voor een enorme stankoverlast.');

    // Provide information about smell
    cy.get(BEDRIJVEN_HORECA.radioButtonAnderBedrijf).click();
    cy.get(BEDRIJVEN_HORECA.inputWieWat).type('Klanten van de sportsschool');
    cy.get(BEDRIJVEN_HORECA.inputAdres).type('Op de Klapperweg nummer 39');
    cy.get(STANK_OVERLAST.inputGeur).type('Een zeer indringende zweetgeur');
    cy.get(STANK_OVERLAST.inputOorzaakGeur).type('Klanten van de sportschool die voor de deur staan te sporten, maar ook binnen voor een open raam');
    cy.get(STANK_OVERLAST.inputWeersomstandigheden).type('Het is erg warm buiten, de zon schijnt volop');
    cy.get(STANK_OVERLAST.radioButtonRaamOpen).click();
    cy.get(BEDRIJVEN_HORECA.radioButtonVakerNee).click();

    // Check specific texts
    cy.contains('Uw gegevens worden vertrouwelijk behandeld en worden niet aan de (horeca)ondernemer of organisator bekend gemaakt.').should('be.visible');
    cy.contains('Anonieme meldingen krijgen een lage prioriteit.').should('be.visible');

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

