// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL, WONEN_VAKANTIEVERHUUR } from '../../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

describe('Create signal wonen vakantie verhuur and check signal details', () => {
  describe('Create signal wonen vakantie verhuur', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:predictions/wonenVakantieVerhuur.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1018GX 1', 'Prof. Tulpplein 1, 1018GX Amsterdam');
      createSignal.setDescription(
        'Ik zie regelmatig toeristen met rolkoffers in dit gebouw naar binnen gaan. Volgens mij wordt het illegaal verhuurd.',
      );
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      const warningPhone = questions.wonen.extra_wonen_vakantieverhuur_bellen_of_formulier.label;
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Check if field is mandatory
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains(questions.wonen.extra_wonen_vakantieverhuur_toeristen_aanwezig.label)
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      // Input specific information
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_toeristen_aanwezig.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenNee).check({ force: true }).should('be.checked');
      cy.contains(warningPhone).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenWeetIkNiet).check({ force: true }).should('be.checked');
      cy.contains(warningPhone).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonToeristenJa).check({ force: true }).should('be.checked');
      cy.contains(warningPhone).should('be.visible');

      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonVerderTelefonisch).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bellen.answers1).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bellen.answers2).should('be.visible');

      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonVerderMeldformulier).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bellen.answers1).should('not.be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bellen.answers2).should('not.be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_footer.answers).should('be.visible');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_aantal_mensen.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeveelVierOfMinder).check({ force: true }).should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeveelVijfOfMeer).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_hoe_vaak.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakEersteKeer).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakWekelijks).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakDagelijks).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonHoeVaakMaandelijks).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerWeekend).check({ force: true }).should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerDoordeweeks).check({ force: true }).should('be.checked');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonWanneerWisselend).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bewoning.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bewoning.subtitle).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningWeetIkNiet).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_naam_bewoner.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_naam_bewoner.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonBewoningJa).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_naam_bewoner.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.inputBewoner).eq(0).type('Gijsbrecht van Aemstel');

      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_online_aangeboden.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonOnlineNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_link_advertentie.label).should('not.be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.radioButtonOnlineJa).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_link_advertentie.label).should('be.visible');
      cy.get(WONEN_VAKANTIEVERHUUR.inputLink).eq(1).type('https://amsterdam.intercontinental.com/nl/');

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
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.contains('Aanvullende informatie').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_toeristen_aanwezig.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_toeristen_aanwezig.answers.ja).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bellen_of_formulier.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bellen_of_formulier.answers.formulier).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_aantal_mensen.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_aantal_mensen.answers.vijf_of_meer).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_hoe_vaak.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_hoe_vaak.answers.maandelijks).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_wanneer.answers.wisselend).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bewoning.shortLabel).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_bewoning.answers.ja).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_naam_bewoner.shortLabel).should('be.visible');
      cy.contains('Gijsbrecht van Aemstel').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_online_aangeboden.shortLabel).should('be.visible');
      cy.contains('Ja, ik heb de woning op internet gezien').should('be.visible');
      cy.contains(questions.wonen.extra_wonen_vakantieverhuur_link_advertentie.shortLabel).should('be.visible');
      cy.contains('https://amsterdam.intercontinental.com/nl/').should('be.visible');

      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.be.visible');
    });

    it('Should show the last screen', () => {
      createSignal.checkThanksPage();
      // Capture signal id to check details later
      createSignal.getSignalId();
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

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Centrum').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Prof. Tulpplein 1').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1018GX Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Vakantieverhuur (WON)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Wonen').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').and('be.visible');
    });
  });
});
