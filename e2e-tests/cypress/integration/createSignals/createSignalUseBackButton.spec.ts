import { LANTAARNPAAL } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';
import signal01 from '../../fixtures/signals/signalForUseBackButton01.json';
import signal02 from '../../fixtures/signals/signalForUseBackButton02.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Create signal and use back button to create a new one, data should not be mixed', () => {
  describe('Create a signal and use back button to create new one', () => {
    before(() => {
      routes.postSignalRoutePublic();
      routes.getOpenbareVerlichtingRoute();
      routes.stubPreviewMap();
      routes.stubMap();
      cy.intercept('GET', '/locatieserver/v3/**1012XA%2012', { fixture: 'addresses/asbest.json' }).as('getAddress02');

      const responses = [];
      cy.fixture('predictions/lantaarnpaal.json').then((fixture: string) => {
        // stub prediction service first signal
        responses.push({ body: fixture });
      });

      cy.fixture('predictions/asbest.json').then((fixture: string) => {
        // stub prediction service second signal
        responses.push({ body: fixture });
      });

      cy.intercept('POST', '**/prediction', req => {
        const body = responses.shift() as string;
        req.reply(body);
      });

      cy.visit('incident/beschrijf');
    });

    it('Should create 2 signals', () => {
      createSignal.setAddress(signal01);
      createSignal.setDescription(signal01.text);
      createSignal.setDateTime(signal01.time);

      cy.contains('Volgende').click();

      cy.get(LANTAARNPAAL.radioButtonProbleemDoetNiet).check({ force: true }).should('be.checked');
      cy.get(LANTAARNPAAL.radioButtonNietGevaarlijk).check({ force: true }).should('be.checked');
      cy.wait('@getOpenbareVerlichting');
      cy.get(LANTAARNPAAL.checkBoxNietOpKaart).check().should('be.checked');
      cy.get(LANTAARNPAAL.inputLampNummer1).type('888.99');
      cy.contains('Volgende').click();

      createSignal.setPhonenumber(signal01);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(signal01);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(signal01);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

      createSignal.checkThanksPage();

      // Go back to homepage
      cy.go(-5);
      createSignal.setAddress(signal02);
      createSignal.setDescription(signal02.text);
      createSignal.setDateTime(signal02.time);

      cy.contains('Volgende').click();
      createSignal.setPhonenumber(signal02);
      cy.contains('Volgende').click();
      createSignal.setEmailAddress(signal02);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(signal02);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

      createSignal.checkThanksPage();
      createSignal.saveSignalId();
    });
  });
  describe('Check the data from the second signal', () => {
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

      createSignal.checkAllDetails(signal02);
    });
  });
});
