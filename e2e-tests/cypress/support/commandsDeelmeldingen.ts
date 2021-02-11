import { DEELMELDING, SIGNAL_DETAILS } from './selectorsSignalDetails';
import { MANAGE_SIGNALS, FILTER } from './selectorsManageIncidents';

Cypress.Commands.add('checkDeelmelding', (deelmeldingNumber, subcategory, status, handlingTime) => {
  cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
    const deelMeldingId = Number.parseInt(json.signalId, 10) + Number.parseInt(deelmeldingNumber, 10);
    cy.log(deelMeldingId.toString());

    cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(deelmeldingNumber - 1).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(0).should('have.text', deelMeldingId);
    cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(deelmeldingNumber - 1).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(1).should('contain', subcategory).and('be.visible');
    cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(deelmeldingNumber - 1).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(1).should('contain', status).and('be.visible');
    cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(deelmeldingNumber - 1).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(2).should('have.text', handlingTime).and('be.visible');
  });
});

Cypress.Commands.add('checkDeelmeldingStatus', status => {
  cy.get(DEELMELDING.childIncident)
    .each((element: string) => {
      cy.get(element).should('contain', status);
    });
});

Cypress.Commands.add('checkSignalNotVisible', () => {
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
});

Cypress.Commands.add('checkSignalType', type => {
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
});

Cypress.Commands.add('filterSignalOnType', (type, selector) => {
  cy.get(MANAGE_SIGNALS.buttonFilteren).click();
  cy.get(selector).check().should('be.checked');
  cy.get(FILTER.buttonSubmitFilter).click();
  cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', type).and('be.visible');
  cy.get('th').contains('Id').click();
  cy.wait('@getSortedASC');
  cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
  cy.get(MANAGE_SIGNALS.firstSignalId).click();
  cy.wait('@getTerms');
  cy.checkSignalType(type);
  cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
  cy.get('th').contains('Id').click();
  cy.wait('@getSortedDESC');
  cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
  cy.get(MANAGE_SIGNALS.firstSignalId).click();
  cy.checkSignalType(type);
  cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
});

Cypress.Commands.add('setDeelmelding', (id, deelmeldingNumber, subcategory, description) => {
  cy.get(DEELMELDING.titleDeelmelding).eq(id - 1).should('contain', `Deelmelding ${deelmeldingNumber}`);
  cy.get('select').eq(id - 1).find('option').contains(subcategory).then($element => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const elementText = $element.text();
    cy.get('select').eq(id - 1).select(elementText);
  });
  cy.get(`[data-testid="incidentSplitFormIncidentDescriptionText-${id}"]`).clear().type(description);
});
