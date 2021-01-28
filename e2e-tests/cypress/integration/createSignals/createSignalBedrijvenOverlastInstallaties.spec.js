// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { BEDRIJVEN_HORECA } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/bedrijvenInstallaties.json';
const sizes = [[375, 667], [1920, 1080]];

describe('Create signal "Bedrijven overlast installaties" and check signal details', () => {
  sizes.forEach(size => {
    describe(`Create signal overlast installaties, resolution is: ${size}`, () => {
      before(() => {
        cy.setResolution(size);
        cy.postSignalRoutePublic();
        cy.stubPreviewMap();
        cy.stubMap();
        cy.visit('incident/beschrijf');
      });

      it('Should create the signal', () => {
        createSignal.setDescriptionPage(fixturePath);
        cy.contains('Volgende').click();

        createSignal.checkSpecificInformationPage(fixturePath);

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

        createSignal.setPhonenumber(fixturePath);
        cy.contains('Volgende').click();

        createSignal.setEmailAddress(fixturePath);
        cy.contains('Volgende').click();

        createSignal.checkSummaryPage(fixturePath);
        cy.contains('Verstuur').click();
        cy.wait('@postSignalPublic');
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

        createSignal.checkThanksPage();
        createSignal.saveSignalId();
      });
    });
    describe('Check data created signal', () => {
      before(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        cy.getManageSignalsRoutes();
        cy.getSignalDetailsRoutesById();
        cy.visit('/manage/incidents/');
        cy.waitForManageSignalsRoutes();
      });

      it('Should show the signal details', () => {
        cy.stubPreviewMap();
        createSignal.openCreatedSignal();
        cy.waitForSignalDetailsRoutes();

        createSignal.checkAllDetails(fixturePath);
      });
    });
  });
});
