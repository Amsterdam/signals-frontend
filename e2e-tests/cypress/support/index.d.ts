/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {

    /**
     * Custom command to add a note to a signal.
     * @example cy.addnote('This is a note');
    */
    addNote(noteText: string): Chainable<Element>;

    /**
     * Custom command to change the status of a signal.
     * @example cy.changeSignalStatus('Gemeld', 'In afwachting van behandeling', CHANGE_STATUS.radioButtonInAfwachting);
    */
    changeSignalStatus(initialStatus: string, newStatus, radioButton: string): Chainable<Element>;

    /**
     * Custom command to check if all details of a signal are visible.
     * @example cy.checkAllDetails('../fixtures/signals/fietsNietje.json');
    */
    checkAllDetails(fixturePath: string): Chainable<Element>;

    /**
     * Custom command to check if the creation date on the signal details page is today's date.
     * @example cy.checkCreationDate();
    */
    checkCreationDate(): Chainable<Element>;

    /**
     * Custom command to check if all the general elements of the description page are visible.
     * @example cy.checkDescriptionPage();
    */
    checkDescriptionPage(): Chainable<Element>;

    /**
     * Custom command to check if all the general elements of the description page are visible.
     * @example cy.checkDepartments();
    */
    checkDepartments(fixturePath: any): Chainable<Element>;

    /**
     * Custom command to change the status of a signal.
     * @example cy.checkHeaderText('Check this header');
    */
    checkHeaderText(header: string): Chainable<Element>;

    /**
     * Custom command to open the menu.
     * @example cy.openMenu();
    */
    openMenu(): Chainable<Element>;

    /**
     * Custom command to add a note to a signal.
     * @example cy.setResolution([375, 812]);
     * @example cy.setResolution('iphone-6');
    */
    setResolution(size: any): Chainable<Element>;
  }
}
