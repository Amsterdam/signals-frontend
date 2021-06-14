// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { ROLES } from '../../support/selectorsSettings';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as general from '../../support/commandsGeneral';
import { SIZES } from '../../support/viewports';

describe('Manage roles', () => {
  describe('Open manage roles by menu', () => {
    before(() => {
      general.setResolution(SIZES.laptopXS);
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.getManageSignalsRoutes();
      routes.getSettingsRoutes();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });
    it('Should open manage roles via the settings menu', () => {
      general.openMenu();
      cy.contains('Instellingen').click();
      cy.wait('@getRoles');
      cy.wait('@getPermissions');
      cy.contains('Rollen').click();

      general.checkHeaderText('Rollen');
      cy.url().should('include', '/instellingen/rollen');
      cy.get(ROLES.buttonToevoegen).should('be.visible');
    });
  });
  describe('Add a role', () => {
    beforeEach(() => {
      general.setResolution(SIZES.desktop);
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.visit('/instellingen/rollen');
    });
    it('Should cancel adding a role by clicking on the backlink', () => {
      general.checkHeaderText('Rollen');
      cy.url().should('include', '/instellingen/rollen');

      cy.get(ROLES.buttonToevoegen).should('be.visible').click();
      cy.url().should('include', '/instellingen/rol');
      general.checkHeaderText('Rol toevoegen');
      cy.get(ROLES.backlink).should('have.text', 'Terug naar overzicht').and('be.visible').click();

      general.checkHeaderText('Rollen');
      cy.url().should('include', '/instellingen/rollen');
    });
    it('Should cancel adding a role by clicking on the cancel button', () => {
      cy.get(ROLES.buttonToevoegen).should('be.visible').click();
      cy.url().should('include', '/instellingen/rol');

      cy.get(ROLES.inputNaam).type('Rollebol');
      cy.contains('Inzien van expressies').click();
      cy.get(ROLES.buttonAnnuleren).click();

      general.checkHeaderText('Rollen');
      cy.url().should('include', '/instellingen/rollen');
    });
    it('Should add a role', () => {
      routes.postRoleRoute();
      cy.get(ROLES.buttonToevoegen).should('be.visible').click();
      cy.url().should('include', '/instellingen/rol');

      cy.get(ROLES.inputNaam).type('Rollebol');
      cy.contains('Inzien van expressies').click();
      cy.get(ROLES.buttonOpslaan).click();
      cy.wait('@postRole');

      general.checkHeaderText('Rollen');
      cy.url().should('include', '/instellingen/rollen');
      cy.get(ROLES.notification).should('have.text', 'Rol toegevoegd').and('be.visible');
      cy.get(ROLES.listRoles).find('tbody > tr')
        .should('contain', 'Rollebol').and('contain', 'Inzien van expressies').and('be.visible');
    });
  });
  describe('Change a role', () => {
    beforeEach(() => {
      general.setResolution(SIZES.laptopXS);
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.visit('/instellingen/rollen');
    });
    it('Should change a rol', () => {
      const randomNumber = Math.random();
      routes.patchRoleRoute();
      general.checkHeaderText('Rollen');
      cy.url().should('include', '/instellingen/rollen');
      cy.get(ROLES.listRoles).find('tbody > tr')
        .should('not.contain', 'Bollerol').and('not.contain', 'Schrijfrechten algemeen').and('be.visible');

      cy.contains('Rollebol').click();
      cy.get(ROLES.inputNaam).clear().type('Bollerol');
      cy.contains('Schrijfrechten algemeen').click();
      cy.get(ROLES.buttonOpslaan).click();
      cy.wait('@patchRole');
      general.checkHeaderText('Rollen');
      cy.url().should('include', '/instellingen/rollen');
      cy.get(ROLES.notification).should('have.text', 'Gegevens opgeslagen').and('be.visible');
      cy.contains('Bollerol').should('have.length', 1);
      cy.get(ROLES.listRoles).find('tbody > tr')
        .should('contain', 'Bollerol').and('contain', 'Schrijfrechten algemeen').and('be.visible');
      cy.get(ROLES.listRoles).find('tbody > tr').should('not.contain', 'Rollebol');
      
      cy.contains('Bollerol').click();
      cy.get(ROLES.inputNaam).clear().type(`z${randomNumber}lorrebor`);
      cy.contains('Schrijfrechten algemeen').click();
      cy.get(ROLES.buttonOpslaan).click();
    });
  });
});
