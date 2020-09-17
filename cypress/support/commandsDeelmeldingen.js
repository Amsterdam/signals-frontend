import { DEELMELDING, SIGNAL_DETAILS } from './selectorsSignalDetails';
import { MANAGE_SIGNALS, FILTER } from './selectorsManageIncidents';

export const setDeelmelding = (deelmeldingNumber, subcategory, description) => {
  cy.get(DEELMELDING.titleDeelmelding).eq(deelmeldingNumber - 1).should('contain', `Deelmelding ${deelmeldingNumber}`);
  cy.get(`[data-testid='part${deelmeldingNumber}.subcategory']`).parent().siblings().contains('Subcategorie');
  cy.get(`[data-testid='part${deelmeldingNumber}.subcategory']`).select(subcategory);
  cy.get(`[data-testid="part${deelmeldingNumber}.text"]`).clear().type(description);
  cy.get(`[data-testid="part${deelmeldingNumber}.note"]`).type(`Nootje ${deelmeldingNumber}`);
};

export const checkDeelmelding = (deelmeldingNumber, subcategory) => {
  const deelMeldingId = Cypress.env('signalId') + Number.parseInt(deelmeldingNumber, 10);
  cy.log(deelMeldingId);
  cy.get(SIGNAL_DETAILS.deelmeldingId).eq(deelmeldingNumber - 1).should('have.text', deelMeldingId);
  cy.get(SIGNAL_DETAILS.deelmeldingStatus).eq(deelmeldingNumber - 1).should('have.text', 'Gemeld').and('be.visible');
  cy.get(SIGNAL_DETAILS.deelmeldingCategory).eq(deelmeldingNumber - 1).should('have.text', subcategory).and('be.visible');
};

export const filterSignalOnType = (type, selector) => {
  cy.get(MANAGE_SIGNALS.buttonFilteren).click();
  cy.get(selector).check().should('be.checked');
  cy.get(FILTER.buttonSubmitFilter).click();
  cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', type).and('be.visible');
  cy.get('th').contains('Id').click();
  cy.wait('@getSortedASC');
  cy.get(MANAGE_SIGNALS.spinner).should('not.be.visible');
  cy.get(MANAGE_SIGNALS.firstSignalId).click();
  cy.wait('@getMap');
  cy.wait('@getTerms');
  checkSignalType(type);
  cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
  cy.get('th').contains('Id').click();
  cy.wait('@getSortedDESC');
  cy.get(MANAGE_SIGNALS.spinner).should('not.be.visible');
  cy.get(MANAGE_SIGNALS.firstSignalId).click();
  checkSignalType(type);
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
