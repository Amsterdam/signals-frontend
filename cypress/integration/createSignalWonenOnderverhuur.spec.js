// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { WONEN_ONDERVERHUUR } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';

describe('Create signal wonen onderverhuur and check signal details', () => {
  describe('Create signal wonen onderverhuur', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wonenOnderverhuur.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1033WB 78', 'NDSM-plein 78, 1033WB Amsterdam');
      createSignal.setDescription('Deze hijskraan wordt illegaal onderverhuurd');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains('Deze hijskraan wordt illegaal onderverhuurd').should('be.visible');

      // Input specific information
      cy.contains(questions.wonen.extra_wonen_onderhuur_aantal_personen.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen1).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen3).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen2).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen4).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonenWeetNiet).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('not.be.visible');
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
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderJaAnder).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputAdresHuurder).eq(2).type('Kaer Morhen');

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
      cy.contains('Locatie').should('be.visible');
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains('Beschrijving').should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_aantal_personen.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_aantal_personen.answers.vijf_of_meer_personen).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.answers.weet_ik_niet).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_naam_bewoners.shortLabel).should('be.visible');
      cy.contains('Yennefer en Geralt of Rivia').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_woon_periode.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_woon_periode.answers.langer_dan_zes_maanden).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_iemand_aanwezig.shortLabel).should('be.visible');
      cy.contains('Elke avond en nacht zijn deze personen aanwezig.').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_naam_huurder.shortLabel).should('be.visible');
      cy.contains('Ja, dat is Vesemir').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_huurder_woont.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_huurder_woont.answers.ander_adres).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.shortLabel).should('be.visible');
      cy.contains('Kaer Morhen').should('be.visible');

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
      localStorage.setItem('accessToken', Cypress.env('token'));
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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Noord').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'NDSM-plein 78').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1033WB Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Onderhuur en adreskwaliteit (WON)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Wonen').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
