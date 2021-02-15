/**
 * Custom command to set the resolution for the test.
 * @example cy.setResolution([375, 812]);
 * @example cy.setResolution('iphone-6');
*/
export const setResolution = (size: Cypress.ViewportPreset | number[]) => {
  if (Cypress._.isArray(size)) {
    cy.viewport(size[0], size[1]);
  } else {
    cy.viewport(size);
  }
};

/**
 * Custom command to check if a h1 element contains a text and is visible.
 * @example cy.checkHeaderText('Check this header');
*/
export const checkHeaderText = (header: string) => {
  cy.get('h1')
    .should('be.visible')
    .and('contain', header);
};

/**
 * Custom command to open the menu.
 * @example cy.openMenu();
*/

export const openMenu = () => {
  cy.get('[aria-label=Menu]').click();
};
