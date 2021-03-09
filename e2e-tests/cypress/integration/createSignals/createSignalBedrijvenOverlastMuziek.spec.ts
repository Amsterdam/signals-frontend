import { BEDRIJVEN_HORECA } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/bedrijvenMuziek.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as general from '../../support/commandsGeneral';

const sizes = [[414, 896], [1280, 720]];

describe('Create signal "Bedrijven overlast muziek" and check signal details', () => {
  sizes.forEach(size => {
    describe(`Create signal overlast muziek, resolution is: ${size}`, () => {
      before(() => {
        general.setResolution(size);
        routes.postSignalRoutePublic();
        routes.stubPreviewMap();
        routes.stubMap();
        cy.visit('incident/beschrijf');
      });

      it('Should search for an address', () => {
        createSignal.setDescriptionPage(signal);
        cy.contains('Volgende').click();

        createSignal.checkSpecificInformationPage(signal);

        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_wat.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.radioButtonEvenement).click({ force: true });
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_naam.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.inputWieWat).type('Violisten in het Bimhuis');
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_adres.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.inputAdres).type('Piet Heinkade 3, maar dat had ik toch al gezegd?');
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_evenement.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.radioButtonGeinformeerdJa).click({ force: true });
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_evenement_einde.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.inputHoeLaatEinde).type('Rond middernacht');
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.label).should('be.visible');
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_vaker.subtitle).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.radioButtonVakerJa).click({ force: true });
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_tijdstippen.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.inputTijdstippen).type('Meestal op 31 december rond middernacht');
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_muziek.label).should('be.visible');
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_muziek.subtitle).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.radioButtonContactJa).click({ force: true });
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_caution.value).should('be.visible');
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_ja.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.radioButtonBellenNietNu).click({ force: true });
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_muziek_geluidmeting_ja_nietnu.label).should('be.visible');
        cy.get(BEDRIJVEN_HORECA.inputWanneerBellen).type('Wanneer ik er zin in heb.');
        cy.contains(questions.overlastBedrijvenEnHoreca.extra_bedrijven_horeca_caution.answers).should('be.visible');
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
