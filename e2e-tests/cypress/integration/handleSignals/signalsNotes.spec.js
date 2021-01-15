// <reference types="Cypress" />
import * as requests from '../../support/commandsRequests';
import * as createSignal from '../../support/commandsCreateSignal';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { MANAGE_SIGNALS, FILTER } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';

const sizes = ['iphone-6', 'macbook-15'];

sizes.forEach(size => {
  describe(`Adding notes to signal, resolution is: ${size}`, () => {
    beforeEach(() => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
      } else {
        cy.viewport(size);
      }
    });

    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      requests.createSignalOverviewMap();
      cy.getManageSignalsRoutes();
      cy.getHistoryRoute();
      cy.stubPreviewMap();
      cy.getTermsRoute();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      cy.get('[href*="/manage/incident/"]')
        .first()
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
      cy.noteRoutes();
      const note1 = 'Ik hou van noteren, \nlekker noteletities maken. \nNou dat bevalt me wel.';
      const note2 = 'Ik voeg gewoon nog een noteletitie toe, omdat het zo leuk is!';

      createSignal.addNote(note1);
      cy.waitForNoteRoutes();

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
      cy.waitForNoteRoutes();
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
      cy.getManageSignalsRoutes();
      cy.getHistoryRoute();
      cy.stubPreviewMap();
      cy.getTermsRoute();
      cy.getFilterByNoteRoute();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();

      cy.get(MANAGE_SIGNALS.buttonFilteren)
        .should('be.visible')
        .click();

      cy.get(FILTER.inputSearchInNote).type('Noteletitie');
      cy.get(FILTER.buttonSubmitFilter)
        .should('be.visible')
        .click();
      cy.wait('@submitNoteFilter');

      cy.get(MANAGE_SIGNALS.filterTagList).contains('Noteletitie');
      cy.get('[href*="/manage/incident/"]')
        .first()
        .click();
      cy.wait('@getTerms');
      cy.wait('@getHistory');

      cy.get(SIGNAL_DETAILS.historyAction)
        .should('contain', 'Notitie toegevoegd')
        .find(SIGNAL_DETAILS.historyListItem)
        .should('contain', 'noteletitie');
    });
  });
});
