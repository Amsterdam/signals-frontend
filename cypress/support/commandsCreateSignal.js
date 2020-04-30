// General functionns for creating a signal
export const searchAddress = address => {
  cy.get('[data-testid=autoSuggest]')
    .type(address, { delay: 60 });
};

export const selectAddress = address => {
  cy.get('[data-testid=suggestList] ')
    .should('be.visible')
    .and('contain.text', address)
    .trigger('click');
};

export const inputDescription = description => {
  cy.get('textarea')
    .clear()
    .invoke('val', description)
    .trigger('input');
};

// Functions specific for Lantaarnpaal
export const selectLampOnCoordinate = (coordinateA, coordinateB) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.get('.leaflet-container').should('be.visible').wait(500).click(coordinateA, coordinateB);
};