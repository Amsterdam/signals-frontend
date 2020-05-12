// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
describe('Create signal parkeeroverlast and check signal details',() => {
  describe('Create signal parkeeroverlast',() => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:parkeeroverlast.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1098VZ 3','Anfieldroad 3, 1098VZ Amsterdam');
      createSignal.setDescription('Voor onze deur staat al minimaal 5 maanden een auto geparkeerd, deze wordt nooit verplaatst.');
      createSignal.setDateTime('Nu');

      cy.clickButton('Volgende');
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains('Zijn er nog meer dingen die u ons kunt vertellen over de kenmerken van de auto, bus of motor?').should('be.visible');;
      cy.contains('Voor onze deur staat al minimaal 5 maanden een auto geparkeerd, deze wordt nooit verplaatst.').should('be.visible');;
      cy.contains('Bijvoorbeeld: kenteken, merk en kleur').should('be.visible');

      // Check if inputfield is optional
      cy.contains('Volgende').click();
      cy.url().should('include', '/incident/telefoon');
      cy.contains('Vorige').click();
      cy.url().should('include', '/incident/vulaan');
      
      // Input specific information
      cy.get('input').type('Het gaat om een Bugatti La Voiture Noire met kenteken LL-44-ST');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      createSignal.setPhonenumber('0611');
      createSignal.setEmailAddress('siafakemail@fake.nl');
    });

    it('Should show a summary', () => {
      cy.server();
      cy.postSignalRoutePublic();

      createSignal.checkSummaryPage();

      // Check information provided by user
      cy.contains('Anfieldroad 35, 1098VZ Amsterdam').should('be.visible');
      cy.contains('Voor onze deur staat al minimaal 5 maanden een auto geparkeerd, deze wordt nooit verplaatst.').should('be.visible');
      cy.contains('Het gaat om een Bugatti La Voiture Noire met kenteken LL-44-ST').should('be.visible');
      cy.contains('0611').should('be.visible');
      cy.contains('siafakemail@fake.nl').should('be.visible');

      cy.clickButton('Verstuur');
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
      localStorage.setItem('accessToken', (Cypress.env('token')));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });
  
    it('Should show the signal details', () => {
      cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
    
      cy.contains('Voor onze deur staat al minimaal 5 maanden een auto geparkeerd, deze wordt nooit verplaatst.');
    
      // Check if map and marker are visible
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

      // Check signal data
      cy.get(SIGNAL_DETAILS.stadsdeel).contains('Stadsdeel: ').and('contain', 'Oost').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).contains('Anfieldroad').and('contain', '35').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).contains('1098VZ').and('contain', 'Amsterdam').should('be.visible');
      cy.get(SIGNAL_DETAILS.email).contains('siafakemail@fake.nl').should('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).contains('0611').should('be.visible');

      // Check if status is 'gemeld' with red coloured text
      cy.get(SIGNAL_DETAILS.status).contains('Gemeld').should('be.visible').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });
      
      createSignal.checkCreationDate();

      cy.contains('Normaal').should('be.visible');
      cy.contains('Parkeeroverlast').should('be.visible');
      cy.get(SIGNAL_DETAILS.urgency).contains('Normaal').should('be.visible');
      cy.get(SIGNAL_DETAILS.type).contains('Melding').should('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).contains('Overlast in de openbare ruimte').should('be.visible');
      cy.get(SIGNAL_DETAILS.department).contains('ASC, THO').should('be.visible');
      cy.get(SIGNAL_DETAILS.source).contains('online').should('be.visible');
    });
  });
});
