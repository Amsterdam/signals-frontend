import { DEELMELDING, SIGNAL_DETAILS } from './selectorsSignalDetails';

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
