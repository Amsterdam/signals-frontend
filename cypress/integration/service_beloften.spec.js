// <reference types="Cypress" />

import * as createSignal from '../support/commands-create-signal'
import { CATEGORIES, MENU_ITEMS } from '../support/selectors-manage-incidents'
import { CREATE_SIGNAL } from '../support/selectors-create-signal'

describe('Change servicebelofte', function () {

  before(function () {
    
    localStorage.setItem('accessToken', 'TEST123')

    cy.server()
    cy.getManageSignalsRoutes()
    cy.getCategoriesRoutes()

    cy.visitFetch('/manage/incidents/')

    // Wait till page is loaded
    cy.wait('@getFilters')
    cy.wait('@getCategories')
    cy.wait('@getSignals')
    cy.wait('@getUserInfo')
  })

  it('Change servicebelofte of category', () => {

    // Open Categorieën menu
    cy.get(MENU_ITEMS.openMenu).click()
    cy.contains('Instellingen').click()
    cy.contains('Categorieën').click()

    // Wait for loading the Categorieën page
    cy.wait('@getDepartments')
    cy.wait('@getRoles')
    cy.wait('@getPermissions')
    cy.wait('@getCategories')

    // Check URL
    cy.url().should('include', '/instellingen/categorieen/')

    //Check h1
    cy.checkHeader('Categorieën')

    // Open category Afwatering brug
    cy.contains('Afwatering brug').click()

    // Check URL
    cy.url().should('include', 'instellingen/categorie/')

    // Wait for data category
    cy.wait('@getCategories')

    // Change category
    cy.get(CATEGORIES.inputDays).clear().type('4')
    cy.get(CATEGORIES.dropdownTypeOfDays).select('Dagen')
    cy.get(CATEGORIES.inputMessage).clear().type('Ik beoordeel deze melding niet, het lijkt me namelijk allemaal onzin')
    cy.get(CATEGORIES.buttonOpslaan).click()

    // Wait for saving the data
    cy.wait('@patchCategory')

    // Check if Categorieën page opens again
    cy.url().should('include', '/instellingen/categorieen/page/1')
    cy.checkHeader('Categorieën')

    // Check day change
    cy.get('[data-item-id="144"] > :nth-child(2)').should('contain', '4 dagen')

  })
})
describe('Create signal and validate service belofte', function () {

  beforeEach(function () {
    localStorage.setItem('accessToken', 'TEST123')
  })

  it('Initiate create signal from manage', () => {
    cy.server()
    cy.getManageSignalsRoutes()
    
    cy.visitFetch('/manage/incidents/')

    // Wait till page is loaded
    cy.wait('@getFilters')
    cy.wait('@getCategories')
    cy.wait('@getSignals')
    cy.wait('@getUserInfo')
    cy.get(MENU_ITEMS.openMenu).click()
    cy.contains('Melden').click()
    cy.checkHeader('Beschrijf uw melding')

  })

  it('Search for adress', () => {

    cy.server()
    cy.defineGeoSearchRoutes()
    cy.getAdressRoute('1069HM 224')

    // Check h1
    cy.checkHeader('Beschrijf uw melding')

    // Select source
    cy.get('select').select('Telefoon – Stadsdeel')

    // Search adress
    createSignal.searchAdress('1069HM 224')
    cy.wait('@getAdress')

    // Select found item  
    createSignal.selectAdress('Lederambachtstraat 224, 1069HM Amsterdam')
    cy.wait('@lookup')
      .wait('@location')
      .wait('@geoSearchLocation')

  })

  it('Fill in description and date', () => {

    cy.server()
    cy.route('POST', '**/signals/category/prediction', 'fixture:afwateringBrug.json').as('prediction')

    createSignal.inputDescription('Voor mijn deur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?')

    // Select datetime
    cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click()

    // Click on next
    cy.clickButton('Volgende')

  })

  it('Fill in phonenumber', () => {

    // Check URL
    cy.url().should('include', '/incident/telefoon')

    // Click next
    cy.clickButton('Volgende')

  })

  it('Fill in e-mailadres', () => {

    // Check URL
    cy.url().should('include', '/incident/email')

    // Click next
    cy.clickButton('Volgende')

  })

  it('Check overview', () => {

    // Check URL
    cy.url().should('include', '/incident/samenvatting')

    // Check h1
    cy.checkHeader('Controleer uw gegevens')

    cy.clickButton('Verstuur')

  })

  it('Last screen', () => {

    // Check URL
    cy.url().should('include', '/incident/bedankt')

    // Check h1
    cy.checkHeader('Bedankt!')

    cy.contains('Ik beoordeel deze melding niet, het lijkt me namelijk allemaal onzin')

  })

})

describe('Change back servicebelofte', function () {

  before(function () {
    
    localStorage.setItem('accessToken', 'TEST123')

    cy.server()
    cy.getManageSignalsRoutes()
    cy.getCategoriesRoutes()

    cy.visitFetch('/manage/incidents/')

    // Wait till page is loaded
    cy.wait('@getFilters')
    cy.wait('@getCategories')
    cy.wait('@getSignals')
    cy.wait('@getUserInfo')
  })

  it('Change back servicebelofte of category', () => {

    // Open Categorieën menu
    cy.get(MENU_ITEMS.openMenu).click()
    cy.contains('Instellingen').click()
    cy.contains('Categorieën').click()

    // Wait for loading the Categorieën page
    cy.wait('@getDepartments')
    cy.wait('@getRoles')
    cy.wait('@getPermissions')
    cy.wait('@getCategories')

    // Check URL
    cy.url().should('include', '/instellingen/categorieen/')

    cy.checkHeader('Categorieën')

    // Open category Afwatering brug
    cy.contains('Afwatering brug').click()

    // Check URL
    cy.url().should('include', 'instellingen/categorie/')

    // Wait for data category
    cy.wait('@getCategories')

    // Change category
    cy.get(CATEGORIES.inputDays).clear().type('5')
    cy.get(CATEGORIES.dropdownTypeOfDays).select('Werkdagen')
    cy.get(CATEGORIES.inputMessage).clear().type('  Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail.')
    cy.get(CATEGORIES.buttonOpslaan).click()

    // Wait for saving the data
    cy.wait('@patchCategory')

    // Check if Categorieën page opens again
    cy.url().should('include', '/instellingen/categorieen/page/1')
    cy.checkHeader('Categorieën')

    // Check day change
    cy.get('[data-item-id="144"] > :nth-child(2)').should('contain', '5 werkdagen')

  })
})
