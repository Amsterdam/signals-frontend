// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-file-upload';

Cypress.Commands.add('isVisible', selector =>{
  cy.get(selector).should('be.visible');
});

Cypress.Commands.add('isNotVisible', selector => {
  cy.get(selector).should('not.exist');
});

Cypress.Commands.add('setResolution', size =>{
  if (Cypress._.isArrray(size)){
    cy.viewport(size[0],size [1]);
  } else {
    cy.viewport(size);
  }
});
// go to the page, use delete win.fetch to convert fetch requests in xhr
Cypress.Commands.add('visitFetch', url =>{
  cy.visit(url,{
    onBeforeLoad(win) {
      // eslint-disable-next-line no-param-reassign
      delete win.fetch;
    },
  });
});

Cypress.Commands.add('checkHeader', h1 =>{
  cy.get('h1').should('be.visible').and('contain', h1);
});

Cypress.Commands.add('clickButton', buttonName => {
  const click = $el => $el.click();
  cy.contains(buttonName)
    .should('be.visible')
    .pipe(click)
    .should($el => {
      // eslint-disable-next-line no-unused-expressions
      expect($el).to.not.be.visible;
    });
    
});
