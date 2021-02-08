Cypress.Commands.add('setResolution', size => {
  if (Cypress._.isArray(size)) {
    cy.viewport(size[0], size[1]);
  } else {
    cy.viewport(size);
  }
});

Cypress.Commands.add('checkHeaderText', header => {
  cy.get('h1')
    .should('be.visible')
    .and('contain', header);
});

Cypress.Commands.add('openMenu', () => {
  cy.get('[aria-label=Menu]').click();
});
