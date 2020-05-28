// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_WONINGKWALITEIT } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Create signal wonen woningkwaliteit and check signal details',() => {
  describe('Create signal wonen woningkwaliteit',() => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wonenWoningkwaliteit.json').as('prediction');
      createSignal.checkDescriptionPage();
      createSignal.setAddress('1059BP 48','Jaagpad 48, 1059BP Amsterdam');
      createSignal.setDescription('De hele woning staat blank, dit komt door lekkage in het dak.');
      createSignal.setDateTime('Nu');

      cy.clickButton('Volgende');
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains('De hele woning staat blank, dit komt door lekkage in het dak.').should('be.visible');
      
      // Check if field is mandatory
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.errorList).should('contain', 'Dit is een verplicht veld');
      
      // Input specific information
      cy.contains('Denkt u dat er direct gevaar is?').should('be.visible');
      cy.contains('Bijvoorbeeld: u ruikt een sterke gaslucht of er dreigt een schoorsteen of balkon in te storten').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonGevaarJa).check().should('be.checked');
      cy.contains('Bel 112 en vul dit formulier niet verder in').should('be.visible').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });
      cy.get(WONEN_WONINGKWALITEIT.radioButtonGevaarNee).check().should('be.checked');

      cy.contains('Hebt u de klacht al bij uw verhuurder, eigenaar of VvE gemeld?').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonKlachtGemeldNee).check().should('be.checked');
      cy.contains('Meld uw klacht eerst bij de verhuurder, eigenaar of VvE. Krijgt u geen antwoord of wordt de klacht niet verholpen, vul dan dit formulier in').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonKlachtGemeldJa).check().should('be.checked');
      cy.contains('Meldt uw klacht eerst bij de verhuurder, eigenaar of VvE. Krijgt u geen antwoord of wordt de klacht niet verholpen, vul dan dit formulier in').should('not.be.visible');

      cy.contains('Bent u zelf bewoner van het adres?').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonBewonerJa).check().should('be.checked');
      cy.contains('Doet u de melding namens de bewoner van het adres?').should('not.be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonBewonerNee).check().should('be.checked');

      cy.contains('Doet u de melding namens de bewoner van het adres?').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonNamensBewonerJa).check().should('be.checked');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonNamensBewonerNee).check().should('be.checked');
      
      cy.contains('Mogen we contact met u opnemen om een afspraak te maken?').should('be.visible');
      cy.contains('Om uw klacht goed te kunnen behandelen willen we vaak even komen kijken of met u overleggen').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonContactJa).check().should('be.checked');
      cy.contains('Let op! Vul uw telefoonnummer in op de volgende pagina.').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonContactNee).check().should('be.checked');
      cy.contains('Let op! Vul uw telefoonnummer in op de volgende pagina.').should('not.be.visible');
      cy.contains('Waarom heeft u liever geen contact?').should('be.visible');

      cy.get(WONEN_WONINGKWALITEIT.inputGeenContact).type('Vertel ik liever niet');

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
      cy.contains('Jaagpad 48, 1059BP Amsterdam').should('be.visible');
      cy.contains('De hele woning staat blank, dit komt door lekkage in het dak.').should('be.visible');

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains('Direct gevaar').should('be.visible');
      cy.contains('Gemeld bij eigenaar').should('be.visible');
      cy.contains('Bewoner').should('be.visible');
      cy.contains('Nee, ik woon niet op dit adres').should('be.visible');
      cy.contains('Namens bewoner').should('be.visible');
      cy.contains('Toestemming contact opnemen').should('be.visible');
      cy.contains('Nee, liever geen contact').should('be.visible');
      cy.contains('Liever geen contact').should('be.visible');
      cy.contains('Vertel ik liever niet').should('be.visible');

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
      cy.contains('De hele woning staat blank, dit komt door lekkage in het dak.');
    
      // Check if map and marker are visible
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

      // Check signal data
      cy.get(SIGNAL_DETAILS.stadsdeel).contains('Stadsdeel: ').and('contain', 'Zuid').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).contains('Jaagpad').and('contain', '48').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).contains('1059BP').and('contain', 'Amsterdam').should('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('be.visible');

      // Check if status is 'gemeld' with red coloured text
      cy.get(SIGNAL_DETAILS.status).contains('Gemeld').should('be.visible').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });
      
      createSignal.checkCreationDate();

      cy.get(SIGNAL_DETAILS.urgency).contains('Normaal').should('be.visible');
      cy.get(SIGNAL_DETAILS.type).contains('Melding').should('be.visible');
      cy.contains('Woningkwaliteit').should('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).contains('Wonen').should('be.visible');
      cy.get(SIGNAL_DETAILS.source).contains('online').should('be.visible');
    });
  });
});
