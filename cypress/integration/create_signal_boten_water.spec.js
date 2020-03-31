// <reference types="Cypress" />

import * as createSignal from '../support/commands-create-signal'
import {CREATE_SIGNAL, BOTEN} from '../support/selectors-create-signal'

describe('Create signal boten', function () {

  before(function () {

    cy.server()
    cy.defineGeoSearchRoutes()
    cy.getAdressRoute('1096AC 7')
  
   // Open Homepage
     cy.visitFetch('incident/beschrijf')
  })

  it('Search for adress', () => {

    // Check h1
    cy.checkHeader('Beschrijf uw melding')

    // Search adress
    createSignal.searchAdress('1096AC 7')
    cy.wait('@getAdress')

     // Select found item  
    createSignal.selectAdress('Korte Ouderkerkerdijk 7, 1096AC Amsterdam')
    cy.wait('@lookup')
      .wait('@location')
      .wait('@geoSearchLocation')

  })

  it('Fill in description and date', () => {
    
    cy.server()
    cy.route('POST', '**/signals/category/prediction', 'fixture:water.json').as('prediction')
  
    createSignal.inputDescription('Een grote boot vaart al de hele dag hard door het water.')

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
    cy.contains('Een grote boot vaart al de hele dag hard door het water.')

    // Select rondvaartboot company and name
    cy.get(BOTEN.radioButtonRondvaartbootJa).click()
    cy.get('select').select('Amsterdam Boat Center')
    cy.get(BOTEN.inputNaamBoot).type('Bota Fogo')
    cy.get(BOTEN.inputNogMeer).type('De boot voer richting Ouderkerk aan de Amstel')

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

   // Check information provided by user
   cy.contains('Korte Ouderkerkerdijk 7, 1096AC Amsterdam').should('be.visible')
   cy.contains('Een grote boot vaart al de hele dag hard door het water.').should('be.visible')
   cy.contains('Amsterdam Boat Center').should('be.visible')
   cy.contains('Bota Fogo').should('be.visible')
   cy.contains('De boot voer richting Ouderkerk aan de Amstel').should('be.visible')

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
