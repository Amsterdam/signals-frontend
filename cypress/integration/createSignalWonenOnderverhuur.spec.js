// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { WONEN_ONDERVERHUUR } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Create signal wonen onderverhuur and check signal details', () => {
  describe('Create signal wonen onderverhuur', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
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
      cy.contains('Hoeveel personen wonen op dit adres?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen1)
        .check()
        .should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen3)
        .check()
        .should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen2)
        .check()
        .should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen4)
        .check()
        .should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonenWeetNiet)
        .check()
        .should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen5)
        .check()
        .should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('be.visible');

      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieJa)
        .check()
        .should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieNee)
        .check()
        .should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieWeetNiet)
        .check()
        .should('be.checked');

      cy.contains('Wat zijn de namen van de mensen die op dit adres wonen?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputNamen).type('Yennefer en Geralt of Rivia');

      cy.contains('Hoe lang wonen deze mensen al op dit adres?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangWeetNiet)
        .check()
        .should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangMinderZesMaanden)
        .check()
        .should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangLangerZesMaanden)
        .check()
        .should('be.checked');

      cy.contains('Op welke dag/tijd is er iemand op het adres?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputTijdstip)
        .eq(0)
        .type('Elke avond en nacht zijn deze personen aanwezig.');

      cy.contains('Weet u wie de officiële huurder is van de woning?').should('be.visible');
      cy.contains('De persoon die in de woning zou moeten wonen').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputHuurder)
        .eq(1)
        .type('Ja, dat is Vesemir');

      cy.contains('Weet u waar de officiële huurder woont?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderJaZelfde)
        .check()
        .should('be.checked');
      cy.contains('Wat is het adres waar de officiële huurder woont?').should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderNee)
        .check()
        .should('be.checked');
      cy.contains('Wat is het adres waar de officiële huurder woont?').should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderJaAnder)
        .check()
        .should('be.checked');

      cy.contains('Wat is het adres waar de officiële huurder woont?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputAdresHuurder)
        .eq(2)
        .type('Kaer Morhen');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      cy.contains('Volgende').click();
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.server();
      cy.postSignalRoutePublic();

      createSignal.checkSummaryPage();

      // Check information provided by user
      cy.contains('Locatie').should('be.visible');
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains('Beschrijving').should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains('Aantal personen').should('be.visible');
      cy.contains('5 of meer personen').should('be.visible');
      cy.contains('Bewoners familie').should('be.visible');
      cy.contains('Weet ik niet').should('be.visible');
      cy.contains('Naam bewoners').should('be.visible');
      cy.contains('Yennefer en Geralt of Rivia').should('be.visible');
      cy.contains('Woon periode').should('be.visible');
      cy.contains('6 maanden of langer').should('be.visible');
      cy.contains('Iemand aanwezig').should('be.visible');
      cy.contains('Elke avond en nacht zijn deze personen aanwezig.').should('be.visible');
      cy.contains('Naam huurder').should('be.visible');
      cy.contains('Ja, dat is Vesemir').should('be.visible');
      cy.contains('Huurder woont').should('be.visible');
      cy.contains('Ja, op een ander adres').should('be.visible');
      cy.contains('Adres huurder').should('be.visible');
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
      cy.get('[href*="/manage/incident/"]')
        .contains(Cypress.env('signalId'))
        .click();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.get(SIGNAL_DETAILS.stadsdeel)
        .should('have.text', 'Stadsdeel: Noord')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet)
        .should('have.text', 'NDSM-plein 78')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity)
        .should('have.text', '1033WB Amsterdam')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.email)
        .should('have.text', '')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber)
        .should('have.text', '')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails)
        .should('have.text', 'Nee')
        .and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency)
        .should('have.text', 'Normaal')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.type)
        .should('have.text', 'Melding')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory)
        .should('have.text', 'Onderhuur en adreskwaliteit (WON)')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory)
        .should('have.text', 'Wonen')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.source)
        .should('have.text', 'online')
        .and('be.visible');
    });
  });
});
