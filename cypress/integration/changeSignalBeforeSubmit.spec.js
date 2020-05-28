// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, LANTAARNPAAL } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
describe('Change a signal before submit and check signal details', () => {
  describe('Change signal before submit', () => {
    before(() => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();

      cy.visitFetch('incident/beschrijf');
    });

    it('Should search for an address', () => {
      cy.checkHeaderText('Beschrijf uw melding'); 
      createSignal.searchAddress('1071XX 1');
      cy.wait('@getAddress');
      createSignal.selectAddress('Museumstraat 1, 1071XX Amsterdam');
      cy.wait('@geoSearchLocation');
    });

    it('Should enter a description', () => {
      cy.server();
      cy.route('POST', '**/signals/category/prediction', 'fixture:lantaarnpaal.json').as('prediction');

      createSignal.setDescription('De lantaarnpaal voor mijn deur doet het niet en er ligt troep op de stoep');
      cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click();
      cy.clickButton('Volgende');
    });

    it('Should enter specific information', () => {
      cy.server();
      cy.route('/maps/openbare_verlichting?REQUEST=GetFeature&SERVICE=wfs&OUTPUTFORMAT=application/*').as('getOpenbareVerlichting');

      cy.get(LANTAARNPAAL.radioButtonNietGevaarlijk).click();
      cy.get(LANTAARNPAAL.radioButtonAantalLichtenpunten).click();
      cy.contains('Lichtpunt is zichtbaar beschadigd en/of incompleet').should('be.visible').click();
      cy.wait('@getOpenbareVerlichting');
      createSignal.selectLampOnCoordinate(434, 183);
      cy.clickButton('Volgende');
    });

    it('Should enter a phonenumber', () => {
      cy.url().should('include', '/incident/telefoon');
      cy.checkHeaderText('Mogen we u bellen voor vragen?');
      cy.get(CREATE_SIGNAL.inputPhoneNumber).type('06-12345678');
      cy.clickButton('Volgende');
    });

    it('Should enter an email address', () => {
      cy.url().should('include', '/incident/email');
      cy.checkHeaderText('Wilt u op de hoogte blijven?');
      cy.get(CREATE_SIGNAL.inputEmail).type('siafakemail@fake.nl');
      cy.clickButton('Volgende');
    });

    it('Should show an overview', () => {
      cy.url().should('include', '/incident/samenvatting');
      cy.checkHeaderText('Controleer uw gegevens');

      // Check if map and markers are visible
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

      // Check if address and description are visible
      cy.contains('Museumstraat 1, 1071XX Amsterdam');
      cy.contains('De lantaarnpaal voor mijn deur doet het niet en er ligt troep op de stoep');

      // Check if specific information is visible
      cy.contains('Een aantal lichtpunten die bij elkaar staan/hangen').should('be.visible');
      cy.contains('Lichtpunt is zichtbaar beschadigd en/of incompleet').should('be.visible');
      cy.get(LANTAARNPAAL.mapSelectLamp).should('be.visible');
      cy.contains('155632.07').should('be.visible');
    
      // Check if mail and phonenumber are visible
      cy.contains('06-12345678').should('be.visible');
      cy.contains('siafakemail@fake.nl').should('be.visible');

      // Check if there is no uploaded picture, later there is
      cy.get(CREATE_SIGNAL.imageFileUpload).should('not.be.visible');
    });

    it('Should change location, description, phonenumer and email address', () => {
      cy.server();
      cy.getAddressRoute();
      cy.defineGeoSearchRoutes();
      cy.route('POST', '**/signals/category/prediction', 'fixture:afval.json').as('prediction');

      // Go to first step of signal creation and change signal information
      cy.get(CREATE_SIGNAL.linkChangeSignalInfo).click();
      cy.get(CREATE_SIGNAL.autoSuggest).find('input').clear().type('1071WX 5');
      cy.wait('@getAddress');
      createSignal.selectAddress('Ruysdaelstraat 5, 1071WX Amsterdam');
      cy.wait('@geoSearchLocation');
    
      // Change descripton to change category
      createSignal.setDescription('Voor mijn achterdeur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?');
      cy.get(CREATE_SIGNAL.radioButtonTijdstipEerder).click();
      cy.get(CREATE_SIGNAL.dropdownDag).select('Vandaag');
      cy.get(CREATE_SIGNAL.dropdownUur).select('5');
      cy.get(CREATE_SIGNAL.dropdownMinuten).select('45');
    
      // Upload a file (uses cypress-file-upload plugin)
      const fileName = 'logo.png';
      cy.get(CREATE_SIGNAL.buttonUploadFile).attachFile(fileName);
      cy.clickButton('Volgende');
    
      // Change phonenumber
      cy.url().should('include', '/incident/telefoon');
      cy.get(CREATE_SIGNAL.inputPhoneNumber).clear().type('06-87654321');
      cy.contains('Volgende').click();

      // Change email address
      cy.url().should('include', '/incident/email');
      cy.get(CREATE_SIGNAL.inputEmail).clear().type('mailsiafake@fake.nl');
      cy.contains('Volgende').click();

      // Check overview
      cy.url().should('include', '/incident/samenvatting');
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
      cy.contains('Ruysdaelstraat 5, 1071WX Amsterdam');
      cy.contains('Voor mijn achterdeur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?');
      cy.contains('Vandaag, 5:45').should('be.visible');
      cy.get(CREATE_SIGNAL.imageFileUpload).should('be.visible');
      cy.contains('06-87654321').should('be.visible');
      cy.contains('mailsiafake@fake.nl').should('be.visible');
      // Specific information is not visible
      cy.contains('Een aantal lichtpunten die bij elkaar staan/hangen').should('not.be.visible');
      cy.contains('Lichtpunt is zichtbaar beschadigd en/of incompleet').should('not.be.visible');
      cy.get(LANTAARNPAAL.mapSelectLamp).should('not.be.visible');
      cy.contains('155632.07').should('not.be.visible');
    });

    it('Should edit phonenumber and email address', () => {
    // Go to the phonenumber page and change phonenumber
      cy.get(CREATE_SIGNAL.linkChangePhoneNumber).click();
      cy.url().should('include', '/incident/telefoon');
      cy.get(CREATE_SIGNAL.inputPhoneNumber).clear().type('06-11223344');
      cy.contains('Volgende').click();

      // Change email address
      cy.url().should('include', '/incident/email');
      cy.get(CREATE_SIGNAL.inputEmail).clear().type('fakesiamail@fake.nl');
      cy.clickButton('Volgende');
    
      // Check overview
      cy.url().should('include', '/incident/samenvatting');
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
      cy.contains('Ruysdaelstraat 5, 1071WX Amsterdam');
      cy.contains('Voor mijn achterdeur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?');
      cy.contains('Vandaag, 5:45').should('be.visible');
      cy.get(CREATE_SIGNAL.imageFileUpload).should('be.visible');
      cy.contains('06-11223344').should('be.visible');
      cy.contains('fakesiamail@fake.nl').should('be.visible');
    });

    it('Should edit email address', () => {
    // Go to the email address page and change emailaddress
      cy.get(CREATE_SIGNAL.linkChangeEmailAddress).click();
      cy.url().should('include', '/incident/email');
      cy.get(CREATE_SIGNAL.inputEmail).clear().type('fakemailsia@fake.nl');
      cy.clickButton('Volgende');

      // Check overview
      cy.url().should('include', '/incident/samenvatting');
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
      cy.contains('Ruysdaelstraat 5, 1071WX Amsterdam');
      cy.contains('Voor mijn achterdeur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?');
      cy.contains('Vandaag, 5:45').should('be.visible');
      cy.get(CREATE_SIGNAL.imageFileUpload).should('be.visible');
      cy.contains('06-11223344').should('be.visible');
      cy.contains('fakemailsia@fake.nl').should('be.visible');
    });

    it('Should show the last screen', () => {
      cy.server();
      cy.postSignalRoutePublic();

      cy.clickButton('Verstuur');
      cy.wait('@postSignalPublic');
      cy.url().should('include', '/incident/bedankt');
      cy.checkHeaderText('Bedankt!');
    
      // Capture signal id to check details later
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
      cy.contains('Voor mijn achterdeur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?');
    
      // Check if map and marker are visible
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

      // Check signal data
      cy.get(SIGNAL_DETAILS.stadsdeel).contains('Stadsdeel: ').and('contain', 'Zuid').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).contains('Ruysdaelstraat').and('contain', '5').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).contains('1071WX').and('contain', 'Amsterdam').should('be.visible');
      cy.get(SIGNAL_DETAILS.email).contains('fakemailsia@fake.nl').should('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).contains('06-11223344').should('be.visible');

      // Check if status is 'gemeld' with red coloured text
      cy.get(SIGNAL_DETAILS.status).contains('Gemeld').should('be.visible').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });

      cy.contains('Normaal').should('be.visible');
      cy.contains('Veeg- / zwerfvuil').should('be.visible');
      cy.get(SIGNAL_DETAILS.urgency).contains('Normaal').should('be.visible');
      cy.get(SIGNAL_DETAILS.type).contains('Melding').should('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).contains('Schoon').should('be.visible');
      cy.get(SIGNAL_DETAILS.department).contains('STW').should('be.visible');
      cy.get(SIGNAL_DETAILS.source).contains('online').should('be.visible');
    });
  });
});