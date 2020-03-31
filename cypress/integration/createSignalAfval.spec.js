// <reference types="Cypress" />

import * as createSignal from '../support/commands-create-signal'
import {CREATE_SIGNAL} from '../support/selectors-create-signal'

describe('Create signal afval', function () {

  before(function () {

    cy.server()
    cy.defineGeoSearchRoutes()
    cy.getAdressRoute('1035LA 43')

    // Open Homepage
    cy.visitFetch('incident/beschrijf')
  })

  it('Search for adress', () => {

    // Check on h1
    cy.checkHeader('Beschrijf uw melding')

    // Search on adress
    createSignal.searchAdress('1035LA 43')
    cy.wait('@getAdress')

    // Select found item  
    createSignal.selectAdress('Sandwijk 43, 1035LA Amsterdam')
    cy.wait('@lookup')
      .wait('@location')
      .wait('@geoSearchLocation')

  })

  it('Fill in description and date', () => {

    cy.server()
    cy.route('POST', '**/signals/category/prediction', 'fixture:afval.json').as('prediction')

    createSignal.inputDescription('Voor mijn deur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?')

    // Select datetime
    cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click()

    // Click on next
    cy.clickButton('Volgende')

  })

  it('Fill in phonenumber', () => {

    // Check URL
    cy.url().should('include', '/incident/telefoon')

    // Check h1
    cy.checkHeader('Mogen we u bellen voor vragen?')

    // Fill phonenumber
    cy.get(CREATE_SIGNAL.inputPhoneNumber).type('06-12345678')

    // Click on next
    cy.clickButton('Volgende')

  })

  it('Fill in e-mailadres', () => {

    // Check URL
    cy.url().should('include', '/incident/email')

    // Check h1
    cy.checkHeader('Wilt u op de hoogte blijven?')

    // Fill emailadress
    cy.get(CREATE_SIGNAL.inputEmail).type('siafakemail@fake.nl')

    // Click on next
    cy.clickButton('Volgende')

  })

  it('Check overview', () => {

    // Check URL
    cy.url().should('include', '/incident/samenvatting')

    // Check h1
    cy.checkHeader('Controleer uw gegevens')

    // Check mail and phonenumber
    cy.contains('06-12345678').should('be.visible')
    cy.contains('siafakemail@fake.nl').should('be.visible')

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
