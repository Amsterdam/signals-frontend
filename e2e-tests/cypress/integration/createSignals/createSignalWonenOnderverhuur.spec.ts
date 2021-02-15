import { WONEN_ONDERVERHUUR } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/wonenOnderverhuur.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Create signal "Wonen onderverhuur" and check signal details', () => {
  describe('Create signal wonen onderverhuur', () => {
    before(() => {
      routes.postSignalRoutePublic();
      routes.stubPreviewMap();
      routes.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(signal);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(signal);
      cy.contains(questions.wonen.extra_wonen_onderhuur_aantal_personen.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen1).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('not.exist');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen3).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen2).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('not.exist');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen4).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonenWeetNiet).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('not.exist');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen5).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('be.visible');

      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieJa).check({ force: true }).should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieNee).check({ force: true }).should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieWeetNiet).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_onderhuur_naam_bewoners.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputNamen).type('Yennefer en Geralt of Rivia');

      cy.contains(questions.wonen.extra_wonen_onderhuur_woon_periode.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangWeetNiet).check({ force: true }).should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangMinderZesMaanden).check({ force: true }).should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangLangerZesMaanden).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_onderhuur_iemand_aanwezig.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputTijdstip).eq(0).type('Elke avond en nacht zijn deze personen aanwezig.');

      cy.contains(questions.wonen.extra_wonen_onderhuur_naam_huurder.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_naam_huurder.subtitle).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputHuurder).eq(1).type('Ja, dat is Vesemir');

      cy.contains(questions.wonen.extra_wonen_onderhuur_huurder_woont.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderJaZelfde).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.exist');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.exist');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderJaAnder).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputAdresHuurder).eq(2).type('Kaer Morhen');

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
