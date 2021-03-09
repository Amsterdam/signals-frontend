import { BEDRIJVEN_HORECA } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/bedrijvenBezoekers.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as general from '../../support/commandsGeneral';

const sizes = [[375, 812], [1536, 864]];

describe('Create signal "Bedrijven overlast bezoekers" and check signal details', () => {
  sizes.forEach(size => {
    describe(`Create signal overlast bezoekers, resolution is: ${size}`, () => {
      before(() => {
        general.setResolution(size);
        routes.postSignalRoutePublic();
        routes.stubPreviewMap();
        routes.stubMap();
        cy.visit('incident/beschrijf');
      });

      it('Should create the signal', () => {
        createSignal.setDescriptionPage(signal);
        cy.contains('Volgende').click();

        createSignal.checkSpecificInformationPage(signal);

        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_wat.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.radioButtonHoreca).click({ force: true });

        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_naam.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.inputWieWat).type('Klanten van het cafe');

        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_adres.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.inputAdres).type('Op Zeedijk nummer 3');

        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_personen.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.checkBoxDronken).check();
        cy.get(BEDRIJVEN_HORECA.checkBoxSchreeuwen).check();
        cy.get(BEDRIJVEN_HORECA.checkBoxWildplassen).check();

        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.label).should('be.visible');
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.subtitle).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.radioButtonVakerJa).click({ force: true });

        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_tijdstippen.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.inputDatum).type('Elke dag');

        cy.contains('Volgende').click();

        createSignal.setPhonenumber(signal);
        cy.contains('Volgende').click();

        createSignal.setEmailAddress(signal);
        cy.contains('Volgende').click();

        createSignal.checkSummaryPage(signal);
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
        routes.getManageSignalsRoutes();
        routes.getSignalDetailsRoutesById();
        cy.visit('/manage/incidents/');
        routes.waitForManageSignalsRoutes();
      });

      it('Should show the signal details', () => {
        routes.stubPreviewMap();
        createSignal.openCreatedSignal();
        routes.waitForSignalDetailsRoutes();

        createSignal.checkAllDetails(signal);
      });
    });
  });
});
