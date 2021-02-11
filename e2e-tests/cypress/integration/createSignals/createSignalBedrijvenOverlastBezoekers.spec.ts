import { BEDRIJVEN_HORECA } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/bedrijvenBezoekers.json';

const sizes = [[375, 812], [1536, 864]];

describe('Create signal "Bedrijven overlast bezoekers" and check signal details', () => {
  sizes.forEach(size => {
    describe(`Create signal overlast bezoekers, resolution is: ${size}`, () => {
      before(() => {
        cy.setResolution(size);
        cy.postSignalRoutePublic();
        cy.stubPreviewMap();
        cy.stubMap();
        cy.visit('incident/beschrijf');
      });

      it('Should create the signal', () => {
        cy.setDescriptionPage(signal);
        cy.contains('Volgende').click();

        cy.checkSpecificInformationPage(signal);

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

        cy.setPhonenumber(signal);
        cy.contains('Volgende').click();

        cy.setEmailAddress(signal);
        cy.contains('Volgende').click();

        cy.checkSummaryPage(signal);
        cy.contains('Verstuur').click();
        cy.wait('@postSignalPublic');
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

        cy.checkThanksPage();
        cy.saveSignalId();
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
        cy.openCreatedSignal();
        cy.waitForSignalDetailsRoutes();

        cy.checkAllDetails(signal);
      });
    });
  });
});
