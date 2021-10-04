// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import * as requests from '../../support/commandsRequests';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as general from '../../support/commandsGeneral';

describe.skip('Sorting', () => {
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
  it('Should sort on column Status', () => {
    // This test is skipped because there is a bug in the sorting mechanism. The bug will not be fixed soon.
    routes.getSortedByStatusRoutes();

    cy.get('th').contains('Status').click();
    cy.wait('@getSortedASC');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.signalStatus).first().should('have.text', 'Afgehandeld');

    cy.get('th').contains('Status').click();
    cy.wait('@getSortedDESC');
    cy.get(MANAGE_SIGNALS.signalStatus).first().should('have.text', 'In behandeling');
  });
  it('Should sort on column Dag', () => {
    // This test is skipped because there is only testdata for day 0. Sorting has no impact.
    routes.getSortedByTimeRoutes();

    cy.get('th').contains('Dag').click();
    // getSignals is the same as the ASC request for day
    cy.wait('@getSignals');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.signalDag).first().eq(0).should('have.text', '0');

    cy.get('th').contains('Dag').click();
    cy.wait('@@getSortedTimeASC');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.signalDag).first().eq(0).should('not.have.text', '0');
  });
  it('Should sort on column Datum en tijd', () => {
    // This test is skipped because it is not possible to know which signal is created first or last with parallel runs
    routes.getSortedByTimeRoutes();
    const todaysDate = general.getTodaysDate();

    cy.get('th').contains('Datum en tijd').click();
    cy.wait('@getSortedTimeASC');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.signalDatumTijd).first().should('not.contain', todaysDate);

    cy.get('th').contains('Datum en tijd').click();
    // getSignals is the same as the DESC request for Datum en tijd
    cy.wait('@getSignals');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.signalDatumTijd).first().should('contain', todaysDate);
  });
  it('Should sort on column Stadsdeel', () => {
    // This test is skipped because there is a bug in the sorting mechanism. The bug will not be fixed soon.
    routes.getSortedByCityAreaRoutes();

    cy.get('th').contains('Stadsdeel').click();
    cy.wait('@getSortedASC');
    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.get(MANAGE_SIGNALS.signalStadsdeelName).first().should('have.text', 'Centrum');

    cy.get('th').contains('Stadsdeel').click();
    cy.wait('@getSortedDESC');
    cy.get(MANAGE_SIGNALS.signalStadsdeelName).first().should('have.text', 'Zuidoost');
  });
});
