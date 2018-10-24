describe('My First Test', () => {
  it('Does not do much!', () => {
    cy.visit('/');
    cy.url()
      .should('contain', '/incident/beschrijf');

    cy.get('#mapdiv')
      .click(150, 150);

    cy.wait(500);

    cy.get('#nlmaps-geocoder-control-input')
      .should('have.value', 'Marcantilaan 367, 1051NJ Amsterdam');

    cy.get('textarea')
      .type('alweer die tering poep');

    cy.get('#datetime-Nu')
      .click();

    cy.wait(2000);
    cy.get('.incident-navigation__button.arrow-right')
      .click();
  });
});
