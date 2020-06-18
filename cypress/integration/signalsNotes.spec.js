// <reference types="Cypress" />
import * as requests from '../support/commandsRequests';
import * as createSignal from '../support/commandsCreateSignal';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';

const sizes = ['iphone-6', 'ipad-2', 'macbook-15'];
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
      localStorage.setItem('accessToken', Cypress.env('token'));
      cy.server();
      requests.createSignalOverviewMap();
      cy.getManageSignalsRoutes();
      cy.route('**/history').as('getHistory');
      cy.route('/maps/topografie?bbox=*').as('getMap');
      cy.route('/signals/v1/private/terms/categories/**').as('getTerms');
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      cy.get('[href*="/manage/incident/"]')
        .first()
        .click();
      cy.wait('@getMap');
      cy.wait('@getTerms');
      cy.wait('@getHistory');
    });

    it('Should cancel adding a note', () => {
      cy.get(SIGNAL_DETAILS.inputNoteText).should('not.be.visible');
      cy.get(SIGNAL_DETAILS.buttonSaveNote).should('not.be.visible');
      cy.get(SIGNAL_DETAILS.buttonCancelNote).should('not.be.visible');

      cy.get(SIGNAL_DETAILS.buttonAddNote).click();

      cy.get(SIGNAL_DETAILS.buttonAddNote).should('not.be.visible');
      cy.get(SIGNAL_DETAILS.inputNoteText).should('be.visible');
      cy.get(SIGNAL_DETAILS.buttonSaveNote)
        .should('be.visible')
        .and('be.disabled');

      cy.get(SIGNAL_DETAILS.buttonCancelNote)
        .should('be.visible')
        .click();

      cy.get(SIGNAL_DETAILS.buttonAddNote).should('be.visible');
      cy.get(SIGNAL_DETAILS.inputNoteText).should('not.be.visible');
      cy.get(SIGNAL_DETAILS.buttonSaveNote).should('not.be.visible');
      cy.get(SIGNAL_DETAILS.buttonCancelNote).should('not.be.visible');
    });

    it('Should add a note', () => {
      cy.server();
      cy.postNoteRoutes();
      const note1 = 'Ik hou van noteren, \nlekker notities maken. \nNou dat bevalt me wel.';
      const note2 = 'Ik voeg gewoon nog een notitie toe, omdat het zo leuk is!';

      createSignal.addNote(note1);
      cy.waitForPostNoteRoutes();

      cy.get(SIGNAL_DETAILS.historyAction)
        .first()
        .should('contain', 'Notitie toegevoegd')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.historyListItem)
        .first()
        .should('contain', note1)
        .and('be.visible');

      createSignal.addNote(note2);
      cy.waitForPostNoteRoutes();
      cy.get(SIGNAL_DETAILS.historyAction)
        .first()
        .should('contain', 'Notitie toegevoegd')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.historyListItem)
        .first()
        .should('contain', note2)
        .and('be.visible');
    });
  });
});
