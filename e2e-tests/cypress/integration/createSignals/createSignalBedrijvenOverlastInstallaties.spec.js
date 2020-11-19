// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { BEDRIJVEN_HORECA } from '../../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

describe('Create signal "Bedrijven overlast installaties" and check signal details', () => {
  describe('Create signal overlast installaties', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should search for an address', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:predictions/bedrijvenInstallatieoverlast.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1033PG 5', 'NDSM-kade 5, 1033PG Amsterdam');
      createSignal.setDescription('Bij de IJ-kantine staat een installatie geweldige herrie te maken.');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Provide information about smell
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_wat.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.radioButtonIetsAnders).click({ force: true });
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_naam.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputWieWat).eq(0).type('Het geluid van de afzuigkap is tot in Oostzaan te horen.');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_adres.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputAdres).eq(1).type('1033PG 5');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_installaties.label).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_installaties.subtitle).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputSoortInstallatie).eq(2).type('Afzuiginstallatie');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.label).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.subtitle).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.radioButtonVakerNee).click({ force: true });
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_caution.answers).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_installaties.label).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_installaties.subtitle).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.radioButtonContactNee).click({ force: true });
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_nee.label).should('be.visible');
      cy.get(BEDRIJVEN_HORECA.inputWaaromGeenContact).eq(3).type('Ik heb contacteer-angst');
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
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_wat.answers.iets_anders).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_naam.shortLabel).should('be.visible');
      cy.contains('Het geluid van de afzuigkap is tot in Oostzaan te horen.').should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_adres.shortLabel).should('be.visible');
      cy.contains('1033PG 5').should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_installaties.shortLabel).should('be.visible');
      cy.contains('Afzuiginstallatie').should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.shortLabel).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.answers.nee).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_installaties.shortLabel).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_installaties.answers.nee).should('be.visible');
      cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_nee.shortLabel).should('be.visible');
      cy.contains('Ik heb contacteer-angst').should('be.visible');

      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.be.visible');
    });

    it('Should show the last screen', () => {
      createSignal.checkThanksPage();
      // Capture signal id to check details later
      createSignal.saveSignalId();
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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Noord').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'NDSM-kade 5').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1033PG Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      cy.get(SIGNAL_DETAILS.handlingTime).should('have.text', '5 werkdagen').and('be.visible');
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Geluidsoverlast installaties (ASC, VTH)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Overlast Bedrijven en Horeca').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
