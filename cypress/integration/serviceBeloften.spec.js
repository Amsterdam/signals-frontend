// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { CATEGORIES } from '../support/selectorsSettings';
import { CREATE_SIGNAL } from '../support/selectorsCreateSignal';

describe('Change servicebelofte', () => {
  before(() => { 
    localStorage.setItem('accessToken', 'TEST123');

    cy.server();
    cy.getManageSignalsRoutes();
    cy.getCategoriesRoutes();

    cy.visitFetch('/manage/incidents/');

    // Wait till page is loaded
    cy.wait('@getFilters');
    cy.wait('@getCategories');
    cy.wait('@getSignals');
    cy.wait('@getUserInfo');
  });

  it('Should change servicebelofte of category', () => {
    // Open Categorieën menu
    cy.openMenu();
    cy.contains('Instellingen').click();
    cy.contains('Categorieën').click();

    // Wait for loading the Categorieën page
    cy.wait('@getDepartments');
    cy.wait('@getRoles');
    cy.wait('@getPermissions');
    cy.wait('@getCategories');

    // Check URL
    cy.url().should('include', '/instellingen/categorieen/');

    // Check h1
    cy.checkHeaderText('Categorieën');

    // Open category Afwatering brug
    cy.contains('Afwatering brug').click();

    // Check URL
    cy.url().should('include', 'instellingen/categorie/');

    // Wait for data category
    cy.wait('@getCategories');

    // Change category
    cy.get(CATEGORIES.inputDays).clear().type('4');
    cy.get(CATEGORIES.dropdownTypeOfDays).select('Dagen');
    cy.get(CATEGORIES.inputMessage).clear().type('Ik beoordeel deze melding niet, het lijkt me namelijk allemaal onzin');
    cy.get(CATEGORIES.buttonOpslaan).click();

    // Wait for saving the data
    cy.wait('@patchCategory');

    // Check if Categorieën page opens again
    cy.url().should('include', '/instellingen/categorieen/page/1');
    cy.checkHeaderText('Categorieën');

    // Check day change
    cy.reload(true);
    cy.get('[data-testid=dataViewBody] > [data-testid=dataViewBodyRow]',{ timeout: 10000 }).first().contains('4 dagen');
  });
});
describe('Create a signal and validate service belofte', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', 'TEST123');
  });

  it('Should initiate create signal', () => {
    cy.server();
    cy.getManageSignalsRoutes();
 
    cy.visitFetch('/incident/beschrijf/');
    
    cy.checkHeaderText('Beschrijf uw melding');
  });

  it('Should search for an address', () => {
    cy.server();
    cy.defineGeoSearchRoutes();
    cy.getAddressRoute();

    // Check h1
    cy.checkHeaderText('Beschrijf uw melding');

    // Select source
    cy.get('select').select('Telefoon – Stadsdeel');

    // Search address
    createSignal.searchAddress('1069HM 224');
    cy.wait('@getAddress');

    // Select found item  
    createSignal.selectAddress('Lederambachtstraat 224, 1069HM Amsterdam');
    cy.wait('@geoSearchLocation');
  });

  it('Should enter description and date', () => {
    cy.server();
    cy.route('POST', '**/signals/category/prediction', 'fixture:afwateringBrug.json').as('prediction');

    createSignal.inputDescription('Voor mijn deur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?');

    // Select datetime
    cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click();

    // Click on next
    cy.clickButton('Volgende');
  });

  it('Should enter a phonenumber', () => {
    // Check URL
    cy.url().should('include', '/incident/telefoon');

    // Click next
    cy.clickButton('Volgende');
  });

  it('Should enter an email address', () => {
    // Check URL
    cy.url().should('include', '/incident/email');

    // Click next
    cy.clickButton('Volgende');
  });

  it('Should show an overview', () => {
    // Check URL
    cy.url().should('include', '/incident/samenvatting');

    // Check h1
    cy.checkHeaderText('Controleer uw gegevens');
  });

  it('Should show the last screen', () => {   
    cy.server();
    cy.postSignalRoutePrivate();

    cy.clickButton('Verstuur');

    cy.wait('@postSignalPrivate');
    
    // Check URL
    cy.url().should('include', '/incident/bedankt');

    // Check h1
    cy.checkHeaderText('Bedankt!');

    cy.contains('Ik beoordeel deze melding niet, het lijkt me namelijk allemaal onzin');
  }); 
});
describe('Change back servicebelofte', () => {
  before(() =>  {
    localStorage.setItem('accessToken', 'TEST123');

    cy.server();
    cy.getManageSignalsRoutes();
    cy.getCategoriesRoutes();

    cy.visitFetch('/manage/incidents/');

    // Wait till page is loaded
    cy.wait('@getFilters');
    cy.wait('@getCategories');
    cy.wait('@getSignals');
    cy.wait('@getUserInfo');
  });

  it('Change back servicebelofte of category', () => {
    // Open Categorieën menu
    cy.openMenu();
    cy.contains('Instellingen').click();
    cy.contains('Categorieën').click();

    // Wait for loading the Categorieën page
    cy.wait('@getDepartments');
    cy.wait('@getRoles');
    cy.wait('@getPermissions');
    cy.wait('@getCategories');

    // Check URL
    cy.url().should('include', '/instellingen/categorieen/');

    cy.checkHeaderText('Categorieën');

    // Open category Afwatering brug
    cy.contains('Afwatering brug').click();

    // Check URL
    cy.url().should('include', 'instellingen/categorie/');

    // Wait for data category
    cy.wait('@getCategories');

    // Change category
    cy.get(CATEGORIES.inputDays).clear().type('5');
    cy.get(CATEGORIES.dropdownTypeOfDays).select('Werkdagen');
    cy.get(CATEGORIES.inputMessage).clear().type('  Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail.');
    cy.get(CATEGORIES.buttonOpslaan).click();

    // Wait for saving the data
    cy.wait('@patchCategory');

    // Check if Categorieën page opens again
    cy.url().should('include', '/instellingen/categorieen/page/1');
    cy.checkHeaderText('Categorieën');

    // Check day change
    cy.reload(true);
    cy.get('[data-testid=dataViewBody] > [data-testid=dataViewBodyRow]',{ timeout: 10000 }).first().contains('5 werkdagen');
  });
});