// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { CHANGE_STATUS } from '../../support/selectorsSignalDetails';
import { KTO_FORM, MAIL } from '../../support/selectorsKTO';
import { ERROR_MESSAGES, KTO } from '../../support/texts';
import * as requests from '../../support/commandsRequests';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as general from '../../support/commandsGeneral';

describe('KTO form', () => {
  describe('Set up testdata', () => {
    before(() => {
      requests.createSignalKTO();
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.getManageSignalsRoutes();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });
    it('Change status of the signal to afgehandeld', () => {
      createSignal.openCreatedSignal();
      createSignal.changeSignalStatus('Gemeld', 'Afgehandeld', CHANGE_STATUS.radioButtonAfgehandeld);
    });
  });
  describe('Open mail and fetch KTO link', () => {
    it('Open mail', () => {
      cy.intercept('/api/v1/messages/*').as('getMail');
      cy.visit(`${Cypress.env('mailUrl')}`);
      cy.get(MAIL.lastMail).click();
      cy.wait('@getMail');
      general.getIframeBody().find('a').eq(1).should('have.text', 'Nee, ik ben niet tevreden.').then(link => {
        const linkText = link.prop('href') as string;
        const ktoLink = linkText.slice(22);
        cy.writeFile('./cypress/fixtures/tempKTO.json', { ktoLink: `${ktoLink}` }, { flag: 'w' });
      });
    });
  });
  describe('Open KTO form dissatisfied customer', () => {
    it('KTO satisfied send form', () => {
      cy.intercept('PUT', '/signals/v1/public/feedback/forms/*').as('putFeedback');
      cy.readFile('./cypress/fixtures/tempKTO.json').then(json => {
        cy.visit(`${json.ktoLink}`);
      });
      general.checkHeaderText(KTO.formTitleOnTevreden);
      cy.get(KTO_FORM.questionLabel).eq(0).should('have.text', KTO.questionWaaromOntevreden).and('be.visible');
      cy.get(KTO_FORM.subtitleQuestion).should('have.text', KTO.subtitleQuestionTevreden);
      cy.get(KTO_FORM.questionLabel).eq(1).should('have.text', KTO.questionVermelden).and('be.visible');
      cy.get(KTO_FORM.questionLabel).eq(2).should('have.text', KTO.questionContact).and('be.visible');

      cy.contains('Verstuur').click();
      cy.get(KTO_FORM.errorMessage).contains(ERROR_MESSAGES.mandatoryFieldKTO).should('have.length', 1).and('be.visible');

      cy.get(KTO_FORM.radioButtonOntevredenTeLang).check({ force: true }).should('be.checked');
      cy.get(KTO_FORM.radioButtonOntevredenContactSlecht).check({ force: true }).should('be.checked');
      cy.get(KTO_FORM.inputAnders).should('not.exist');
      cy.get(KTO_FORM.radioButtonOntevredenNietSerieus).check({ force: true }).should('be.checked');
      cy.get(KTO_FORM.radioButtonOntevredenNietsGedaan).check({ force: true }).should('be.checked');
      cy.get(KTO_FORM.radioButtonOntevredenOnvoldoendeInfo).check({ force: true }).should('be.checked');
      cy.get(KTO_FORM.radioButtonOntevredenOplossingVolstaatNiet).check({ force: true }).should('be.checked');
      cy.get(KTO_FORM.radioButtonOntevredenAnders).check({ force: true }).should('be.checked');

      cy.get(KTO_FORM.inputAnders).should('be.visible');
      cy.contains('Verstuur').click();
      cy.get(KTO_FORM.errorMessage).contains(ERROR_MESSAGES.mandatoryFieldKTO).should('have.length', 1).and('be.visible');

      cy.get(KTO_FORM.inputAnders).type('Het was weer anders dan anders.');
      cy.get(KTO_FORM.inputVermelden).type('Ik wil vermelden dat ik weer niks heb toe te lichten.');
      cy.get(KTO_FORM.checkboxContact).check().should('be.checked');
      cy.contains('Verstuur').click();
      cy.wait('@putFeedback');

      general.checkHeaderText(KTO.formTitleBedankt);
      cy.contains(KTO.textBedankt).should('be.visible');
    });
    it('KTO send form again', () => {
      cy.readFile('./cypress/fixtures/tempKTO.json').then(json => {
        cy.visit(`${json.ktoLink}`);
      });
      general.checkHeaderText(KTO.formTitelIsAlFeedback);
      cy.contains(KTO.textNogmaalsBedankt).should('be.visible');
    });
  });
});
