// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_WONINGDELEN } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Create signal wonen woning delen and check signal details', () => {
  describe('Create signal wonen woning delen', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
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
      cy.contains('Weet u wat zich in deze woning afspeelt?').should('be.visible');
      cy.contains('Vermoedens over bijvoorbeeld illegale activiteiten').should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputWatSpeeltZichAf)
        .eq(0)
        .type('Ik vermoed tovenarij');

      cy.contains('Weet u wie de eigenaar is van de woning?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputEigenaar)
        .eq(1)
        .type('Ja, dat weet ik.');

      cy.contains('Weet u waar de officiële huurder woont?').should('be.visible');
      cy.contains('De persoon die in de woning zou moeten wonen').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaZelfde)
        .check()
        .should('be.checked');
      cy.contains('Wat is het adres waar de officiële huurder woont?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderNee)
        .check()
        .should('be.checked');
      cy.contains('Wat is het adres waar de officiële huurder woont?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaAnder)
        .check()
        .should('be.checked');

      cy.contains('Hoeveel personen wonen op dit adres?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen1)
        .check()
        .should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen3)
        .check()
        .should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen2)
        .check()
        .should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen4)
        .check()
        .should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonenWeetNiet)
        .check()
        .should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen5)
        .check()
        .should('be.checked');

      cy.contains('Zijn de bewoners familie van elkaar?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieWeetNiet)
        .check()
        .should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieJa)
        .check()
        .should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieNee)
        .check()
        .should('be.checked');

      cy.contains('Zijn de personen tegelijk op het adres komen wonen?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkWeetNiet)
        .check()
        .should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkJa)
        .check()
        .should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkNee)
        .check()
        .should('be.checked');

      cy.contains('Komen er vaak andere bewoners op het adres wonen?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersWeetNiet)
        .check()
        .should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersNee)
        .check()
        .should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersJa)
        .check()
        .should('be.checked');

      cy.contains('Op welke dag/tijd is er iemand op het adres?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputTijdstip)
        .eq(2)
        .type('Voornamelijk op de dinsdagen om 23:23:05');

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
      cy.contains('Tijdstip').should('be.visible');

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains('Vermoeden').should('be.visible');
      cy.contains('Ik vermoed tovenarij').should('be.visible');
      cy.contains('Naam eigenaar').should('be.visible');
      cy.contains('Ja, dat weet ik.').should('be.visible');
      cy.contains('Adres huurder').should('be.visible');
      cy.contains('Ja, op een ander adres dan de bewoners').should('be.visible');
      cy.contains('Aantal personen').should('be.visible');
      cy.contains('5 of meer personen').should('be.visible');
      cy.contains('Bewoners familie').should('be.visible');
      cy.contains('Nee, de bewoners zijn geen familie').should('be.visible');
      cy.contains('Samenwonen').should('be.visible');
      cy.contains('Nee, ze zijn op verschillende momenten op het adres komen wonen').should('be.visible');
      cy.contains('Wisselende bewoners').should('be.visible');
      cy.contains('Ja, vaak andere bewoners op het adres').should('be.visible');
      cy.contains('Iemand aanwezig').should('be.visible');
      cy.contains('Voornamelijk op de dinsdagen om 23:23:05').should('be.visible');

      cy.get(CREATE_SIGNAL.checkBoxSharingAllowed)
        .check()
        .should('be.checked');

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
        .should('have.text', 'Stadsdeel: West')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet)
        .should('have.text', 'Klönne plein 1')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity)
        .should('have.text', '1014DD Amsterdam')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.email)
        .should('have.text', '')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber)
        .should('have.text', '')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails)
        .should('have.text', 'Ja')
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
        .should('have.text', 'Woningdelen / spookburgers (WON)')
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
