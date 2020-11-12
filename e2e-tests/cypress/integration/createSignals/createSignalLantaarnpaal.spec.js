// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL, LANTAARNPAAL } from '../../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

describe('Create signal lantaarnpaal and check signal details', () => {
  describe('Create signal lantaarnpaal', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:predictions/lantaarnpaal.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1077WV 59', 'Prinses Irenestraat 59, 1077WV Amsterdam');
      createSignal.setDescription('De lantaarnpaal voor mijn deur is kapot');
      createSignal.setDateTime('Eerder');

      createSignal.uploadFile('images/logo.png', 'image/png', CREATE_SIGNAL.buttonUploadFile);
      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      cy.server();
      cy.route('/maps/openbare_verlichting?REQUEST=GetFeature&SERVICE=wfs&OUTPUTFORMAT=application/*').as(
        'getOpenbareVerlichting',
      );

      createSignal.checkSpecificInformationPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      // Click on next to invoke error message
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Wat is het probleem?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_probleem.label).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemDoetNiet).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemBrandtOverdag).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('not.be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemLichthinder).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('not.be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemVies).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('not.be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemBeschadigd).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemOverig).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('be.visible');
      cy.wait('@getOpenbareVerlichting');

      // Check on visibility of the message to make a phone call directly after selecting one of the first four options
      cy.get(LANTAARNPAAL.radioButtonGevaarlijk3OfMeerKapot).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkAanrijding).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkOpGrond).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkDeur).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkLosseKabels).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonNietGevaarlijk).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('not.be.visible');
    });

    it('Should select a light on map', () => {
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_nummer.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_nummer.subtitle).should('be.visible');
      // Click on lamp based on coordinate
      createSignal.selectLampOnCoordinate(414, 135);
      cy.contains('Het gaat om lamp of lantaarnpaal met nummer: 034575').should('be.visible');

      // Check options in legend
      cy.get(LANTAARNPAAL.mapSelectLamp).should('be.visible');
      cy.get(LANTAARNPAAL.legendHeader).should('have.text', 'Legenda').and('be.visible');
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
    });

    it('Should show a summary', () => {
      cy.server();
      cy.route('/maps/topografie?bbox=**').as('map');
      cy.postSignalRoutePublic();

      cy.contains('Volgende').click();
      cy.wait('@map');
      createSignal.checkSummaryPage();

      // Check on information provided by user
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains('Vandaag, 5:45').should('be.visible');
      cy.get(CREATE_SIGNAL.imageFileUpload).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_probleem.shortLabel).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_probleem.answers.overig).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.shortLabel).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.answers.niet_gevaarlijk).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_nummer.shortLabel).should('be.visible');
      cy.contains('034575').should('be.visible');
      cy.get(LANTAARNPAAL.mapSelectLamp).should('be.visible');
      cy.get(LANTAARNPAAL.markerOnMap).should('be.visible');

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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Zuid').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Prinses Irenestraat 59').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1077WV Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      // Open and close uploaded picture
      cy.get(SIGNAL_DETAILS.photo).should('be.visible').click();
      cy.get(SIGNAL_DETAILS.photoViewerImage).should('be.visible');
      cy.get(SIGNAL_DETAILS.buttonCloseImageViewer).click();

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Straatverlichting (VOR)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Wegen, verkeer, straatmeubilair').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
