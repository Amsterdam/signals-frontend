// <reference types="Cypress" />

describe('Open standaardteksten', () => {
  beforeEach(() => {
    cy.server();
    cy.getManageSignalsRoutes();

    cy.route('**/signals/v1/private/terms/categories/afval/sub_categories/asbest-accu/status-message-templates').as('getAsbestAccu');
    cy.route('**/signals/v1/private/terms/categories/overlast-op-het-water/sub_categories/overlast-op-het-water-geluid/status-message-templates').as('getOverlastOpHetWater');
    cy.route('POST','/signals/v1/private/terms/categories/overlast-op-het-water/sub_categories/overlast-op-het-water-geluid/status-message-templates').as('PostOverlastOpHetWater');

    localStorage.setItem('accessToken', 'TEST123');

    cy.visitFetch('/manage/incidents/');

    // wait till page is loaded
    cy.wait('@getFilters');
    cy.wait('@getCategories');
    cy.wait('@getSignals');
    cy.wait('@getUserInfo');
  });

  it('Should open standaardteksten', () => {
    cy.openMenu();
    cy.contains('Standaard teksten').click();
    cy.wait('@getAsbestAccu');

    // Check on URL
    cy.url().should('include', '/manage/standaard/teksten');

    // Check on h1
    cy.checkHeaderText('Beheer standaard teksten');

    // Dropdown subcategories
    cy.get('[data-testid=category_url]').select('Geluid op het water');
    cy.wait('@getOverlastOpHetWater');

    // Radiobuttons
    cy.get('[data-testid=state-o]');
    cy.get('[data-testid=state-ingepland]').check();
    cy.get('[data-testid=state-reopened]');

    // Title and text
    cy.get('[data-testid=title0]').clear().type('Dit is titel van standaardtekst 1');
    cy.get('[data-testid=text0]').clear().type('Dit is standaardtekst 1');

    // Save button
    cy.get('[data-testid=defaultTextFormSubmitButton]').click();
    cy.wait('@PostOverlastOpHetWater');
  });
});
