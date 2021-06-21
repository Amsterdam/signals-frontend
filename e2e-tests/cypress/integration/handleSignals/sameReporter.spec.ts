// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import * as requests from '../../support/commandsRequests';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import signal_7979 from '../../fixtures/samenhang/7979.json';
import signal_5964 from '../../fixtures/samenhang/5964.json';
import history_7979 from '../../fixtures/samenhang/history_7979.json';
import { SAMENHANG_TEXT } from '../../support/texts';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { SAME_REPORTER } from '../../support/selectorsSamenhang';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';

describe('Setup testdata', () => {
  it('Should setup the testdata', () => {
    requests.createSignalSamenhang();
    requests.createSignalSamenhang();
    requests.createSignalSamenhang();
  });
});
describe('Samenhang meldingen', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
  });
  it('Should show the amount of reported signals in the details of a signal', () => {
    routes.getManageSignalsRoutes();
    cy.visit('/manage/incidents/');
    routes.waitForManageSignalsRoutes();
    createSignal.openCreatedSignal();

    cy.get(SIGNAL_DETAILS.labelMeldigenMelder).should('have.text', 'Meldingen van deze melder').and('be.visible');
    cy.get(SIGNAL_DETAILS.linkMeldingenMelder).should('contain', '3 meldingen').and('be.visible');
    cy.get(SIGNAL_DETAILS.ktoAmounts).should('contain', '0x niet tevreden').and('contain', '3x openstaand').and('be.visible');
  });
  it('Should open the list of signals of a reporter and go back to signal', () => {
    cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
      cy.visit(`manage/incident/${json.signalId}`);
    });
    cy.intercept('signals/v1/private/signals/*/context/reporter?page=1**', { fixture: 'samenhang/getReporter01.json' }).as('getReporterPage1');
    cy.intercept('signals/v1/private/signals/7979', { fixture: 'samenhang/7979.json' }).as('getSignal7979');
    cy.intercept('signals/v1/private/signals/7979/history', { fixture: 'samenhang/history_7979.json' }).as('getHistory7979');
    
    cy.get(SIGNAL_DETAILS.linkMeldingenMelder).click();

    cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
    cy.url().should('include', 'melder');
    cy.contains('Meldingen van siahangsamen@sia.nl (11)').should('be.visible');

    // Check signal info
    cy.get(SAME_REPORTER.incidentInfo).eq(0).should('contain', signal_7979.category.sub).and('be.visible');
    cy.get(SAME_REPORTER.incidentStatus).eq(0).should('contain', signal_7979.status.state_display).and('be.visible');
    cy.get(SAME_REPORTER.dateTime).eq(0).should('contain', '05-05-2021 10:30').and('be.visible');

    // Check KTO statuses
    cy.get(SAME_REPORTER.feedbackStatus).eq(0).should('contain', 'Tevreden').and('be.visible').and('have.css', 'color', 'rgb(0, 160, 60)');
    cy.get(SAME_REPORTER.feedbackStatus).eq(2).should('contain', '-').and('be.visible');
    cy.get(SAME_REPORTER.feedbackStatus).eq(3).should('contain', 'Niet tevreden').and('be.visible').and('have.css', 'color', 'rgb(236, 0, 0)');
    cy.get(SAME_REPORTER.feedbackStatus).eq(4).should('contain', 'Niet ontvangen').and('be.visible');

    // Check SAME_REPORTER statuses
    cy.get(SAME_REPORTER.incidentStatus).eq(1).should('contain', 'Gemeld').and('be.visible');
    cy.get(SAME_REPORTER.incidentStatus).eq(3).should('contain', 'Heropend').and('be.visible');


    cy.get(SAME_REPORTER.linkBackToSignal).click();
    cy.get(SIGNAL_DETAILS.labelMeldigenMelder).should('have.text', 'Meldingen van deze melder').and('be.visible');
  });
  it('Should show the details of a signal', () => {
    cy.intercept('signals/v1/private/signals/*/context/reporter?page=1**', { fixture: 'samenhang/getReporter01.json' }).as('getReporterPage1');
    cy.intercept('signals/v1/private/signals/7979', { fixture: 'samenhang/7979.json' }).as('getSignal7979');
    cy.intercept('signals/v1/private/signals/7979/history', { fixture: 'samenhang/history_7979.json' }).as('getHistory7979');

    cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
      cy.visit(`manage/incident/${json.signalId}/melder`);
    });
    // Check signal details
    cy.get(SAME_REPORTER.incidentHeading).should('contain', 'Standaardmelding 7979').and('be.visible');
    cy.get(SAME_REPORTER.incidentDescription).should('contain', signal_7979.text);
    
    cy.get(SAME_REPORTER.labelGemeldOp).should('contain', 'Gemeld op');
    cy.get(SAME_REPORTER.valueGemeldOp).should('contain', '05-05-2021 10:30');

    cy.get(SAME_REPORTER.labelSubcategory).should('contain', 'Subcategorie (verantwoordelijke afdeling)');
    cy.get(SAME_REPORTER.valueSubcategory).should('contain', signal_7979.category.sub);

    cy.get(SAME_REPORTER.labelStatus).should('contain', 'Status');
    cy.get(SAME_REPORTER.valueStatus).should('contain', signal_7979.status.state_display);

    // History shows feedback and status actions in chronological order
    cy.get(SAME_REPORTER.labelHistory).should('contain', 'Contactgeschiedenis vanaf afgehandeld').and('be.visible');
    cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 5);
    cy.get(SIGNAL_DETAILS.historyListItem).should('have.length', 5);
    cy.get(SIGNAL_DETAILS.historyAction).eq(0).should('contain', history_7979[0].action);
    cy.get(SIGNAL_DETAILS.historyListItem).eq(0).should('contain', history_7979[0].description);
    cy.get(SIGNAL_DETAILS.historyAction).eq(1).should('contain', history_7979[2].action);
    cy.get(SIGNAL_DETAILS.historyListItem).eq(1).should('contain', history_7979[2].description);
    cy.get(SIGNAL_DETAILS.historyAction).eq(2).should('contain', history_7979[4].action);
    cy.get(SIGNAL_DETAILS.historyListItem).eq(2).should('contain', history_7979[4].description);
    cy.get(SIGNAL_DETAILS.historyAction).eq(3).should('contain', history_7979[6].action);
    cy.get(SIGNAL_DETAILS.historyListItem).eq(3).should('contain', history_7979[6].description);
    cy.get(SIGNAL_DETAILS.historyAction).eq(4).should('contain', history_7979[8].action);
    cy.get(SIGNAL_DETAILS.historyListItem).eq(4).should('contain', history_7979[8].description);
  });
  it('Should NOT show the signal details if a user is not authorized', () => {
    cy.intercept('signals/v1/private/signals/*/context/reporter?page=1**', { fixture: 'samenhang/getReporter01.json' }).as('getReporterPage1');
    cy.intercept('signals/v1/private/signals/7979', { fixture: 'samenhang/7979.json' }).as('getSignal7979');
    cy.intercept('signals/v1/private/signals/7979/history', { fixture: 'samenhang/history_7979.json' }).as('getHistory7979');

    cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
      cy.visit(`manage/incident/${json.signalId}/melder`);
    });

    cy.contains('7972').click();
    cy.contains(SAMENHANG_TEXT.notAuthorized).should('be.visible');
  });
  it('Should show a Hoofdmelding without contact history', () => {
    cy.intercept('signals/v1/private/signals/*/context/reporter?page=1**', { fixture: 'samenhang/getReporter01.json' }).as('getReporterPage1');
    cy.intercept('signals/v1/private/signals/7979', { fixture: 'samenhang/7979.json' }).as('getSignal7979');
    cy.intercept('signals/v1/private/signals/5964', { fixture: 'samenhang/5964.json' }).as('getSignal5964');
    cy.intercept('signals/v1/private/signals/7979/history', { fixture: 'samenhang/history_7979.json' }).as('getHistory7979');
    cy.intercept('signals/v1/private/signals/5964/history', { fixture: 'samenhang/history_5964.json' }).as('getHistory5964');

    cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
      cy.visit(`manage/incident/${json.signalId}/melder`);
    });

    cy.contains('5964').click();
    cy.get(SAME_REPORTER.incidentHeading).should('contain', 'Hoofdmelding 5964').and('be.visible');
    cy.get(`:nth-child(10) > ${SAME_REPORTER.iconHoofdmelding}`).should('be.visible');
    cy.get(SAME_REPORTER.labelStatus).should('contain', 'Status');
    cy.get(SAME_REPORTER.valueStatus).should('contain', signal_5964.status.state_display);
    cy.get(SAME_REPORTER.textNoContactHistory).should('contain', SAMENHANG_TEXT.nocontact).and('be.visible');
  });
  it('Should use the pagination buttons', () => {
    cy.intercept('signals/v1/private/signals/*/context/reporter?page=1**', { fixture: 'samenhang/getReporter01.json' }).as('getReporterPage1');
    cy.intercept('signals/v1/private/signals/*/context/reporter?page=2**', { fixture: 'samenhang/getReporter02.json' }).as('getReporterPage2');
    cy.intercept('signals/v1/private/signals/7979', { fixture: 'samenhang/7979.json' }).as('getSignal7979');
    cy.intercept('signals/v1/private/signals/5963', { fixture: 'samenhang/5963.json' }).as('getSignal5963');
    cy.intercept('signals/v1/private/signals/7979/history', { fixture: 'samenhang/history_7979.json' }).as('getHistory7979');
    cy.intercept('signals/v1/private/signals/5963/history', { fixture: 'samenhang/history_5963.json' }).as('getHistory5963');

    cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
      cy.visit(`manage/incident/${json.signalId}/melder`);
    });

    cy.get(SAME_REPORTER.incidentInfo).should('have.length', 10);
    cy.get(SAME_REPORTER.buttonPaginationNext).click();
    cy.get(SAME_REPORTER.incidentInfo).should('have.length', 1);
    cy.get(SAME_REPORTER.buttonPaginationPrevious).click();
  });
  it('Should open a signal when clicking on signal details header', () => {
    cy.intercept('signals/v1/private/signals/*/context/reporter?page=1**', { fixture: 'samenhang/getReporter01.json' }).as('getReporterPage1');
    cy.intercept('signals/v1/private/signals/7979', { fixture: 'samenhang/7979.json' }).as('getSignal7979');
    cy.intercept('signals/v1/private/signals/7979/history', { fixture: 'samenhang/history_7979.json' }).as('getHistory7979');

    cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
      cy.visit(`manage/incident/${json.signalId}/melder`);
    });
    cy.contains('Standaardmelding 7979').invoke('removeAttr', 'target').click();
    cy.get(SIGNAL_DETAILS.descriptionText).should('be.visible');
  });
});
