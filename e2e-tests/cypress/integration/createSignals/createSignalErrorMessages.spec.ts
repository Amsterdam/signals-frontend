// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { CREATE_SIGNAL } from '../../support/selectorsCreateSignal';
import { ERROR_MESSAGES } from '../../support/texts';
import signal from '../../fixtures/signals/afval.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Check field validations when creating a signal', () => {
  before(() => {
    routes.postSignalRoutePublic();
    routes.stubPreviewMap();
    routes.stubMap();
    cy.visit('incident/beschrijf');
  });

  it('Should create the signal and check field validations', () => {
    cy.contains('Volgende').click();

    cy.get(CREATE_SIGNAL.errorLocation).should('have.text', ERROR_MESSAGES.location).and('be.visible').and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });
    cy.get(CREATE_SIGNAL.errorDescription).should('have.text', ERROR_MESSAGES.mandatoryField).and('be.visible').and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });
    cy.get(CREATE_SIGNAL.errorDateTime).should('have.text', ERROR_MESSAGES.mandatoryField).and('be.visible').and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });
    createSignal.setDescriptionPage(signal);

    cy.contains('Volgende').click();
    createSignal.setPhonenumber(signal);
    cy.contains('Volgende').click();
    cy.get(CREATE_SIGNAL.inputEmail).clear().type('email@');
    cy.contains('Volgende').click();
    cy.get(CREATE_SIGNAL.errorMail).should('have.text', ERROR_MESSAGES.email).and('be.visible').and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });
    createSignal.setEmailAddress(signal);
    cy.contains(ERROR_MESSAGES.mandatoryField).should('not.exist');

    cy.contains('Volgende').click();
    createSignal.checkSummaryPage(signal);
  });
});
