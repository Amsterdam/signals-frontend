// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL, LANTAARNPAAL } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/lantaarnpaal.json';

describe('Create signal "Lantaarnpaal" and check signal details', () => {
  describe('Create signal lantaarnpaal', () => {
    before(() => {
      cy.postSignalRoutePublic();
      cy.getOpenbareVerlichtingRoute();
      cy.stubPreviewMap();
      cy.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath);

      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Wat is het probleem?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_probleem.label).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemDoetNiet).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemBrandtOverdag).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('not.exist');
      cy.get(LANTAARNPAAL.radioButtonProbleemLichthinder).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('not.exist');
      cy.get(LANTAARNPAAL.radioButtonProbleemVies).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('not.exist');
      cy.get(LANTAARNPAAL.radioButtonProbleemBeschadigd).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonProbleemOverig).check({ force: true }).should('be.checked').and('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting.label).should('be.visible');
      cy.wait('@getOpenbareVerlichting');

      // Check on visibility of the message to make a phone call directly after selecting one of the first four options
      cy.get(LANTAARNPAAL.radioButtonGevaarlijk3OfMeerKapot).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkAanrijding).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkOpGrond).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkDeur).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonGevaarlijkLosseKabels).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('be.visible');
      cy.get(LANTAARNPAAL.radioButtonNietGevaarlijk).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_gevaar.answers).should('not.exist');

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_nummer.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_straatverlichting_nummer.subtitle).should('be.visible');
      // Click on lamp based on coordinate
      createSignal.selectLampOnCoordinate(414, 135);
      cy.contains('Het gaat om lamp of lantaarnpaal met nummer: 034575').should('be.visible');

      // Check options in legend
      cy.get(LANTAARNPAAL.mapSelectLamp).should('be.visible');
      cy.get(LANTAARNPAAL.legendHeader).should('have.text', 'Legenda').and('be.visible');
      cy.get(LANTAARNPAAL.legendContentText).should('be.visible');
      cy.contains('Lantaarnpaal').should('be.visible');
      cy.contains('Grachtmast').should('be.visible');
      cy.contains('Lamp aan kabel').should('be.visible');
      cy.contains('Lamp aan gevel').should('be.visible');
      cy.contains('Schijnwerper').should('be.visible');
      cy.contains('Overig lichtpunt').should('be.visible');

      cy.contains('Volgende').click();

      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(fixturePath);
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
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      cy.stubPreviewMap();
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(fixturePath);
    });
  });
});
