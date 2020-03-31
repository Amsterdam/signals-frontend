// <reference types="Cypress" />

import * as createSignal from '../support/commands-create-signal'
import { LANTAARNPAAL, CREATE_SIGNAL} from '../support/selectors-create-signal'

describe('Create signal lantaarnpaal', function () {

  before(function () {
    cy.server()
    cy.defineGeoSearchRoutes()
    cy.getAdressRoute('1077WV 59')

    // Open homepage
    cy.visitFetch('incident/beschrijf')

  })

  it('Search for adress', () => {

    // Check h1
    cy.checkHeader('Beschrijf uw melding')

    // Search adress
    createSignal.searchAdress('1077WV 59')
    cy.wait('@getAdress')

    // Select found item  
    createSignal.selectAdress('Prinses Irenestraat 59, 1077WV Amsterdam')
    cy.wait('@lookup')
      .wait('@location')
      .wait('@geoSearchLocation')

  })

  it('Fill in description,date and upload picture', () => {
    cy.server()
    cy.route('POST', '**/signals/category/prediction', 'fixture:lantaarnpaal.json').as('prediction')

    createSignal.inputDescription('De lantaarnpaal voor mijn deur is kapot')

    // Select datetime
    cy.get(CREATE_SIGNAL.radioButtonTijdstipEerder).click()
    cy.get(CREATE_SIGNAL.dropdownDag).select('Vandaag')
    cy.get(CREATE_SIGNAL.dropdownUur).select('5')
    cy.get(CREATE_SIGNAL.dropdownMinuten).select('45')

    // Upload a file (uses cypress-file-upload plugin)
    const fileName = 'logo.png';
    cy.get(CREATE_SIGNAL.buttonUploadFile).attachFile(fileName);

    // Click on next
    cy.clickButton('Volgende')

  })

  it('Fill in specific information', () => {

    // Check URL
    cy.url().should('include', '/incident/vulaan')

    // Check h1
    cy.checkHeader('Dit hebben we nog van u nodig')
    cy.contains('De lantaarnpaal voor mijn deur is kapot')

    // Click on next without retry to invoke error message
    cy.contains('Volgende').click()

    cy.get(LANTAARNPAAL.errorRadioGevaarlijkRequiredField).contains('Dit is een verplicht veld')

    // Check on visibility of the message to make a phone call directly after selecting one of the first four options
    const messageCallDirectly = 'Bel direct 14 020. U hoeft dit formulier niet meer verder in te vullen.'

    cy.get(LANTAARNPAAL.radioButtonAanrijding).click()
    cy.contains(messageCallDirectly)

    cy.get(LANTAARNPAAL.radioButtonOpGrond).click()
    cy.contains(messageCallDirectly)

    cy.get(LANTAARNPAAL.radioButtonDeur).click()
    cy.contains(messageCallDirectly)

    cy.get(LANTAARNPAAL.radioButtonLosseKabels).click()
    cy.contains(messageCallDirectly)

    cy.get(LANTAARNPAAL.radioButtonNietGevaarlijk).click()
    cy.contains(messageCallDirectly).should('not.exist')

    // Click on next without retry to invoke error message
    cy.contains('Volgende').click()
    cy.get(LANTAARNPAAL.errorRadioHoeveelRequiredField).contains('Dit is een verplicht veld')

    cy.get(LANTAARNPAAL.radioButtonEenLichtpunt).click()

    // TODO check optie aantal lichtpunten ook

    cy.contains('Lamp doet het niet').should('be.visible').click()
    cy.contains('Lamp brandt overdag').should('be.visible').click()
    cy.contains('Geeft lichthinder (schijnt bijvoorbeeld in de slaapkamer)').should('be.visible').click()
    cy.contains('Lichtpunt is vervuild of heeft aanslag').should('be.visible').click()
    cy.contains('Lichtpunt is zichtbaar beschadigd en/of incompleet').should('be.visible').click()
    cy.contains('Overig').should('be.visible').click()

  })

  it('Select light on map', () => {

    // Click on lamp based on coordinate
    createSignal.selectLampOnCoordinate(338, 179)

    // Check options in legend
    cy.get('.legend-header').should('be.visible')
    cy.get('.legend-content').should('be.visible')
    cy.contains('Lantaarnpaal').should('be.visible')
    cy.contains('Grachtmast').should('be.visible')
    cy.contains('Lamp aan kabel').should('be.visible')
    cy.contains('Lamp aan gevel').should('be.visible')
    cy.contains('Schijnwerper').should('be.visible')
    cy.contains('Overig lichtpunt').should('be.visible')

    // Click on next
    cy.clickButton('Volgende')
  })

  it('Fill in phonenumber', () => {

    // Check URL
    cy.url().should('include', '/incident/telefoon')

    // Check h1
    cy.checkHeader('Mogen we u bellen voor vragen?')

    cy.clickButton('Volgende')
  })

  it('Fill in e-mailadres', () => {

    // Check URL
    cy.url().should('include', '/incident/email')

    // Check h1
    cy.checkHeader('Wilt u op de hoogte blijven?')

    cy.clickButton('Volgende')

  })

  it('Check overview', () => {

    // Check URL
    cy.url().should('include', '/incident/samenvatting')

    // Check h1
    cy.checkHeader('Controleer uw gegevens')

    // Check on information provided by user
    cy.contains('Prinses Irenestraat 59, 1077WV Amsterdam').should('be.visible')
    cy.contains('De lantaarnpaal voor mijn deur is kapot').should('be.visible')
    cy.contains('Vandaag, 5:45').should('be.visible')
    cy.get(CREATE_SIGNAL.imageAdressMarker).find("img").should('be.visible')
    cy.get(CREATE_SIGNAL.imageFileUpload).should('be.visible')
    cy.contains('Niet gevaarlijk').should('be.visible')
    cy.contains('1 lichtpunt').should('be.visible')
    cy.contains('Overig').should('be.visible')
    cy.contains('013991').should('be.visible')

    // Click on next
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