// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import * as requests from '../../support/commandsRequests';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';

describe('Sorting', () => {
  beforeEach(() => {
    routes.getManageSignalsRoutes();
    localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    cy.visit('/manage/incidents/');
    routes.waitForManageSignalsRoutes();
  });
  it('Should set-up testdata', () => {
    requests.createSignalOverviewMap();
    requests.createSignalSorting01();
    requests.createSignalSorting02();
    requests.createPrivateSignalForFilters();
  });
  it('Should sort on column Id', () => {
    routes.getSortedByIdRoutes();

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedASC');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.firstSignalId).should('have.text', '1');

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedDESC');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.firstSignalId).should('not.have.text', '1');
  });
  it('Should sort on column Subcategorie', () => {
    routes.getSortedBySubcategoryRoutes();

    cy.get('th').contains('Subcategorie').click();
    cy.wait('@getSortedASC');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.firstSignalSubcategorie).should('have.text', 'Afwatering brug');

    cy.get('th').contains('Subcategorie').click();
    cy.wait('@getSortedDESC');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.firstSignalSubcategorie).should('have.text', 'Woningkwaliteit');
  });
  it('Should sort on column Adres', () => {
    routes.getSortedByAddressRoutes();

    cy.get('th').contains('Adres').click();
    cy.wait('@getSortedASC');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.firstSignalAdres).then(address => {
      expect(address.text()).to.be.oneOf([
        "",
        "Aaf Bouberstraat 1, 1065LP Amsterdam"
      ]);
    });

    cy.get('th').contains('Adres').click();
    cy.wait('@getSortedDESC');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.firstSignalAdres).should('contain', 'Zwenkgrasstraat');
  });
});
