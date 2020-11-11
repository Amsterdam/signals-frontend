// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL, LANTAARNPAAL } from '../../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

describe('Change a signal before submit and check signal details', () => {
  describe('Change signal before submit', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:predictions/lantaarnpaal.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1071XX 1', 'Museumstraat 1, 1071XX Amsterdam');
      createSignal.setDescription('De lantaarnpaal voor mijn deur doet het niet en er ligt troep op de stoep');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      cy.server();
      cy.route('/maps/openbare_verlichting?REQUEST=GetFeature&SERVICE=wfs&OUTPUTFORMAT=application/*').as(
        'getOpenbareVerlichting',
      );
      createSignal.checkSpecificInformationPage();

      cy.get(LANTAARNPAAL.radioButtonProbleemBeschadigd).check({ force: true }).should('be.checked').and('be.visible');
      cy.get(LANTAARNPAAL.radioButtonNietGevaarlijk).check({ force: true }).should('be.checked');
      cy.wait('@getOpenbareVerlichting');
      cy.get(LANTAARNPAAL.checkBoxNietOpKaart).check().should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_niet_op_kaart_nummer.label).should('be.visible');
      cy.contains('+ Voeg een extra nummer toe').click();
      cy.get(LANTAARNPAAL.inputLampNummer1).type('11.11');
      cy.get(LANTAARNPAAL.inputLampNummer2).type('100.199');
      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      createSignal.setPhonenumber('06-12345678');
      cy.contains('Volgende').click();
      createSignal.setEmailAddress('siafakemail@fake.nl');
    });

    it('Should show a summary', () => {
      cy.server();
      cy.route('/maps/topografie?bbox=**').as('map');

      cy.contains('Volgende').click();
      cy.wait('@map');
      createSignal.checkSummaryPage();

      // Check if address and description are visible
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');

      // Check if specific information is visible
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_probleem.answers.lamp_is_zichtbaar_beschadigd).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.answers.niet_gevaarlijk).should('be.visible');
      cy.get(LANTAARNPAAL.mapSelectLamp).should('not.be.visible');
      cy.contains('11.11; 100.199').should('be.visible');

      // Check if mail and phonenumber are visible
      cy.contains(Cypress.env('phoneNumber')).should('be.visible');
      cy.contains(Cypress.env('emailAddress')).should('be.visible');

      // Check if there is no uploaded picture, later there is
      cy.get(CREATE_SIGNAL.imageFileUpload).should('not.be.visible');
    });

    it('Should change location, description, phonenumer and email address', () => {
      cy.server();
      cy.route('/maps/topografie?bbox=**').as('map');
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:predictions/afval.json').as('prediction');

      // Go to first step of signal creation and change signal information
      cy.get(CREATE_SIGNAL.linkChangeSignalInfo).click();
      cy.get(CREATE_SIGNAL.autoSuggest).find('input').clear();
      createSignal.setAddress('1071WX 5', 'Ruysdaelstraat 5, 1071WX Amsterdam');

      // Change descripton to change category
      createSignal.setDescription(
        'Voor mijn achterdeur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?',
      );
      createSignal.setDateTime('Eerder');

      createSignal.uploadFile('images/logo.png', 'image/png', CREATE_SIGNAL.buttonUploadFile);

      cy.contains('Volgende').click();

      // Change phonenumber
      createSignal.setPhonenumber('06-87654321');
      cy.contains('Volgende').click();

      // Change email address
      createSignal.setEmailAddress('mailsiafake@fake.nl');
      cy.contains('Volgende').click();

      // Check summary
      cy.wait('@map');
      createSignal.checkSummaryPage();
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains('Vandaag, 5:45').should('be.visible');
      cy.get(CREATE_SIGNAL.imageFileUpload).should('be.visible');
      cy.contains(Cypress.env('phoneNumber')).should('be.visible');
      cy.contains(Cypress.env('emailAddress')).should('be.visible');
      // Specific information is not visible
      cy.contains('Een aantal lichtpunten die bij elkaar staan/hangen').should('not.be.visible');
      cy.contains('Lichtpunt is zichtbaar beschadigd en/of incompleet').should('not.be.visible');
      cy.get(LANTAARNPAAL.mapSelectLamp).should('not.be.visible');
      cy.contains('155632.07').should('not.be.visible');
    });

    it('Should edit phonenumber and email address', () => {
      // Go to the phonenumber page and change phonenumber
      cy.get(CREATE_SIGNAL.linkChangePhoneNumber).click();
      createSignal.setPhonenumber('06-11223344');
      cy.contains('Volgende').click();

      // Change email address
      createSignal.setEmailAddress('fakesiamail@fake.nl');
      cy.contains('Volgende').click();

      // Check summary
      createSignal.checkSummaryPage();
      cy.contains('Ruysdaelstraat 5, 1071WX Amsterdam');
      cy.contains(
        'Voor mijn achterdeur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?',
      );
      cy.contains('Vandaag, 5:45').should('be.visible');
      cy.get(CREATE_SIGNAL.imageFileUpload).should('be.visible');
      cy.contains(Cypress.env('phoneNumber')).should('be.visible');
      cy.contains(Cypress.env('emailAddress')).should('be.visible');
    });

    it('Should edit email address', () => {
      cy.server();
      cy.postSignalRoutePublic();
      // Go to the email address page and change emailaddress
      cy.get(CREATE_SIGNAL.linkChangeEmailAddress).click();
      createSignal.setEmailAddress('fakemailsia@fake.nl');
      cy.contains('Volgende').click();

      // Check summary
      createSignal.checkSummaryPage();
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains('Vandaag, 5:45').should('be.visible');
      cy.get(CREATE_SIGNAL.imageFileUpload).should('be.visible');
      cy.contains(Cypress.env('phoneNumber')).should('be.visible');
      cy.contains(Cypress.env('emailAddress')).should('be.visible');

      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.be.visible');
    });

    it('Should show the last screen', () => {
      createSignal.checkThanksPage();
      // Capture signal id to check details later
      createSignal.getSignalId();
    });
  });

  describe('Check data created signal', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');
      // Check signal data
      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Zuid').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Ruysdaelstraat 5').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1071WX Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', Cypress.env('emailAddress')).and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', Cypress.env('phoneNumber')).and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Veeg- / zwerfvuil (STW)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Schoon').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
