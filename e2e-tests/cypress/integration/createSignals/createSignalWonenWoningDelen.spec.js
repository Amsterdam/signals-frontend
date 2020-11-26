// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { WONEN_WONINGDELEN } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/wonenWoningDelen.json';

describe('Create signal "Wonen woning delen" and check signal details', () => {
  describe('Create signal wonen woning delen', () => {
    before(() => {
      cy.server();
      cy.getAddressRoute();
      cy.postSignalRoutePublic();
      cy.intercept('**/maps/topografie?bbox=**').as('map');
      cy.visitFetch('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath);

      cy.contains(questions.wonen.extra_wonen_woningdelen_vermoeden.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_vermoeden.subtitle).should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputWatSpeeltZichAf).eq(0).type('Ik vermoed tovenarij');

      cy.contains(questions.wonen.extra_wonen_woningdelen_eigenaar.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputEigenaar).eq(1).type('Ja, dat weet ik.');

      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.subtitle).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaZelfde).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.exist');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.exist');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaAnder).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woningdelen_aantal_personen.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen1).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.exist');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen3).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen2).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.exist');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen4).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonenWeetNiet).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.exist');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen5).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieWeetNiet).check({ force: true }).should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieJa).check({ force: true }).should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieNee).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woningdelen_samenwonen.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkWeetNiet).check({ force: true }).should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkJa).check({ force: true }).should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkNee).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woningdelen_wisselende_bewoners.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersWeetNiet).check({ force: true }).should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersNee).check({ force: true }).should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersJa).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woningdelen_iemand_aanwezig.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputTijdstip).eq(2).type('Voornamelijk op de dinsdagen om 23:23:05');

      cy.contains('Volgende').click();

      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

      cy.wait('@map');
      createSignal.checkSummaryPage(fixturePath);
      createSignal.checkQuestions(fixturePath);
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
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(fixturePath);
    });
  });
});
