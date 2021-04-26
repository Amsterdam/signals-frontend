// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
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
  * Custom command to get the Iframe body
  * @example cy.getIframeBody();
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const getIframeBody = () => cy.get('iframe').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap);

/**
  * Custom command to get the date of today.
  * @example cy.getTodaysDate();
 */
export const getTodaysDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

/**
  * Custom command to get a date of today + an amount of days.
  * @example cy.getFutureDate(10);
 */
export const getFutureDate = (days: number) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return futureDate;
};

/**
 * Custom command to open the menu.
 * @example cy.openMenu();
*/
export const openMenu = () => {
  cy.get('[aria-label=Menu]').click();
};
