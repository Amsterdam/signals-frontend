// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_WONINGDELEN } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';

describe('Create signal wonen woning delen and check signal details', () => {
  describe('Create signal wonen woning delen', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wonenWoningDelen.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1014DD 1', 'Klönne plein 1, 1014DD Amsterdam');
      createSignal.setDescription('In deze woning lijken meerdere vage figuren te wonen');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Input specific information
      cy.contains(questions.wonen.extra_wonen_woningdelen_vermoeden.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_vermoeden.subtitle).should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputWatSpeeltZichAf).eq(0).type('Ik vermoed tovenarij');

      cy.contains(questions.wonen.extra_wonen_woningdelen_eigenaar.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputEigenaar).eq(1).type('Ja, dat weet ik.');

      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.subtitle).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaZelfde).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaAnder).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woningdelen_aantal_personen.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen1).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen3).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen2).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen4).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonenWeetNiet).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.be.visible');
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
      cy.contains('Tijdstip').should('be.visible');

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_vermoeden.shortLabel).should('be.visible');
      cy.contains('Ik vermoed tovenarij').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_eigenaar.shortLabel).should('be.visible');
      cy.contains('Ja, dat weet ik.').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.answers.ander_adres).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_aantal_personen.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_aantal_personen.answers.vijf_of_meer_personen).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.answers.nee).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_samenwonen.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_samenwonen.answers.nee).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_wisselende_bewoners.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_wisselende_bewoners.answers.ja).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_iemand_aanwezig.shortLabel).should('be.visible');
      cy.contains('Voornamelijk op de dinsdagen om 23:23:05').should('be.visible');

      cy.get(CREATE_SIGNAL.checkBoxSharingAllowed).check().should('be.checked');

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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: West').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Klönne plein 1').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1014DD Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Ja').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Woningdelen / spookburgers (WON)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Wonen').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
