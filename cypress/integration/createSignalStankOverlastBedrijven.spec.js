// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { BEDRIJVEN_HORECA, STANK_OVERLAST } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Create signal stank overlast bedrijven and check signal details', () => {
  describe('Create signal stank overlast bedrijven', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should search for an address', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:stankoverlastBedrijf.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1075LB 39', 'Karperweg 39, 1075LB Amsterdam');
      createSignal.setDescription('De sportschool naast ons zorgt voor een enorme stankoverlast.');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Provide information about smell
      cy.get(BEDRIJVEN_HORECA.radioButtonAnderBedrijf).click();
      cy.get(BEDRIJVEN_HORECA.inputWieWat)
        .eq(0)
        .type('Klanten van de sportsschool');
      cy.get(BEDRIJVEN_HORECA.inputAdres)
        .eq(1)
        .type('Op de Klapperweg nummer 39');
      cy.get(STANK_OVERLAST.inputGeur)
        .eq(2)
        .type('Een zeer indringende zweetgeur');
      cy.get(STANK_OVERLAST.inputOorzaakGeur)
        .eq(3)
        .type('Klanten van de sportschool die voor de deur staan te sporten, maar ook binnen voor een open raam');
      cy.get(STANK_OVERLAST.inputWeersomstandigheden)
        .eq(4)
        .type('Het is erg warm buiten, de zon schijnt volop');
      cy.get(STANK_OVERLAST.radioButtonRaamOpen).click();
      cy.get(BEDRIJVEN_HORECA.radioButtonVakerNee).click();

      // Check specific texts
      cy.contains(
        'Uw gegevens worden vertrouwelijk behandeld en worden niet aan de (horeca)ondernemer of organisator bekend gemaakt.'
      ).should('be.visible');
      cy.contains('Anonieme meldingen krijgen een lage prioriteit.').should('be.visible');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      cy.contains('Volgende').click();
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.server();
      cy.postSignalRoutePublic();

      createSignal.checkSummaryPage();

      // Check information provided by user
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains('Ander soort bedrijf, zoals een winkel, supermarkt of sportschool').should('be.visible');
      cy.contains('Klanten van de sportsschool').should('be.visible');
      cy.contains('Op de Klapperweg nummer 39').should('be.visible');
      cy.contains('Een zeer indringende zweetgeur').should('be.visible');
      cy.contains(
        'Klanten van de sportschool die voor de deur staan te sporten, maar ook binnen voor een open raam'
      ).should('be.visible');
      cy.contains('Het is erg warm buiten, de zon schijnt volop').should('be.visible');
      cy.contains('Ja, ramen of deuren staan open').should('be.visible');
      cy.contains('Nee, dit is de eerste keer').should('be.visible');

      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
    });

    it('Should show the last screen', () => {
      createSignal.checkThanksPage();
      // Capture signal id to check details later
      createSignal.getSignalId();
    });
  });
  describe('Check data created signal', () => {
    before(() => {
      localStorage.setItem('accessToken', Cypress.env('token'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutes();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });

    it('Should show the signal details', () => {
      cy.get('[href*="/manage/incident/"]')
        .contains(Cypress.env('signalId'))
        .click();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.get(SIGNAL_DETAILS.stadsdeel)
        .should('have.text', 'Stadsdeel: Zuid')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet)
        .should('have.text', 'Karperweg 39')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity)
        .should('have.text', '1075LB Amsterdam')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.email)
        .should('have.text', '')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber)
        .should('have.text', '')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails)
        .should('have.text', 'Nee')
        .and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency)
        .should('have.text', 'Normaal')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.type)
        .should('have.text', 'Melding')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory)
        .should('have.text', 'Stankoverlast (ASC, VTH)')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory)
        .should('have.text', 'Overlast Bedrijven en Horeca')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.source)
        .should('have.text', 'online')
        .and('be.visible');
    });
  });
});
