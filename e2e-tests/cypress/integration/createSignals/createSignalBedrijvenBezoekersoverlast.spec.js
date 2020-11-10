// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { BEDRIJVEN_HORECA } from '../../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

describe('Create signal bedrijven en horeca and check signal details', () => {
  describe('Create signal bedrijven en horeca', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should search for an address', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:predictions/bedrijvenBezoekersoverlast.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1012AN 5A', 'Zeedijk 5A, 1012AN Amsterdam');
      createSignal.setDescription(
        'Ik heb ontzettende overlast van cafe het 11e gebod, dronken mensen staan buiten te schreeuwen',
      );
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_wat.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.radioButtonHoreca).click({ force: true });

      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_naam.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputWieWat).eq(0).type('Klanten van het cafe');

      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_adres.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputAdres).eq(1).type('Op Zeedijk nummer 3');

      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_personen.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.checkBoxDronken).check();
      cy.get(BEDRIJVEN_HORECA.checkBoxSchreeuwen).check();
      cy.get(BEDRIJVEN_HORECA.checkBoxWildplassen).check();

      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.label).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.subtitle).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.radioButtonVakerJa).click({ force: true });

      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_tijdstippen.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputDatum).eq(2).type('Elke dag');

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

      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_wat.shortLabel).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_wat.answers.horecabedrijf).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_naam.shortLabel).should('be.visible');
      cy.contains('Klanten van het cafe').should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_adres.shortLabel).should('be.visible');
      cy.contains('Op Zeedijk nummer 3').should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_personen.shortLabel).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_personen.answers.dronken_bezoekers).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_personen.answers.schreeuwende_bezoekers).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_personen.answers.wildplassen).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.shortLabel).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.answers.ja).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_tijdstippen.shortLabel).should('be.visible');
      cy.contains('Elke dag').should('be.visible');

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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Centrum').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Zeedijk 5A').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1012AN Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory)
        .should('have.text', 'Overlast door bezoekers (niet op terras) (ASC, THO)')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Overlast Bedrijven en Horeca').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
