// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { DASHBOARD } from '../../support/selectorsManageIncidents';
import { DASHBOARD_TEXT} from '../../support/texts';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as general from '../../support/commandsGeneral';

describe('Signals dashbaord', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });
    it('Should open the signals dashboard with no signals', () => {
      cy.intercept('**/reports/signals/open*').as('getOpenSignals');
      cy.intercept('**/reports/signals/reopen-requested?*').as('getReopenRequestedSignals');
      routes.getManageSignalsRoutes();
      cy.visit('manage');
      routes.waitForManageSignalsRoutes();
      
      // Open dashboard by menu
      general.openMenu();
      cy.contains('Signalering').click();
      cy.wait('@getOpenSignals');
      cy.wait('@getReopenRequestedSignals');
      cy.url().should('include', '/signalering');

      cy.get(DASHBOARD.heading).should('have.text', 'Signalering').and('be.visible');

      // Dashboard open signals
      cy.get(DASHBOARD.graphTitle).eq(0).should('contain', DASHBOARD_TEXT.titleDashboardOpen).and('be.visible');
      cy.get(DASHBOARD.graphDescription).eq(0).should('contain', DASHBOARD_TEXT.descriptionDashboardOpen).and('be.visible');
      cy.get(DASHBOARD.graphTotalSignals).eq(0).should('have.text', '0').and('be.visible');

      // Dashboard requested to reopen signals
      cy.get(DASHBOARD.graphTitle).eq(1).should('contain', DASHBOARD_TEXT.titleDashboardReopen).and('be.visible');
      cy.get(DASHBOARD.graphDescription).eq(2).should('contain', DASHBOARD_TEXT.descriptionDashboardReOpen).and('be.visible');
      cy.get(DASHBOARD.graphTotalSignals).eq(1).should('have.text', '0').and('be.visible');

      cy.get(DASHBOARD.emptyText).should('contain', DASHBOARD_TEXT.noSignals).and('have.length', 2).and('be.visible');
      cy.get(DASHBOARD.checkmarkIcon).should('have.length', 2).and('be.visible');
    });
    it('Should open the signals dashboard with signals', () => {
      cy.intercept('**/reports/signals/open*', { fixture: 'dashboard/dashboardOpen.json' }).as('stubOpenSignals');
      cy.intercept('**/reports/signals/reopen-requested?*', { fixture: 'dashboard/dashboardReopen.json' }).as('stubReopenRequestedSignals');
      cy.visit('manage/signalering');
    

      // Dashboard open signals
      cy.get(DASHBOARD.graphTotalSignals).eq(0).should('have.text', '6,322').and('be.visible');

      // Dashboard requested to reopen signals
      cy.get(DASHBOARD.graphTotalSignals).eq(1).should('have.text', '2,754').and('be.visible');

      cy.get(DASHBOARD.emptyText).should('not.exist');
      cy.get(DASHBOARD.checkmarkIcon).should('not.exist');

      // Check total amount of bars
      cy.get(DASHBOARD.bar).should('have.length', 127).and('be.visible');
      cy.get(DASHBOARD.barSignalcount).should('have.length', 127).and('be.visible');
      cy.get(DASHBOARD.barSubcategory).should('have.length', 127).and('be.visible');

      // Check first and last bar
      cy.get(DASHBOARD.barSubcategory).first().should('have.text', 'Verkeerssituaties (VOR)').and('be.visible');
      cy.get(DASHBOARD.barSignalcount).first().should('have.text', '1577').and('be.visible');
      cy.get(DASHBOARD.barSubcategory).last().should('have.text', 'Vaste brug (STW, VOR, WAT)').and('be.visible');
      cy.get(DASHBOARD.barSignalcount).last().should('have.text', '1').and('be.visible');
    });
});
