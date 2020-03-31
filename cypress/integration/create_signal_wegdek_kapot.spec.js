// <reference types="Cypress" />

import * as createSignal from '../support/commands-create-signal'
import {CREATE_SIGNAL, WEGDEK} from '../support/selectors-create-signal'

describe('Create signal wegdek kapot', () => {

  before(function () {

    cy.server()
    cy.defineGeoSearchRoutes()
    cy.getAdressRoute('1105AT 50')

    // Open Homepage
    cy.visitFetch('incident/beschrijf')
  })

  it('Search for adress', () => {

    // Check on h1
    cy.checkHeader('Beschrijf uw melding')

    // Search on adress
    createSignal.searchAdress('1105AT 50')
    cy.wait('@getAdress')

    // Select found item  
    createSignal.selectAdress('Schepenbergweg 50, 1105AT Amsterdam')
    cy.wait('@lookup')
      .wait('@location')
      .wait('@geoSearchLocation')

  })

  it('Fill in description and date', () => {

    cy.server()
    cy.route('POST', '**/signals/category/prediction', 'fixture:wegdek.json').as('prediction')

    createSignal.inputDescription('Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?')

    // Select datetime
    cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click()

    // Click on next
    cy.clickButton('Volgende')

  })

  it('Fill in specific information', () => {
    
    // Check URL
    cy.url().should('include', '/incident/vulaan')

    // Check h1
    cy.checkHeader('Dit hebben we nog van u nodig')
    cy.contains('Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?')

    // Select road type
    cy.contains('Hebt u verteld om wat voor soort wegdek het gaat?')
    cy.get(WEGDEK.inputSoortWegdek).type('Asfalt')

    // Click on next
    cy.contains('Volgende').click()

  })

  it('Fill in phonenumber', () => {

    // Check URL
    cy.url().should('include', '/incident/telefoon')

    // Check h1
    cy.checkHeader('Mogen we u bellen voor vragen?')

    // Click on next
    cy.clickButton('Volgende')

  })

  it('Fill in e-mailadres', () => {

    // Check URL
    cy.url().should('include', '/incident/email')

    // Check h1
    cy.checkHeader('Wilt u op de hoogte blijven?')

    // Click on next
    cy.clickButton('Volgende')

  })

  it('Check overview', () => {

    // Check URL
    cy.url().should('include', '/incident/samenvatting')

    // Check h1
    cy.checkHeader('Controleer uw gegevens')

    // Check road type
    cy.contains('Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?')
    cy.contains('Asfalt')

    cy.clickButton('Verstuur')

  })

  it('Last screen', () => {

    // Check URL
    cy.url().should('include', '/incident/bedankt')

    // Check h1
    cy.checkHeader('Bedankt!')

    // TODO capture signal id

  })

})
