// <reference types="Cypress" />

import * as createSignal from '../support/commands-create-signal'
import { CREATE_SIGNAL, JONGEREN } from '../support/selectors-create-signal'

describe('Overlast door door groep jongeren', function () {

  before(function () {

    cy.server()
    cy.defineGeoSearchRoutes()
    cy.getAdressRoute('1018CN 28-H')

    // Open Homepage
    cy.visitFetch('incident/beschrijf')
  })

  it('Search for adress', () => {

    // Check h1
    cy.checkHeader('Beschrijf uw melding')

    // Search adress
    createSignal.searchAdress('1018CN 28-H')
    cy.wait('@getAdress')

    // Select found item  
    createSignal.selectAdress('Plantage Doklaan 28-H, 1018CN Amsterdam')
    cy.wait('@lookup')
      .wait('@location')
      .wait('@geoSearchLocation')

  })

  it('Fill in description and date', () => {

    cy.server()
    cy.route('POST', '**/signals/category/prediction', 'fixture:jongeren.json').as('prediction')

    createSignal.inputDescription('De laatste paar weken staat er in de avond een grote groep jongeren voor mijn deur te blowen. Dit zorgt voor veel overlast.')

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
    cy.contains('De laatste paar weken staat er in de avond een grote groep jongeren voor mijn deur te blowen. Dit zorgt voor veel overlast.').should('be.visible')

    // Check specific information
    cy.contains('Weet u de naam van de jongere(n)?').should('be.visible')
    cy.contains('Om hoe veel personen gaat het (ongeveer)?').should('be.visible')
    cy.contains('Gebeurt het vaker?').should('be.visible')
    
    // Check link Melding zorg en woonoverlast
    cy.contains('Melding zorg en woonoverlast').should('have.attr', 'href').and('include', 'meldpunt-zorg')

    // Check number of person
    cy.get(JONGEREN.radioButtonAantalPersonen).check()

    // Check if question is NOT visible
    cy.contains('Geef aan op welke momenten het gebeurt').should('be.not.be.visible')

    // Check if it happens more than once?
    cy.get(JONGEREN.checkBoxVaker).check()

    // Check if question is visible
    cy.contains('Geef aan op welke momenten het gebeurt').should('be.visible')

    // Fill in when it happens
    cy.get(JONGEREN.inputMoment).type('Bijna iedere dag')

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

    // Click on next
    cy.clickButton('Volgende')

  })

  it('Check overview', () => {

    // Check URL
    cy.url().should('include', '/incident/samenvatting')

    // Check h1
    cy.checkHeader('Controleer uw gegevens')

    // Check information provided by user
    cy.contains('Plantage Doklaan 28-H, 1018CN Amsterdam').should('be.visible')
    cy.contains('De laatste paar weken staat er in de avond een grote groep jongeren voor mijn deur te blowen. Dit zorgt voor veel overlast.').should('be.visible')
    cy.contains('4 - 6').should('be.visible')
    cy.contains('Ja, het gebeurt vaker').should('be.visible')
    cy.contains('Bijna iedere dag').should('be.visible')


    // Check marker on map
    cy.get(CREATE_SIGNAL.imageAdressMarker).find("img").should('be.visible')

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
