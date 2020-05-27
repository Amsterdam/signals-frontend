// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_VAKANTIEVERHUUR } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Create signal wonen vakantie verhuur and check signal details',() => {
  describe('Create signal wonen vakantie verhuur',() => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wonenVakantieVerhuur.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1018GX 1','Prof. Tulpplein 1, 1018GX Amsterdam');
      createSignal.setDescription('Ik zie regelmatig toeristen met rolkoffers in dit gebouw naar binnen gaan. Volgens mij wordt het illegaal verhuurd.');
      createSignal.setDateTime('Nu');

      cy.clickButton('Volgende');
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains('Ik zie regelmatig toeristen met rolkoffers in dit gebouw naar binnen gaan. Volgens mij wordt het illegaal verhuurd.').should('be.visible');
      
      // Check if field is mandatory
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.errorList).should('contain', 'Dit is een verplicht veld').and('be.visible');
      
      // Input specific information
      cy.contains('Zijn de toeristen nu aanwezig in de woning?').should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenNee).check().should('be.checked');
      cy.contains('In dit geval kunt u het beste telefonisch contact opnemen. Wij pakken uw melding direct op.').should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenWeetIkNiet).check().should('be.checked');
      cy.contains('In dit geval kunt u het beste telefonisch contact opnemen. Wij pakken uw melding direct op.').should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenJa).check().should('be.checked');
      cy.contains('In dit geval kunt u het beste telefonisch contact opnemen. Wij pakken uw melding direct op.').should('be.visible');
     
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonVerderTelefonisch).check().should('be.checked');
      cy.contains('Bel nu met 14 020').should('be.visible');
      cy.contains('Vraag naar team Vakantieverhuur. U wordt direct doorverbonden met een medewerker. Handhaving gaat, indien mogelijk, meteen langs.').should('be.visible');

      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonVerderMeldformulier).check().should('be.checked');
      cy.contains('Bel nu met 14 020').should('not.be.visible');
      cy.contains('Vraag naar team Vakantieverhuur. U wordt direct doorverbonden met een medewerker. Handhaving gaat, indien mogelijk, meteen langs.').should('not.be.visible');
      cy.contains('Ziet u in de toekomst dat er toeristen in de woning aanwezig zijn, bel dan direct met 14 020 en vraag naar team Vakantieverhuur.').should('be.visible');

      cy.contains('Hoeveel toeristen zijn er meestal in de woning?').should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeveelVierOfMinder).check().should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeveelVijfOfMeer).check().should('be.checked');
      cy.contains('Heeft u vaker toeristen in de woning gezien?').should('be.visible');
      cy.contains('Is dit meestal in het weekend of doordeweeks?').should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakEersteKeer).check().should('be.checked');
      cy.contains('Is dit meestal in het weekend of doordeweeks?').should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakWekelijks).check().should('be.checked');
      cy.contains('Is dit meestal in het weekend of doordeweeks?').should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakDagelijks).check().should('be.checked');
      cy.contains('Is dit meestal in het weekend of doordeweeks?').should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakMaandelijks).check().should('be.checked');
      
      cy.contains('Is dit meestal in het weekend of doordeweeks?').should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerWeekend).check().should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerDoordeweeks).check().should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerWisselend).check().should('be.checked');

      cy.contains('Weet u of er iemand op het adres woont?').should('be.visible');
      cy.contains('De persoon die langdurig de woning bewoont').should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningWeetIkNiet).check().should('be.checked');
      cy.contains('Wat is de naam van de persoon die op het adres woont?').should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningNee).check().should('be.checked');
      cy.contains('Wat is de naam van de persoon die op het adres woont?').should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningJa).check().should('be.checked');
      
      cy.contains('Wat is de naam van de persoon die op het adres woont?').should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.inputBewoner).eq(0).type('Gijsbrecht van Aemstel');

      cy.contains('Weet u of de woning op internet wordt aangeboden voor verhuur?').should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonOnlineNee).check().should('be.checked');
      cy.contains('Link naar de advertentie van de woning').should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonOnlineJa).check().should('be.checked');
      cy.contains('Link naar de advertentie van de woning').should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.inputLink).eq(1).type('https://amsterdam.intercontinental.com/nl/');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      createSignal.setPhonenumber('');
      cy.contains('Volgende').click();
      createSignal.setEmailAddress('');
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.server();
      cy.postSignalRoutePublic();

      createSignal.checkSummaryPage();

      // Check information provided by user
      cy.contains('Prof. Tulpplein 1, 1018GX Amsterdam').should('be.visible');
      cy.contains('Ik zie regelmatig toeristen met rolkoffers in dit gebouw naar binnen gaan. Volgens mij wordt het illegaal verhuurd.').should('be.visible');

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains('Toeristen aanwezig').should('be.visible');
      cy.contains('Ja, er zijn nu toeristen aanwezig').should('be.visible');
      cy.contains('Bellen of meldingsformulier').should('be.visible');
      cy.contains('Ik ga verder met dit meldformulier').should('be.visible');
      cy.contains('Aantal personen').should('be.visible');
      cy.contains('5 of meer personen').should('be.visible');
      cy.contains('Hoe vaak').should('be.visible');
      cy.contains('Ongeveer één keer per maand').should('be.visible');
      cy.contains('Wanneer').should('be.visible');
      cy.contains('Wisselend').should('be.visible');
      cy.contains('Bewoning').should('be.visible');
      cy.contains('Ja, er woont iemand op het adres').should('be.visible');
      cy.contains('Naam bewoner').should('be.visible');
      cy.contains('Gijsbrecht van Aemstel').should('be.visible');
      cy.contains('Online aangeboden').should('be.visible');
      cy.contains('Ja, ik heb de woning op internet gezien').should('be.visible');
      cy.contains('Link advertentie').should('be.visible');
      cy.contains('https://amsterdam.intercontinental.com/nl/').should('be.visible');

      cy.clickButton('Verstuur');
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
      localStorage.setItem('accessToken', (Cypress.env('token')));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutes();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });
  
    it('Should show the signal details', () => {
      cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();

      cy.contains('Ik zie regelmatig toeristen met rolkoffers in dit gebouw naar binnen gaan. Volgens mij wordt het illegaal verhuurd.');
    
      // Check if map and marker are visible
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

      // Check signal data
      cy.get(SIGNAL_DETAILS.stadsdeel).contains('Stadsdeel: ').and('contain', 'Centrum').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).contains('Prof. Tulpplein').and('contain', '1').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).contains('1018GX').and('contain', 'Amsterdam').should('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('be.visible');

      // Check if status is 'gemeld' with red coloured text
      cy.get(SIGNAL_DETAILS.status).contains('Gemeld').should('be.visible').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });
      
      createSignal.checkCreationDate();

      cy.get(SIGNAL_DETAILS.urgency).contains('Normaal').should('be.visible');
      cy.get(SIGNAL_DETAILS.type).contains('Melding').should('be.visible');
      cy.contains('Vakantieverhuur').should('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).contains('Wonen').should('be.visible');
      cy.get(SIGNAL_DETAILS.department).contains('WON').should('be.visible');
      cy.get(SIGNAL_DETAILS.source).contains('online').should('be.visible');
    });
  });
});
