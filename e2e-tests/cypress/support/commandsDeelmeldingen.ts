// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { DEELMELDING, SIGNAL_DETAILS } from './selectorsSignalDetails';
import { MANAGE_SIGNALS, FILTER } from './selectorsManageIncidents';

/**
 * Custom command to check if all general information of a deelmelding is visible.
 * @example cy.checkDeelmelding('1', 'Snel varen', 'Gemeld', '3 werkdagen', 'Omschrijving');
*/
export const checkDeelmelding = (deelmeldingNumber: number, subcategory: string, status: string, handlingTime: string, description: string) => {
  cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
    const deelMeldingId = Number.parseInt(json.signalId, 10) + deelmeldingNumber;
    cy.log(deelMeldingId.toString());

    cy.get(SIGNAL_DETAILS.deelmeldingBlock)
      .eq(deelmeldingNumber - 1)
      .find(SIGNAL_DETAILS.deelmeldingBlockValue)
      .eq(0)
      .should('have.text', deelMeldingId)
      .and('be.visible');
    cy.get(SIGNAL_DETAILS.deelmeldingBlock)
      .eq(deelmeldingNumber - 1)
      .find(SIGNAL_DETAILS.deelmeldingBlockValue)
      .eq(1)
      .should('contain', subcategory)
      .and('be.visible');
    cy.get(SIGNAL_DETAILS.deelmeldingBlock)
      .eq(deelmeldingNumber - 1)
      .find(SIGNAL_DETAILS.deelmeldingBlockValue)
      .eq(2)
      .should('contain', status)
      .and('be.visible');
    cy.get(SIGNAL_DETAILS.deelmeldingBlock)
      .eq(deelmeldingNumber - 1)
      .find(SIGNAL_DETAILS.deelmeldingBlockValue)
      .eq(3)
      .should('have.text', description)
      .and('be.visible');
    cy.get(SIGNAL_DETAILS.deelmeldingBlock)
      .eq(deelmeldingNumber - 1)
      .find(SIGNAL_DETAILS.deelmeldingBlockValue)
      .eq(4)
      .should('have.text', handlingTime)
      .and('be.visible');
  });
};

/**
  * Custom command to check if a specific status of the deelmelding is visible.
  * @example cy.checkDeelmeldingStatus('Gemeld');
 */
export const checkDeelmeldingStatus = (status: string) => {
  cy.get(DEELMELDING.childIncident)
    .each((element: string) => {
      cy.get(element).should('contain', status);
    });
};

/**
 * Custom command to check if a signal is not visible in the list of signals.
 * @example cy.checkSignalNotVisible();
*/
export const checkSignalNotVisible = () => {
  cy.get('body').then($body => {
    if ($body.find('th').length > 0) {
      cy.get('th').contains('Id').click();
      cy.wait('@getSortedASC');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
      cy.get('th').contains('Id').click();
      cy.wait('@getSortedDESC');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
      // eslint-disable-next-line promise/no-nesting
      cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
        cy.get(MANAGE_SIGNALS.firstSignalId).should('not.have.text', `${json.signalId}`);
      });
    }
    else {
      cy.contains('Geen meldingen').should('be.visible');
    }
  });
};

/**
 * Custom command to check if the specific elements of the signaltype are visible.
 * @example cy.checkSignalType('melding');
 * @example cy.checkSignalType('hoofdmelding');
 * @example cy.checkSignalType('deelmelding');
*/
export const checkSignalType = (type: string) => {
  switch (type) {
    case 'melding':
      cy.get(MANAGE_SIGNALS.firstSignalId).click();
      cy.get(DEELMELDING.linkParent).should('not.exist');
      break;
    case 'hoofdmelding':
      cy.get(DEELMELDING.linkParent).should('not.exist');
      cy.get(DEELMELDING.childIncidents).should('be.visible');
      break;
    case 'deelmelding':
      cy.get(DEELMELDING.linkParent).should('be.visible');
      cy.get(DEELMELDING.childIncidents).should('not.exist');
      break;
    default:
  }
};

/**
 * Custom command to filter signals by a specific signaltype.
 * @example cy.filterSignalOnType('Hoofdmelding', FILTER.checkboxHoofdmelding);
*/
export const filterSignalOnType = (type: string, selector: string) => {
  cy.get(MANAGE_SIGNALS.buttonFilteren).click();
  cy.get(selector).check().should('be.checked');
  cy.get(FILTER.buttonSubmitFilter).click();
  cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', type).and('be.visible');
  cy.get('th').contains('Id').click();
  cy.wait('@getSortedASC');
  cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
  cy.get(MANAGE_SIGNALS.firstSignalId).click();
  cy.wait('@getTerms');
  checkSignalType(type);
  cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
  cy.get('th').contains('Id').click();
  cy.wait('@getSortedDESC');
  cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
  cy.get(MANAGE_SIGNALS.firstSignalId).click();
  checkSignalType(type);
  cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
};

/**
 * Custom command to fill in the deelmelding.
 * @example cy.setDeelmelding('2', '2', 'Brug', 'De Berlagebrug is stuk.');
*/
export const setDeelmelding = (id: number, deelmeldingNumber: string, subcategory: string, description: string) => {
  cy.get(DEELMELDING.titleDeelmelding).eq(id - 1).should('contain', `Deelmelding ${deelmeldingNumber}`);
  cy.get('select').eq(id - 1).find('option').contains(subcategory).then($element => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const elementText = $element.text();
    cy.get('select').eq(id - 1).select(elementText);
  });
  cy.get(`[data-testid="incidentSplitFormIncidentDescriptionText-${id}"]`).clear().type(description);
};
