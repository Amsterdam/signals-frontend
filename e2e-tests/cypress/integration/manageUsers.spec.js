// <reference types="Cypress" />
import { USERS } from '../support/selectorsSettings';
import { generateToken } from '../support/jwt';

describe('Manage users', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
  });

  it('Should open the manage users screen', () => {
    cy.server();
    cy.getManageSignalsRoutes();
    cy.route('/signals/v1/private/users/*').as('getUser');
    cy.visitFetch('/manage/incidents/');
    cy.waitForManageSignalsRoutes();

    cy.openMenu();
    cy.contains('Instellingen').click();
    cy.contains('Gebruikers').click();
    cy.wait('@getUser');
    cy.get('[aria-label="Menu"]').click();

    cy.url().should('include', '/instellingen/gebruikers/page/1');
  });

  // This test case can be executed when we start every test with a clean database
  it.skip('Should add a user', () => {
    cy.get(USERS.inputMail).type('sia@fakemail.nl');
    cy.get(USERS.inputVoornaam).type('Simon');
    cy.get(USERS.inputAchternaam).type('Ia');
    cy.contains('div', 'GGD')
      .find('input')
      .check();
    cy.get(USERS.inputNotitie).type('Dit is de belangrijkste gebruiker van SIA, let op!');
    cy.get(USERS.buttonOpslaan).click();
  });
  it('Should change a user and show history', () => {
    const randomNumber = Math.random();
    cy.server();
    cy.route('/signals/v1/private/users/*').as('getUser');
    cy.route('PATCH', '/signals/v1/private/users/*').as('patchUser');
    cy.get(USERS.userRow)
      .eq(0)
      .click();
    cy.wait('@getUser');
    cy.get(USERS.inputVoornaam).clear().type('Test');
    cy.get(USERS.inputAchternaam).clear().type('Cees');
    // Type a random number, because when you run this test multiple times, noting changes. If nothing changes you can't save.
    cy.get(USERS.inputNotitie).clear().type(randomNumber);
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
    cy.server();
    cy.route('/signals/v1/private/users/*').as('getUser');
    cy.route('PATCH', '/signals/v1/private/users/*').as('patchUser');
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
    cy.server();
    cy.getManageSignalsRoutes();
    cy.route('/signals/v1/private/users/*').as('getUser');
    cy.route('PATCH', '/signals/v1/private/users/*').as('patchUser');
    cy.visitFetch('/manage/incidents/');
    cy.waitForManageSignalsRoutes();

    cy.openMenu();
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
