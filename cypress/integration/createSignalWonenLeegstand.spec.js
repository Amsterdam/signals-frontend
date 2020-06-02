// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_LEEGSTAND } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Create signal wonen leegstand and check signal details',() => {
  describe('Create signal wonen leegstand',() => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wonenLeegstand.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1101DS 600','Arena boulevard 600, 1101DS Amsterdam');
      createSignal.setDescription('Woning heeft leeg gestaan. Soms is iemand in de avond aanwezig. Het is verschrikkelijk.');
      createSignal.setDateTime('Nu');

      cy.clickButton('Volgende');
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains('Woning heeft leeg gestaan. Soms is iemand in de avond aanwezig. Het is verschrikkelijk.').should('be.visible');
      
      // Check if fields are mandatory
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.errorList).should('contain', 'Dit is een verplicht veld').and('have.length', 3);
      
      // Input specific information part 1
      cy.contains('Weet u wie de eigenaar is van de woning?').should('be.visible');
      cy.get(WONEN_LEEGSTAND.inputEigenaar).eq(0).type('A. Hitchcock');

      cy.contains('Hoe lang staat de woning al leeg?').should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegZesMaandenOfLanger).check().should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegMinderDanZesMaanden).check().should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegPeriodeWeetIkNiet).check().should('be.checked');

      cy.contains('Wordt de woning af en toe nog gebruikt?').should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktWeetIkNiet).check().should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktNee).check().should('be.checked');
      cy.contains('Wat is de naam van de persoon die soms in de woning is?').should('not.be.visible');
      cy.contains('Wat doet deze persoon in de woning?').should('not.be.visible');
      cy.contains('Op welke dag/tijd is deze persoon op het adres?').should('not.be.visible');

      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktJa).check().should('be.checked');

      cy.contains('Wat is de naam van de persoon die soms in de woning is?').should('be.visible');
      cy.contains('Wat doet deze persoon in de woning?').should('be.visible');
      cy.contains('Op welke dag/tijd is deze persoon op het adres?').should('be.visible');

      // Check if inputfields are optional
      cy.contains('Volgende').click();
      cy.url().should('include', '/incident/telefoon');
      cy.contains('Vorige').click();
      cy.url().should('include', '/incident/vulaan');

      cy.get(WONEN_LEEGSTAND.inputNaam).eq(1).type('J. Aniston');
      cy.get(WONEN_LEEGSTAND.inputWatDoetPersoon).eq(2).type('Deze persoon zit de hele dag te acteren');
      cy.get(WONEN_LEEGSTAND.inputTijdstip).eq(3).type('Vooral in de avond');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      createSignal.setPhonenumber('');
      cy.contains('Volgende').click();
      createSignal.setEmailAddress('');
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.server();
      cy.postSignalRoutePublic();

      createSignal.checkSummaryPage();

      // Check information provided by user
      cy.contains('Arena boulevard 600, 1101DS Amsterdam').should('be.visible');
      cy.contains('Woning heeft leeg gestaan. Soms is iemand in de avond aanwezig. Het is verschrikkelijk.').should('be.visible');

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains('Naam eigenaar').should('be.visible');
      cy.contains('A. Hitchcock').should('be.visible');
      cy.contains('Periode leegstand').should('be.visible');
      cy.contains('Weet ik niet').should('be.visible');
      cy.contains('Woning gebruik').should('be.visible');
      cy.contains('Ja, soms is er iemand in de woning').should('be.visible');
      cy.contains('Naam persoon').should('be.visible');
      cy.contains('J. Aniston').should('be.visible');
      cy.contains('Activiteit in de woning').should('be.visible');
      cy.contains('Deze persoon zit de hele dag te acteren').should('be.visible');
      cy.contains('Iemand aanwezig').should('be.visible');
      cy.contains('Vooral in de avond').should('be.visible');

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
      cy.getSignalDetailsRoutes();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });
  
    it('Should show the signal details', () => {
      cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
    
      cy.contains('Woning heeft leeg gestaan. Soms is iemand in de avond aanwezig. Het is verschrikkelijk.');
    
      // Check if map and marker are visible
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

      // Check signal data
      cy.get(SIGNAL_DETAILS.stadsdeel).contains('Stadsdeel: ').and('contain', 'Zuidoost').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).contains('Arena boulevard').and('contain', '600').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).contains('1101DS').and('contain', 'Amsterdam').should('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('be.visible');

      // Check if status is 'gemeld' with red coloured text
      cy.get(SIGNAL_DETAILS.status).contains('Gemeld').should('be.visible').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });
      
      createSignal.checkCreationDate();

      cy.get(SIGNAL_DETAILS.urgency).contains('Normaal').should('be.visible');
      cy.get(SIGNAL_DETAILS.type).contains('Melding').should('be.visible');
      cy.contains('Leegstand').should('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).contains('Wonen').should('be.visible');
      cy.get(SIGNAL_DETAILS.source).contains('online').should('be.visible');
    });
  });
});
