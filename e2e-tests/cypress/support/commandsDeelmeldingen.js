import { DEELMELDING, SIGNAL_DETAILS } from './selectorsSignalDetails';
import { MANAGE_SIGNALS, FILTER } from './selectorsManageIncidents';

export const setDeelmelding = (id, deelmeldingNumber, subcategory, description) => {
  cy.get(DEELMELDING.titleDeelmelding).eq(id - 1).should('contain', `Deelmelding ${deelmeldingNumber}`);
  cy.get(`[data-testid="incidents[${id}].subcategory"]`).select(subcategory);
  cy.get(`[data-testid="incidentSplitFormIncidentDescriptionText-${id}"]`).clear().type(description);
};

export const checkDeelmelding = (deelmeldingNumber, subcategory) => {
  cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
    const deelMeldingId = Number.parseInt(json.signalId, 10) + Number.parseInt(deelmeldingNumber, 10);
    cy.log(deelMeldingId);

    cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(deelmeldingNumber - 1).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(0).should('have.text', deelMeldingId);
    cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(deelmeldingNumber - 1).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(1).should('have.text', subcategory).and('be.visible');
    // cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(deelmeldingNumber - 1).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(1).should('have.text', 'Gemeld').and('be.visible');
  });
};

export const filterSignalOnType = (type, selector) => {
  cy.get(MANAGE_SIGNALS.buttonFilteren).click();
  cy.get(selector).check().should('be.checked');
  cy.get(FILTER.buttonSubmitFilter).click();
  cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', type).and('be.visible');
  cy.get('th').contains('Id').click();
  cy.wait('@getSortedASC');
  cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
  cy.get(MANAGE_SIGNALS.firstSignalId).click();
  cy.wait('@getMap');
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
export const checkSignalType = type => {
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

export const checkDeelmeldingStatuses = status => {
  cy.get(DEELMELDING.childIncident)
    .each($element => {
      cy.get($element).should('contain', status);
    });
};
