// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, LANTAARNPAAL } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Create signal lantaarnpaal and check signal details', () => {
  describe('Create signal lantaarnpaal', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:lantaarnpaal.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1077WV 59', 'Prinses Irenestraat 59, 1077WV Amsterdam');
      createSignal.setDescription('De lantaarnpaal voor mijn deur is kapot');
      createSignal.setDateTime('Eerder');

      // Upload a file (uses cypress-file-upload plugin)
      const fileName = 'logo.png';
      cy.get(CREATE_SIGNAL.buttonUploadFile).attachFile(fileName);

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      cy.server();
      cy.route('/maps/openbare_verlichting?REQUEST=GetFeature&SERVICE=wfs&OUTPUTFORMAT=application/*').as(
        'getOpenbareVerlichting'
      );

      createSignal.checkSpecificInformationPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      // Click on next to invoke error message
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.errorList).should('contain', 'Dit is een verplicht veld');

      cy.get(LANTAARNPAAL.radioButtonProbleemDoetNiet)
        .check()
        .should('be.checked')
        .and('be.visible');
      cy.contains('Is de situatie gevaarlijk?').should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemBrandtOverdag)
        .check()
        .should('be.checked')
        .and('be.visible');
      cy.contains('Is de situatie gevaarlijk?').should('not.be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemLichthinder)
        .check()
        .should('be.checked')
        .and('be.visible');
      cy.contains('Is de situatie gevaarlijk?').should('not.be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemVies)
        .check()
        .should('be.checked')
        .and('be.visible');
      cy.contains('Is de situatie gevaarlijk?').should('not.be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemBeschadigd)
        .check()
        .should('be.checked')
        .and('be.visible');
      cy.contains('Is de situatie gevaarlijk?').should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemOverig)
        .check()
        .should('be.checked')
        .and('be.visible');
      cy.contains('Is de situatie gevaarlijk?').should('be.visible');
      cy.wait('@getOpenbareVerlichting');

      // Check on visibility of the message to make a phone call directly after selecting one of the first four options
      const messageCallDirectly = 'Bel direct 14 020. U hoeft dit formulier niet meer verder in te vullen.';

      cy.get(LANTAARNPAAL.radioButtonGevaarlijk3OfMeerKapot)
        .check()
        .should('be.checked');
      cy.contains(messageCallDirectly).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkAanrijding)
        .check()
        .should('be.checked');
      cy.contains(messageCallDirectly).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkOpGrond)
        .check()
        .should('be.checked');
      cy.contains(messageCallDirectly).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkDeur)
        .check()
        .should('be.checked');
      cy.contains(messageCallDirectly).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkLosseKabels)
        .check()
        .should('be.checked');
      cy.contains(messageCallDirectly).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonNietGevaarlijk)
        .check()
        .should('be.checked');
      cy.contains(messageCallDirectly).should('not.be.visible');
    });

    it('Should select a light on map', () => {
      // Click on lamp based on coordinate
      createSignal.selectLampOnCoordinate(414, 135);
      cy.contains('Het gaat om lamp of lantaarnpaal met nummer: 034575').should('be.visible');

      // Check options in legend
      cy.get(LANTAARNPAAL.mapSelectLamp).should('be.visible');
      cy.get(LANTAARNPAAL.legendHeader)
        .should('have.text', 'Legenda')
        .and('be.visible');
      cy.get(LANTAARNPAAL.legendContentText).should('be.visible');
      cy.contains('Lantaarnpaal').should('be.visible');
      cy.contains('Grachtmast').should('be.visible');
      cy.contains('Lamp aan kabel').should('be.visible');
      cy.contains('Lamp aan gevel').should('be.visible');
      cy.contains('Schijnwerper').should('be.visible');
      cy.contains('Overig lichtpunt').should('be.visible');

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

      // Check on information provided by user
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains('Vandaag, 5:45').should('be.visible');
      cy.get(CREATE_SIGNAL.imageFileUpload).should('be.visible');
      cy.contains('Probleem').should('be.visible');
      cy.contains('Overig').should('be.visible');
      cy.contains('Is de situatie gevaarlijk?').should('be.visible');
      cy.contains('Nee, niet gevaarlijk').should('be.visible');
      cy.contains('Lichtpunt(en) op kaart').should('be.visible');
      cy.contains('034575').should('be.visible');
      cy.get(LANTAARNPAAL.mapSelectLamp).should('be.visible');
      cy.get(LANTAARNPAAL.markerOnMap).should('be.visible');

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
        .should('have.text', 'Prinses Irenestraat 59')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity)
        .should('have.text', '1077WV Amsterdam')
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

      // Open and close uploaded picture
      cy.get(SIGNAL_DETAILS.photo)
        .should('be.visible')
        .click();
      cy.get(SIGNAL_DETAILS.photoViewerImage).should('be.visible');
      cy.get(SIGNAL_DETAILS.buttonCloseImageViewer).click();

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency)
        .should('have.text', 'Normaal')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.type)
        .should('have.text', 'Melding')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory)
        .should('have.text', 'Straatverlichting (VOR)')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory)
        .should('have.text', 'Wegen, verkeer, straatmeubilair')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.source)
        .should('have.text', 'online')
        .and('be.visible');
    });
  });
});
