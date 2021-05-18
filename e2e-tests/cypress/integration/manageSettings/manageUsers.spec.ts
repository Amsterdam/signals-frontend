// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { USERS } from '../../support/selectorsSettings';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as general from '../../support/commandsGeneral';

describe('Manage users', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
  });

  it('Should open the manage users screen', () => {
    routes.getManageSignalsRoutes();
    routes.getUserRoute();
    cy.visit('/manage/incidents/');
    routes.waitForManageSignalsRoutes();

    general.openMenu();
    cy.contains('Instellingen').click();
    cy.contains('Gebruikers').click();
    cy.wait('@getUser');
    cy.get('[aria-label="Menu"]').click();

    cy.url().should('include', '/instellingen/gebruikers/page/1');
  });

  it('Should add a user', () => {
    const randomNumber = Math.random();
    cy.contains('Gebruiker toevoegen').click();
    cy.get(USERS.inputMail).type(`z${randomNumber}@fakemail.nl`);
    cy.get(USERS.inputVoornaam).type('Simon');
    cy.get(USERS.inputAchternaam).type('Ia');
    cy.contains('div', 'GGD')
      .find('input')
      .check();
    cy.get(USERS.inputNotitie).type('Dit is de belangrijkste gebruiker van SIA, let op!');
    cy.get(USERS.buttonOpslaan).click();
    cy.contains(`z${randomNumber}@fakemail.nl`).should('be.visible');
  });

  it('Should change a user and show history', () => {
    const randomNumber = Math.random();
    routes.getUserRoute();
    routes.patchUserRoute();
    cy.get(USERS.userRow)
      .eq(0)
      .click();
    cy.wait('@getUser');
    cy.get(USERS.inputVoornaam).clear().type('Test');
    cy.get(USERS.inputAchternaam).clear().type('Cees');
    // Type a random number, because when you run this test multiple times, noting changes. If nothing changes you can't save.
    cy.get(USERS.inputNotitie).clear().type(randomNumber.toString());
    cy.get(USERS.buttonOpslaan).click();
    cy.wait('@patchUser');
    cy.get(USERS.userRow)
      .eq(0)
      .click();
    cy.wait('@getUser');
    cy.get(USERS.historyAction).first().should('have.text', 'Voornaam gewijzigd:\n Test\nAchternaam gewijzigd:\n Cees');
    cy.get(USERS.buttonAnnuleren).click();
  });

  it('Should add a department to a user', () => {
    routes.getUserRoute();
    routes.patchUserRoute();
    cy.get(USERS.userRow)
      .eq(0)
      .click();
    cy.wait('@getUser');
    cy.url().should('match', /\/instellingen\/gebruiker\/\d+/);

    cy.contains('div', 'GGD')
      .find('input')
      .check();
    cy.get(USERS.buttonOpslaan).click();
    cy.wait('@patchUser');
    cy.get(USERS.userRow)
      .eq(0)
      .click();
    cy.contains('div', 'GGD')
      .find('input')
      .should('be.checked');
    cy.contains('div', 'GGD')
      .find('input')
      .uncheck();
    cy.get(USERS.buttonOpslaan).click();
    cy.wait('@patchUser');
    cy.wait('@getUser');
  });

  it('Should add multiple departments to a user', () => {
    routes.getManageSignalsRoutes();
    routes.getUserRoute();
    routes.patchUserRoute();
    cy.visit('/manage/incidents/');
    routes.waitForManageSignalsRoutes();

    general.openMenu();
    cy.contains('Instellingen').click();
    cy.contains('Gebruikers').click();
    cy.get('[aria-label="Menu"]').click();
    cy.wait('@getUser');

    cy.url().should('include', '/instellingen/gebruikers/page/1');

    cy.get(USERS.userRow)
      .eq(0)
      .click();
    cy.url().should('include', '/instellingen/gebruiker/');
    cy.contains('div', 'Omgevingsdienst')
      .find('input')
      .check();
    cy.contains('div', 'Stadswerken')
      .find('input')
      .check();
    cy.get(USERS.buttonOpslaan).click();
    cy.wait('@patchUser');
    cy.get(USERS.userRow)
      .eq(0)
      .click();
    cy.contains('div', 'Omgevingsdienst')
      .find('input')
      .should('be.checked');
    cy.contains('div', 'Stadswerken')
      .find('input')
      .should('be.checked');
    cy.contains('div', 'Omgevingsdienst')
      .find('input')
      .uncheck();
    cy.contains('div', 'Stadswerken')
      .find('input')
      .uncheck();
    cy.get(USERS.buttonOpslaan).click();
    cy.wait('@patchUser');
  });
});
