// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import {
  WONEN_WONINGKWALITEIT,
  WONEN_LEEGSTAND,
  WONEN_ONDERVERHUUR,
  WONEN_OVERIG,
  WONEN_VAKANTIEVERHUUR,
  WONEN_WONINGDELEN,
} from '../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import questions from '../support/questions.json';

describe('Create signal wonen woning overig and check signal details', () => {
  describe('Create signal wonen overig', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:wonenWoningOverig.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1015AB 38G', 'Singel 38G, 1015AB Amsterdam');
      createSignal.setDescription(
        'Ik zie elke dag meerdere poezen lopen over deze boot, het is een vreemde situatie. Zijn dit criminele activiteiten?'
      );
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should show specific questions illegal holiday rental', () => {
      const warningPhone = questions.wonen.extra_wonen_vakantieverhuur_bellen_of_formulier.label;
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains(questions.wonen.wonen_overig.label).should('be.visible');

      // Holiday rental
      cy.get(WONEN_OVERIG.radioButtonToeristischeVerhuur).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_toeristen_aanwezig.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenNee).check().should('be.checked');
      cy.contains(warningPhone).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenWeetIkNiet).check().should('be.checked');
      cy.contains(warningPhone).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenJa).check().should('be.checked');
      cy.contains(warningPhone).should('be.visible');

      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonVerderTelefonisch).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bellen.answers1).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bellen.answers2).should('be.visible');

      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonVerderMeldformulier).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bellen.answers1).should('not.be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bellen.answers2).should('not.be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_footer.answers).should('be.visible');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_aantal_mensen.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeveelVierOfMinder).check().should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeveelVijfOfMeer).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_hoe_vaak.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakEersteKeer).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakWekelijks).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakDagelijks).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakMaandelijks).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerWeekend).check().should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerDoordeweeks).check().should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerWisselend).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bewoning.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bewoning.subtitle).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningWeetIkNiet).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_naam_bewoner.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningNee).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_naam_bewoner.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningJa).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_naam_bewoner.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.inputBewoner).eq(0).type('Gijsbrecht van Aemstel');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_online_aangeboden.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonOnlineNee).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_link_advertentie.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonOnlineJa).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_link_advertentie.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.inputLink).eq(1).type('https://amsterdam.intercontinental.com/nl/');
    });

    it('Should show specific questions illegal rental', () => {
      // Illegal rental
      cy.get(WONEN_OVERIG.radioButtonIllegaleOnderhuur).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_onderhuur_aantal_personen.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen1).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen3).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen2).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen4).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonenWeetNiet).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAantalPersonen5).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_bewoners_familie.label).should('be.visible');

      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieJa).check().should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieNee).check().should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonFamilieWeetNiet).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_onderhuur_naam_bewoners.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputNamen).type('Yennefer en Geralt of Rivia');

      cy.contains(questions.wonen.extra_wonen_onderhuur_woon_periode.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangWeetNiet).check().should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangMinderZesMaanden).check().should('be.checked');
      cy.get(WONEN_ONDERVERHUUR.radioButtonHoeLangLangerZesMaanden).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_onderhuur_iemand_aanwezig.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputTijdstip).eq(0).type('Elke avond en nacht zijn deze personen aanwezig.');

      cy.contains(questions.wonen.extra_wonen_onderhuur_naam_huurder.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_onderhuur_naam_huurder.subtitle).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputHuurder).eq(1).type('Ja, dat is Vesemir');

      cy.contains(questions.wonen.extra_wonen_onderhuur_huurder_woont.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderJaZelfde).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderNee).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.be.visible');
      cy.get(WONEN_ONDERVERHUUR.radioButtonAdresHuurderJaAnder).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('be.visible');
      cy.get(WONEN_ONDERVERHUUR.inputAdresHuurder).eq(2).type('Kaer Morhen');
    });

    it('Should show specific questions vacancy', () => {
      // Vacancy
      cy.get(WONEN_OVERIG.radioButtonLeegstand).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_leegstand_naam_eigenaar.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.inputEigenaar).eq(0).type('A. Hitchcock');

      cy.contains(questions.wonen.extra_wonen_leegstand_periode.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegZesMaandenOfLanger).check().should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegMinderDanZesMaanden).check().should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegPeriodeWeetIkNiet).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_leegstand_woning_gebruik.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktWeetIkNiet).check().should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktNee).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_leegstand_naam_persoon.label).should('not.be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_activiteit_in_woning.label).should('not.be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_iemand_aanwezig.label).should('not.be.visible');

      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktJa).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_leegstand_naam_persoon.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_activiteit_in_woning.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.inputNaam).eq(1).type('J. Aniston');
      cy.get(WONEN_LEEGSTAND.inputWatDoetPersoon).eq(2).type('Deze persoon zit de hele dag te acteren');
      cy.get(WONEN_LEEGSTAND.inputTijdstip).eq(3).type('Vooral in de avond');
    });

    it('Should show specific questions house sharing', () => {
      // House sharing
      cy.get(WONEN_OVERIG.radioButtonWoningdelen).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_vermoeden.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_vermoeden.subtitle).should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputWatSpeeltZichAf).eq(0).type('Ik vermoed tovenarij');

      cy.contains(questions.wonen.extra_wonen_woningdelen_eigenaar.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputEigenaar).eq(1).type('Ja, dat weet ik.');

      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.subtitle).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaZelfde).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderNee).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaAnder).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woningdelen_aantal_personen.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen1).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen3).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen2).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen4).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonenWeetNiet).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen5).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieJa).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieNee).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woningdelen_samenwonen.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkJa).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkNee).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woningdelen_wisselende_bewoners.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersNee).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersJa).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woningdelen_iemand_aanwezig.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputTijdstip).eq(2).type('Voornamelijk op de dinsdagen om 23:23:05');
    });

    it('Should show specific questions house quality', () => {
      // House quality
      cy.get(WONEN_OVERIG.radioButtonAchterstalligOnderhoud).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonGevaarJa).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar_alert.answers)
        .should('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });
      cy.get(WONEN_WONINGKWALITEIT.radioButtonGevaarNee).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_gemeld_bij_eigenaar.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonKlachtGemeldNee).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar_ja.answers).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonKlachtGemeldJa).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_direct_gevaar_ja.answers).should('not.be.visible');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_bewoner.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonBewonerJa).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_namens_bewoner.label).should('not.be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonBewonerNee).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_namens_bewoner.label).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonNamensBewonerJa).check().should('be.checked');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonNamensBewonerNee).check().should('be.checked');

      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact.subtitle).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonContactJa).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact_ja.answers).should('be.visible');
      cy.get(WONEN_WONINGKWALITEIT.radioButtonContactNee).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_toestemming_contact_ja.answers).should('not.be.visible');
      cy.contains(questions.wonen.extra_wonen_woonkwaliteit_geen_contact.label).should('be.visible');

      cy.get(WONEN_WONINGKWALITEIT.inputGeenContact).type('Vertel ik liever niet');
    });

    it('Should show specific questions criminal', () => {
      // Criminal
      cy.get(WONEN_OVERIG.radioButtonCrimineleBewoning).check().should('be.checked');
      cy.get(WONEN_OVERIG.radioButtonWoningdelen).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_vermoeden.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_vermoeden.subtitle).should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputWatSpeeltZichAf).eq(0).type('Ik vermoed iets met katten');
      cy.contains(questions.wonen.extra_wonen_woningdelen_eigenaar.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputEigenaar).eq(1).type('Ja, dat weet ik wel.');
      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.subtitle).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaZelfde).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderNee).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_onderhuur_adres_huurder.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAdresHuurderJaAnder).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_aantal_personen.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen1).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen3).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen2).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen5).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonenWeetNiet).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('not.be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAantalPersonen4).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieNee).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonFamilieJa).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_samenwonen.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkNee).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonTegelijkJa).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_wisselende_bewoners.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersWeetNiet).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersJa).check().should('be.checked');
      cy.get(WONEN_WONINGDELEN.radioButtonAndereBewonersNee).check().should('be.checked');
      cy.contains(questions.wonen.extra_wonen_woningdelen_iemand_aanwezig.label).should('be.visible');
      cy.get(WONEN_WONINGDELEN.inputTijdstip).eq(2).type('Elke dag is er wel iemand anders');
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
      cy.contains('Ik vermoed iets met katten').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_eigenaar.shortLabel).should('be.visible');
      cy.contains('Ja, dat weet ik wel.').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_adres_huurder.answers.ander_adres).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_aantal_personen.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_aantal_personen.answers.vier_personen).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_bewoners_familie.answers.ja).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_samenwonen.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_samenwonen.answers.ja).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_wisselende_bewoners.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_wisselende_bewoners.answers.nee).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_woningdelen_iemand_aanwezig.shortLabel).should('be.visible');
      cy.contains('Elke dag is er wel iemand anders').should('be.visible');

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

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Centrum').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Singel 38G').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1015AB Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Overige Wonen (WON)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Wonen').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
