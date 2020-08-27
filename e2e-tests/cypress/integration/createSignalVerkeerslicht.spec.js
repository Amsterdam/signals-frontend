// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, VERKEERSLICHT } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';
import { generateToken } from '../support/jwt';

describe('Create signal Verkeerslicht and check signal details', () => {
  describe('Create signal Verkeerslicht', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:verkeerslicht.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1018VN 113', 'Weesperstraat 113, 1018VN Amsterdam');
      createSignal.setDescription(
        'Het stoplicht op de kruising weesperstraat met de nieuwe kerkkstraat richting de stad staat altijd op groen. Dit zorgt voor gevaarlijke situaties.'
      );
      createSignal.setDateTime('Eerder');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Click on next to invoke error message
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Is de situatie gevaarlijk?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      // Check on visibility of the message to make a phone call directly after selecting one of the first four options
      const messageCallDirectly = questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_gevaar.answers;

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht.label).should('be.visible');
      cy.get(VERKEERSLICHT.radioButtonAanrijding).check().should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonOpGrond).check().should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonDeur).check().should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonLosseKabels).check().should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonNietGevaarlijk).check().should('be.checked');
      cy.contains(messageCallDirectly).should('not.exist');

      // Click on next to invoke error message
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Welk verkeerslicht werkt niet juist?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      // Check all options for voetganger
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_welk.label).should('be.visible');
      cy.get(VERKEERSLICHT.radioButtonTypeVoetganger).check().should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_voetganger.label).should('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerRoodLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerGroenLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Groen licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerBlindentikker)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Blindentikker werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerDuurtLang)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Duurt (te) lang voordat het groen wordt')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerAnders)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Anders')
        .and('be.visible');

      // Check all options for Fiets
      cy.get(VERKEERSLICHT.radioButtonTypeFiets).check().should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_fiets_auto.label).should('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoRoodLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoOranjeLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Oranje/geel licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoGroenLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Groen licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoDuurtLang)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Duurt (te) lang voordat het groen wordt')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoAnders)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Anders')
        .and('be.visible');

      // Check all options for Auto
      cy.get(VERKEERSLICHT.radioButtonTypeAuto).check().should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_fiets_auto.label).should('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoRoodLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoOranjeLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Oranje/geel licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoGroenLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Groen licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoDuurtLang)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Duurt (te) lang voordat het groen wordt')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoAnders)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Anders')
        .and('be.visible');

      // Check all options for Tram of bus
      cy.get(VERKEERSLICHT.radioButtonTypeTramBus).check().should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_bus_tram.label).should('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramRoodLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramOranjeLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Oranje/geel licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramWitLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Wit licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramWaarschuwingslicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Waarschuwingslicht tram werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramAnders)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Anders')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramRoodLicht).check();

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_rijrichting.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_rijrichting.subtitle).should('be.visible');
      cy.get(VERKEERSLICHT.inputRijrichting).eq(0).type('Richting centrum');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_nummer.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_nummer.subtitle).should('be.visible');
      cy.get(VERKEERSLICHT.inputNummerVerkeerslicht).eq(1).type('365');

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
      cy.contains('Vandaag, 5:45').should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht.shortLabel).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht.answers.niet_gevaarlijk).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_welk.shortLabel).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_welk.answers.tram_bus).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_bus_tram.answers.rood_werkt_niet).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_rijrichting.shortLabel).should('be.visible');
      cy.contains('Richting centrum').should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_nummer.shortLabel).should('be.visible');
      cy.contains('365').should('be.visible');

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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Centrum').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Weesperstraat 113').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1018VN Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Verkeerslicht (VOR)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Wegen, verkeer, straatmeubilair').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
