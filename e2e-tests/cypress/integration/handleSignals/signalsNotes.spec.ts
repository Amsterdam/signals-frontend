// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import * as requests from '../../support/commandsRequests';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { MANAGE_SIGNALS, FILTER } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as general from '../../support/commandsGeneral';
import { SIZES } from '../../support/viewports';

const sizes = [SIZES.mobileS, SIZES.laptopM];

sizes.forEach(size => {
  describe(`Adding notes to signal, resolution is: ${size}`, () => {
    beforeEach(() => {
      general.setResolution(size);
    });

    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      requests.createSignalOverviewMap();
      routes.getManageSignalsRoutes();
      routes.getHistoryRoute();
      routes.stubPreviewMap();
      routes.getTermsRoute();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      cy.get('[href*="/manage/incident/"]')
        .eq(3)
        .click();
      cy.wait('@getTerms');
      cy.wait('@getHistory');
    });

    it('Should cancel adding a note', () => {
      cy.get(SIGNAL_DETAILS.inputNoteText).should('not.exist');
      cy.get(SIGNAL_DETAILS.buttonSaveNote).should('not.exist');
      cy.get(SIGNAL_DETAILS.buttonCancelNote).should('not.exist');

      cy.get(SIGNAL_DETAILS.buttonAddNote).click();

      cy.get(SIGNAL_DETAILS.buttonAddNote).should('not.exist');
      cy.get(SIGNAL_DETAILS.inputNoteText).should('be.visible');
      cy.get(SIGNAL_DETAILS.buttonSaveNote)
        .should('be.visible');

      cy.get(SIGNAL_DETAILS.buttonCancelNote)
        .should('be.visible')
        .click();

      cy.get(SIGNAL_DETAILS.buttonAddNote).should('be.visible');
      cy.get(SIGNAL_DETAILS.inputNoteText).should('not.exist');
      cy.get(SIGNAL_DETAILS.buttonSaveNote).should('not.exist');
      cy.get(SIGNAL_DETAILS.buttonCancelNote).should('not.exist');
    });
    it('Should show an error message when saving a note without content', () => {
      cy.get(SIGNAL_DETAILS.buttonAddNote).click();
      cy.get(SIGNAL_DETAILS.buttonSaveNote).click();
      cy.get(SIGNAL_DETAILS.errorMessage).should('have.text', 'Dit veld is verplicht')
        .and('be.visible').and('have.css', 'color', 'rgb(236, 0, 0)');
      cy.get(SIGNAL_DETAILS.buttonCancelNote).click();
    });

    it('Should add a note', () => {
      routes.defineNoteRoutes();
      const note1 = 'Ik hou van noteren, \nlekker noteletities maken. \nNou dat bevalt me wel.';
      const note2 = 'Ik voeg gewoon nog een noteletitie toe, omdat het zo leuk is!';

      createSignal.addNote(note1);
      routes.waitForNoteRoutes();

      cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 7);
      cy.get(SIGNAL_DETAILS.historyAction)
        .first()
        .should('contain', 'Notitie toegevoegd')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.historyListItem)
        .first()
        .should('contain', note1)
        .and('be.visible');

      createSignal.addNote(note2);
      routes.waitForNoteRoutes();
      cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 8);
      cy.get(SIGNAL_DETAILS.historyAction)
        .first()
        .should('contain', 'Notitie toegevoegd')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.historyListItem)
        .first()
        .should('contain', note2)
        .and('be.visible');
    });
    it('Should filter notes', () => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.getManageSignalsRoutes();
      routes.getHistoryRoute();
      routes.stubPreviewMap();
      routes.getTermsRoute();
      routes.getFilterByNoteRoute();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();

      cy.get(MANAGE_SIGNALS.buttonFilter)
        .should('be.visible')
        .click();

      cy.get(FILTER.inputSearchInNote).type('Noteletitie');
      cy.get(FILTER.buttonSubmitFilter)
        .should('be.visible')
        .click();
      cy.wait('@submitNoteFilter');

      cy.get(MANAGE_SIGNALS.filterTagList).contains('Noteletitie');
      cy.get('[href*="/manage/incident/"]')
        .eq(3)
        .click();
      cy.wait('@getTerms');
      cy.wait('@getHistory');

      cy.get(SIGNAL_DETAILS.historyAction)
        .should('contain', 'Notitie toegevoegd');
      cy.get(SIGNAL_DETAILS.historyListItem)
        .should('contain', 'noteletitie');
    });
  });
});
