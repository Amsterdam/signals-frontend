// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, KLOK } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';
import { generateToken } from '../support/jwt';

describe('Create signal klok', () => {
  describe('Create signal klok on the map', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:klok.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1014DA 1', 'Polonceau-kade 1, 1014DA Amsterdam');
      createSignal.setDescription(
        'De klok bij de bakker draait op volle snelheid rondjes naar links ipv rustig naar rechts'
      );
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      const warning = questions.wegenVerkeerStraatmeubilair.extra_klok_gevaar.answers;
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Click on next to invoke error message
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Is de situatie gevaarlijk?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      // First question
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok.label).should('be.visible');
      cy.get(KLOK.radioButtonGevaarlijkAanrijding).check().should('be.checked');
      cy.contains(warning)
        .should('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });
      cy.get(KLOK.radioButtonGevaarlijkOpGrondOfScheef).check().should('be.checked');
      cy.contains(warning).should('be.visible');
      cy.get(KLOK.radioButtonGevaarlijkDeurtje).check().should('be.checked');
      cy.contains(warning).should('be.visible');
      cy.get(KLOK.radioButtonGevaarlijkLosseKabels).check().should('be.checked');
      cy.contains(warning).should('be.visible');
      cy.get(KLOK.radioButtonGevaarlijkNietGevaarlijk).check().should('be.checked');
      cy.contains(warning).should('not.be.visible');

      // Second question
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_probleem.label).should('be.visible');
      cy.get(KLOK.radioButtonProbleemNietOpTijd).check().should('be.checked');
      cy.get(KLOK.radioButtonProbleemBeschadigd).check().should('be.checked');
      cy.get(KLOK.radioButtonProbleemVervuild).check().should('be.checked');
      cy.get(KLOK.radioButtonProbleemOverig).check().should('be.checked');

      // Third question
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_nummer.label).should('be.visible');
      // Click on klok based on coordinate
      cy.get(KLOK.iconKlok).click();

      // Check options in legend
      cy.get(KLOK.mapSelectKlok).should('be.visible');
      cy.get(KLOK.legendHeader).should('have.text', 'Legenda').and('be.visible');
      cy.get(KLOK.legendContentText).should('have.text', 'Klok').and('be.visible');

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

      // Check information provided by user
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok.shortLabel).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok.answers.niet_gevaarlijk).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_nummer.shortLabel).should('be.visible');
      cy.contains('140425').should('be.visible');

      cy.get(CREATE_SIGNAL.checkBoxSharingAllowed).click().should('be.checked');
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
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });

    it('Should show the signal details', () => {
      cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: West').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Polonceau-kade 1').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1014DA Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Ja').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Klok (VOR)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Wegen, verkeer, straatmeubilair').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
  describe('Create signal klok not on the map', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:klok.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1076DE 2', 'Olympisch Stadion 2, 1076DE Amsterdam');
      createSignal.setDescription('De klokken van het Olympisch stadion hangen hartstikke scheef.');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // First question
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok.label).should('be.visible');
      cy.get(KLOK.radioButtonGevaarlijkOpGrondOfScheef).check().should('be.checked');

      // Second question
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_probleem.label).should('be.visible');
      cy.get(KLOK.radioButtonProbleemBeschadigd).check().should('be.checked');

      // Third question
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_nummer.label).should('be.visible');
      cy.get(KLOK.mapSelectKlok).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_niet_op_kaart.value).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_niet_op_kaart_nummer.label).should('not.be.visible');
      cy.get(KLOK.checkBoxNietOpKaart).check().should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_niet_op_kaart_nummer.label).should('be.visible');
      cy.contains('+ Voeg een extra nummer toe').click();
      cy.get(KLOK.inputKlokNummer1).type('666');
      cy.get(KLOK.inputKlokNummer2).type('999');

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
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok.answers.klok_op_grond_of_scheef).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_probleem.answers.klok_is_zichtbaar_beschadigd).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_klok_niet_op_kaart_nummer.shortLabel).should('be.visible');
      cy.contains('666; 999').should('be.visible');

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
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });

    it('Should show the signal details', () => {
      cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Zuid').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Olympisch Stadion 2').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1076DE Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Klok (VOR)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Wegen, verkeer, straatmeubilair').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
