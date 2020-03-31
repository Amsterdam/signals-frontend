describe('Check styling', () => {

  before(() => {


    // Go to the homepage
    cy.visitFetch('incident/beschrijf');

  });

  it('Check on style elements', () => {

    // Check on style urgency
    // cy.contains('Hoog: melding met spoed oppakken')
    //   .should('be.visible')
    //   .should('have.css', 'font-family')
    //   .and('match', /serif/)
    
    // //Check on color of message
    // cy.contains('Hoog: melding met spoed oppakken').should(($labels) => {
    //   expect($labels).to.have.css('color', 'rgb(118, 118, 118)')
    // })

  });
});

