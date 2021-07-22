// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { CHANGE_STATUS } from '../../support/selectorsSignalDetails';
import { MAIL, FEEDBACK_FORM } from '../../support/selectorsReactieMelder';
import { REACTIE_MELDER } from '../../support/texts';
import { DJANGO } from '../../support/selectorsDjangoAdmin';
import * as requests from '../../support/commandsRequests';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as djangoAdmin from '../../support/commandsDjangoAdmin';
import * as general from '../../support/commandsGeneral';

describe('Reactie Melder', () => {
  describe('Set up mail template in Django Admin', () => {
    before(() => {
      cy.visit(`${Cypress.env('backendUrl')}/signals/admin`);
    });
    it('Add mail template', () => {
      cy.get(DJANGO.inputUsername).type('signals.admin@example.com');
      cy.get(DJANGO.inputPassword).type('password');
      cy.contains('Aanmelden').click();
      cy.get(DJANGO.linkEmailTemplate).eq(1).click();

      djangoAdmin.checkAndAddTemplate('Send mail signal reaction requested', REACTIE_MELDER.bodyMailTemplate,);
      cy.get(DJANGO.linkLogout).click();
    });
  });
  describe('Set up testdata', () => {
    before(() => {
      requests.createSignalKTO();
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.getManageSignalsRoutes();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });
    it('Change status of the signal to reactie gevraagd', () => {
      createSignal.openCreatedSignal();
      createSignal.changeSignalStatus('Gemeld', 'Reactie gevraagd', CHANGE_STATUS.radioButtonReactieGevraagd);
    });
  });
  describe('Open mail and fetch link', () => {
    it('Open mail', () => {
      cy.intercept('/api/v1/messages/*').as('getMail');
      cy.visit(`${Cypress.env('mailUrl')}`);
      cy.get(MAIL.lastMail).click();
      cy.wait('@getMail');
      general.getIframeBody().find('a').eq(0).should('have.text', 'Stuur reactie').then(link => {
        const linkText = link.prop('href') as string;
        const reactieLink = linkText.slice(18);
        cy.writeFile('./cypress/fixtures/tempReactie.json', { reactieLink: `${reactieLink}` }, { flag: 'w' });
      });
    });
  });
  describe('Open Reactie form satisfied customer', () => {
    it('Input reactie form', () => {
      cy.readFile('./cypress/fixtures/tempReactie.json').then(json => {
        cy.visit(`${json.reactieLink}`);
      });
      cy.get(FEEDBACK_FORM.inputText).type('Bij deze wat aangevulde informatie.')
      cy.contains('Toeterlichting').should('be.visible');
      cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
        cy.contains(`SIA-${json.signalId}`).should('be.visible');
      });
      cy.contains('Versturen').click()
    });
    it.skip('Reactie send form again', () => {
      cy.readFile('./cypress/fixtures/tempReactie.json').then(json => {
        cy.visit(`${json.reactieLink}`);
        // Assert feedback already given
      });
    });
  });
});
