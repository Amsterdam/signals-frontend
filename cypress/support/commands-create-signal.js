//General functionns for creating a signal
export const searchAdress = (adress) => {
    cy.get('#nlmaps-geocoder-control-input')
        .type(adress, { delay: 60 })
}

export const selectAdress = (adress) => {
    cy.get('#nlmaps-geocoder-control-results')
        .should('be.visible')
        .and('contain.text', adress)
        .click()
}

export const inputDescription = (description) => {
    cy.get('[placeholder="Beschrijf uw melding"]')
        .clear()
        .invoke('val', description)
        .trigger('input')
}

// Functions specific for Lantaarnpaal
export const selectLampOnCoordinate = (coordinateA, coordinateB) => {
    cy.get('.leaflet-container').should('be.visible').wait(500).click(coordinateA, coordinateB)
}