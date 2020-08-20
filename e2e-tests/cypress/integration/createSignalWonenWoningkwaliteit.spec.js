// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_WONINGKWALITEIT } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';
import { generateToken } from '../support/jwt';

describe('Create signal wonen woningkwaliteit and check signal details', () => {
  describe('Create signal wonen woningkwaliteit', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wonenWoningkwaliteit.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1059BP 48', 'Jaagpad 48, 1059BP Amsterdam');
      createSignal.setDescription('De hele woning staat blank, dit komt door lekkage in het dak.');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Check if field is mandatory
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Denkt u dat er direct gevaar is?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      // Input specific information
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonGevaarJa).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar_alert.answers)
        .should('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });
      cy.get(WONEN_WONINGKWALITEIT.radioButtonGevaarNee).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_gemeld_bij_eigenaar.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonKlachtGemeldNee).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar_ja.answers).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonKlachtGemeldJa).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar_ja.answers).should('not.be.visible');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_bewoner.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonBewonerJa).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_namens_bewoner.label).should('not.be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonBewonerNee).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_namens_bewoner.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonNamensBewonerJa).check().should('be.checked');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonNamensBewonerNee).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact.subtitle).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonContactJa).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact_ja.answers).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonContactNee).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact_ja.answers).should('not.be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_geen_contact.label).should('be.visible');

      cy.get(WONEN_WONINGKWALITEIT.inputGeenContact).type('Vertel ik liever niet');

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

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_gemeld_bij_eigenaar.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_bewoner.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_bewoner.answers.nee).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_namens_bewoner.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact.answers.nee).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_geen_contact.shortLabel).should('be.visible');
      cy.contains('Vertel ik liever niet').should('be.visible');

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
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Jaagpad 48').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1059BP Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkRedTextStatus('Gemeld');
      createSignal.checkCreationDate();
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Woningkwaliteit (WON)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Wonen').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
