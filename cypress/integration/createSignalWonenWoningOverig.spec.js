// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_WONINGKWALITEIT, WONEN_LEEGSTAND, WONEN_ONDERVERHUUR, WONEN_OVERIG, WONEN_VAKANTIEVERHUUR, WONEN_WONINGDELEN } from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

describe('Create signal wonen woning delen and check signal details',() => {
  describe('Create signal wonen overig',() => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wonenWoningOverig.json').as('prediction');
      createSignal.checkDescriptionPage();
      createSignal.setAddress('1015AB 38G','Singel 38G, 1015AB Amsterdam');
      createSignal.setDescription('Ik zie elke dag meerdere poezen lopen over deze boot, het is een vreemde situatie. Zijn dit criminele activiteiten?');
      createSignal.setDateTime('Nu');

      cy.clickButton('Volgende');
    });

    it('Should show specific questions illegal holiday rental', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains('Ik zie elke dag meerdere poezen lopen over deze boot, het is een vreemde situatie. Zijn dit criminele activiteiten?').should('be.visible');
      cy.contains('Uw melding gaat over:').should('be.visible');
      
      // Holiday rental
      cy.get(WONEN_OVERIG.radioButtonToeristischeVerhuur).check().should('be.checked');
      cy.contains('Zijn de toeristen nu aanwezig in de woning?').should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenNee).check().should('be.checked') ;
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
      cy.contains('Weet u of er iemand op het adres woont?').should('be.visible');;
      cy.contains('De persoon die langdurig de woning bewoont').should('be.visible');;
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningWeetIkNiet).check().should('be.checked');
      cy.contains('Wat is de naam van de persoon die op het adres woont?').should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningNee).check().should('be.checked');
      cy.contains('Wat is de naam van de persoon die op het adres woont?').should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningJa).check().should('be.checked');
      cy.contains('Wat is de naam van de persoon die op het adres woont?').should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.inputBewoner).eq(0).type('Gijsbrecht van Aemstel');
      cy.contains('Weet u of de woning op internet wordt aangeboden voor verhuur?').should('be.visible');;
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonOnlineNee).check().should('be.checked');
      cy.contains('Link naar de advertentie van de woning').should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonOnlineJa).check().should('be.checked');
      cy.contains('Link naar de advertentie van de woning').should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.inputLink).eq(1).type('https://amsterdam.intercontinental.com/nl/');
    });

    it('Should show specific questions illegal rental', () => {
      // Illegal rental
      cy.get(WONEN_OVERIG.radioButtonIllegaleOnderhuur).check().should('be.checked');
      cy.contains('Hoeveel personen wonen op dit adres?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen1).check().should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen3).check().should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen2).check().should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen4).check().should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonenWeetNiet).check().should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen5).check().should('be.checked');
      cy.contains('Zijn de mensen die op dit adres wonen familie van elkaar?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieJa).check().should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieNee).check().should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieWeetNiet).check().should('be.checked');
      cy.contains('Wat zijn de namen van de mensen die op dit adres wonen?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputNamen).type('Yennefer en Geralt of Rivia');
      cy.contains('Hoe lang wonen deze mensen al op dit adres?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangWeetNiet).check().should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangMinderZesMaanden).check().should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangLangerZesMaanden).check().should('be.checked');
      cy.contains('Op welke dag/tijd is er iemand op het adres?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputTijdstip).eq(0).type('Elke avond en nacht zijn deze personen aanwezig.');
      cy.contains('Weet u wie de officiële huurder is van de woning?').should('be.visible');
      cy.contains('De persoon die in de woning zou moeten wonen').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputHuurder).eq(1).type('Ja, dat is Vesemir');
      cy.contains('Weet u waar de officiële huurder woont?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderJaZelfde).check().should('be.checked');
      cy.contains('Wat is het adres waar de officiële huurder woont?').should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderNee).check().should('be.checked');
      cy.contains('Wat is het adres waar de officiële huurder woont?').should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderJaAnder).check().should('be.checked');
      cy.contains('Wat is het adres waar de officiële huurder woont?').should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputAdresHuurder).eq(2).type('Kaer Morhen');
    });

    it('Should show specific questions vacancy', () => {
      // Vacancy
      cy.get(WONEN_OVERIG.radioButtonLeegstand).check().should('be.checked');
      cy.contains('Weet u wie de eigenaar is van de woning?').should('be.visible');
      cy.get(WONEN_LEEGSTAND.inputEigenaar).eq(0).type('A. Hitchcock');
      cy.contains('Hoe lang staat de woning al leeg?').should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegZesMaandenOfLanger).check().should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegMinderDanZesMaanden).check().should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegPeriodeWeetIkNiet).check().should('be.checked');
      cy.contains('Wordt de woning af en toe nog gebruikt?').should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktWeetIkNiet).check().should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktNee).check().should('be.checked');
      cy.contains('Wat is de naam van de persoon die soms in de woning is?').should('not.be.visible');
      cy.contains('Wat doet deze persoon in de woning?').should('not.be.visible');
      cy.contains('Op welke dag/tijd is deze persoon op het adres?').should('not.be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktJa).check().should('be.checked');
      cy.contains('Wat is de naam van de persoon die soms in de woning is?').should('be.visible');
      cy.contains('Wat doet deze persoon in de woning?').should('be.visible');;
      cy.contains('Op welke dag/tijd is deze persoon op het adres?').should('be.visible');
      cy.get(WONEN_LEEGSTAND.inputNaam).eq(1).type('J. Aniston');
      cy.get(WONEN_LEEGSTAND.inputWatDoetPersoon).eq(2).type('Deze persoon zit de hele dag te acteren');
      cy.get(WONEN_LEEGSTAND.inputTijdstip).eq(3).type('Vooral in de avond');
    });

    it('Should show specific questions house sharing', () => {
      // House sharing
      cy.get(WONEN_OVERIG.radioButtonWoningdelen).check().should('be.checked');
      cy.contains('Weet u wat zich in deze woning afspeelt?').should('be.visible');
      cy.contains('Vermoedens over bijvoorbeeld illegale activiteiten').should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputWatSpeeltZichAf).eq(0).type('Ik vermoed tovenarij');
      cy.contains('Weet u wie de eigenaar is van de woning?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputEigenaar).eq(1).type('Ja, dat weet ik.');
      cy.contains('Weet u waar de officiële huurder woont?').should('be.visible');
      cy.contains('De persoon die in de woning zou moeten wonen').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaZelfde).check().should('be.checked');
      cy.contains('Wat is het adres waar de officiële huurder woont?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderNee).check().should('be.checked');
      cy.contains('Wat is het adres waar de officiële huurder woont?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaAnder).check().should('be.checked');
      cy.contains('Hoeveel personen wonen op dit adres?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen1).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen3).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen2).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen4).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonenWeetNiet).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen5).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieJa).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieNee).check().should('be.checked');
      cy.contains('Zijn de personen tegelijk op het adres komen wonen?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkJa).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkNee).check().should('be.checked');
      cy.contains('Komen er vaak andere bewoners op het adres wonen?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersNee).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersJa).check().should('be.checked');
      cy.contains('Op welke dag/tijd is er iemand op het adres?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputTijdstip).eq(2).type('Voornamelijk op de dinsdagen om 23:23:05');
    });

    it('Should show specific questions house quality', () => {
      // House quality
      cy.get(WONEN_OVERIG.radioButtonAchterstalligOnderhoud).check().should('be.checked');
      cy.contains('Denkt u dat er direct gevaar is?').should('be.visible');
      cy.contains('Bijvoorbeeld: u ruikt een sterke gaslucht of er dreigt een schoorsteen of balkon in te storten').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonGevaarJa).check().should('be.checked');
      cy.contains('Bel 112 en vul dit formulier niet verder in').should('be.visible').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });
      cy.get(WONEN_WONINGKWALITEIT.radioButtonGevaarNee).check().should('be.checked');
      cy.contains('Hebt u de klacht al bij uw verhuurder, eigenaar of VvE gemeld?').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonKlachtGemeldNee).check().should('be.checked');
      cy.contains('Meldt uw klacht eerst bij de verhuurder, eigenaar of VvE. Krijgt u geen antwoord of wordt de klacht niet verholpen, vul dan dit formulier in').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonKlachtGemeldJa).check().should('be.checked');
      cy.contains('Meldt uw klacht eerst bij de verhuurder, eigenaar of VvE. Krijgt u geen antwoord of wordt de klacht niet verholpen, vul dan dit formulier in').should('not.be.visible');
      cy.contains('Bent u zelf bewoner van het adres?').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonBewonerJa).check().should('be.checked');
      cy.contains('Doet u de melding namens de bewoner van het adres?').should('not.be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonBewonerNee).check().should('be.checked');
      cy.contains('Doet u de melding namens de bewoner van het adres?').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonNamensBewonerJa).check().should('be.checked');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonNamensBewonerNee).check().should('be.checked');
      cy.contains('Mogen we contact met u opnemen om een afspraak te maken?').should('be.visible');
      cy.contains('Om uw klacht goed te kunnen behandelen willen we vaak even komen kijken of met u overleggen').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonContactJa).check().should('be.checked');
      cy.contains('Let op! Vul uw telefoonnummer in op de volgende pagina.').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonContactNee).check().should('be.checked');
      cy.contains('Let op! Vul uw telefoonnummer in op de volgende pagina.').should('not.be.visible');
      cy.contains('Waarom heeft u liever geen contact?').should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.inputGeenContact).type('Vertel ik liever niet');
    });

    it('Should show specific questions criminal', () => {
      // Criminal
      cy.get(WONEN_OVERIG.radioButtonCrimineleBewoning).check().should('be.checked');
      cy.get(WONEN_OVERIG.radioButtonWoningdelen).check().should('be.checked');
      cy.contains('Weet u wat zich in deze woning afspeelt?').should('be.visible');
      cy.contains('Vermoedens over bijvoorbeeld illegale activiteiten').should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputWatSpeeltZichAf).eq(0).type('Ik vermoed iets met katten');
      cy.contains('Weet u wie de eigenaar is van de woning?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputEigenaar).eq(1).type('Ja, dat weet ik wel.');
      cy.contains('Weet u waar de officiële huurder woont?').should('be.visible');
      cy.contains('De persoon die in de woning zou moeten wonen').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaZelfde).check().should('be.checked');
      cy.contains('Wat is het adres waar de officiële huurder woont?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderNee).check().should('be.checked');
      cy.contains('Wat is het adres waar de officiële huurder woont?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaAnder).check().should('be.checked');
      cy.contains('Hoeveel personen wonen op dit adres?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen1).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen3).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen2).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen5).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonenWeetNiet).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen4).check().should('be.checked');
      cy.contains('Zijn de bewoners familie van elkaar?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieNee).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieJa).check().should('be.checked');
      cy.contains('Zijn de personen tegelijk op het adres komen wonen?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkNee).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkJa).check().should('be.checked');
      cy.contains('Komen er vaak andere bewoners op het adres wonen?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersJa).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersNee).check().should('be.checked');
      cy.contains('Op welke dag/tijd is er iemand op het adres?').should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputTijdstip).eq(2).type('Elke dag is er wel iemand anders');
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
      cy.contains('Locatie').should('be.visible');
      cy.contains('Singel 38G, 1015AB Amsterdam').should('be.visible');
      cy.contains('Beschrijving').should('be.visible');
      cy.contains('Ik zie elke dag meerdere poezen lopen over deze boot, het is een vreemde situatie. Zijn dit criminele activiteiten?').should('be.visible');
      cy.contains('Tijdstip').should('be.visible');

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains('Vermoeden').should('be.visible');
      cy.contains('Ik vermoed iets met katten').should('be.visible');
      cy.contains('Naam eigenaar').should('be.visible');
      cy.contains('Ja, dat weet ik wel.').should('be.visible');
      cy.contains('Adres huurder').should('be.visible');
      cy.contains('Ja, op een ander adres dan de bewoners').should('be.visible');
      cy.contains('Aantal personen').should('be.visible');
      cy.contains('4 personen').should('be.visible');
      cy.contains('Bewoners familie').should('be.visible');
      cy.contains('Ja, de bewoners zijn familie').should('be.visible');
      cy.contains('Samenwonen').should('be.visible');
      cy.contains('Ja, ze zijn tegelijk op het adres komen wonen').should('be.visible');
      cy.contains('Wisselende bewoners').should('be.visible');
      cy.contains('Nee, dezelfde bewoners').should('be.visible');
      cy.contains('Iemand aanwezig').should('be.visible');
      cy.contains('Elke dag is er wel iemand anders').should('be.visible');

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
      cy.contains('Ik zie elke dag meerdere poezen lopen over deze boot, het is een vreemde situatie. Zijn dit criminele activiteiten?');
    
      // Check if map and marker are visible
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

      // Check signal data
      cy.get(SIGNAL_DETAILS.stadsdeel).contains('Stadsdeel: ').and('contain', 'Centrum').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).contains('Singel').and('contain', '38G').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).contains('1015AB').and('contain', 'Amsterdam').should('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('be.visible');

      // Check if status is 'gemeld' with red coloured text
      cy.get(SIGNAL_DETAILS.status).contains('Gemeld').should('be.visible').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });
      
      createSignal.checkCreationDate();

      cy.get(SIGNAL_DETAILS.urgency).contains('Normaal').should('be.visible');
      cy.get(SIGNAL_DETAILS.type).contains('Melding').should('be.visible');
      cy.contains('Overige Wonen').should('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).contains('Wonen').should('be.visible');
      cy.get(SIGNAL_DETAILS.department).contains('WON').should('be.visible');
      cy.get(SIGNAL_DETAILS.source).contains('online').should('be.visible');
    });
  });
});
