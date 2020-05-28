// <reference types="Cypress" />

import * as createSignal from '../support/commandsCreateSignal';
import { CATEGORIES } from '../support/selectorsSettings';
import { SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
describe('Change category', () => {
  describe('Change category ', () => {
    before(() => { 
      localStorage.setItem('accessToken', (Cypress.env('token')));

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

    it('Should change servicebelofte and description of category', () => {
    // Open Categorieën menu
      cy.openMenu();
      cy.contains('Instellingen').click();
      cy.contains('Categorieën').click();

      // Wait for loading the Categorieën page
      cy.wait('@getDepartments');
      cy.wait('@getRoles');
      cy.wait('@getPermissions');
      cy.wait('@getCategories');

      cy.url().should('include', '/instellingen/categorieen/');

      cy.checkHeaderText('Categorieën');

      // Open category Afwatering brug
      cy.contains('Afwatering brug').click();
      cy.url().should('include', 'instellingen/categorie/');
      cy.wait('@getCategories');

      // Change category
      cy.get(CATEGORIES.inputDescription).clear().type('Dit is het verhaal van de brug die moest afwateren');
      cy.get(CATEGORIES.inputDays).clear().type('4');
      cy.get(CATEGORIES.dropdownTypeOfDays).select('Dagen');
      cy.get(CATEGORIES.inputMessage).clear().type('Ik beoordeel deze melding niet, het lijkt me namelijk allemaal onzin');
      cy.get(CATEGORIES.buttonOpslaan).click();

      // Wait for saving the data
      cy.wait('@patchCategory');
      cy.wait('@getCategories');

      // Check if Categorieën page opens again
      cy.url().should('include', '/instellingen/categorieen/page/1');
      cy.checkHeaderText('Categorieën');

      // Check day change
      cy.get('[data-testid=dataViewBody] > [data-testid=dataViewBodyRow]',{ timeout: 10000 }).first().contains('4 dagen');
    });
  });
  describe('Create a signal and validate changes of category', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', (Cypress.env('token')));
    });

    it('Should initiate create signal', () => {
      cy.server();
      cy.getManageSignalsRoutes();
 
      cy.visitFetch('/incident/beschrijf/');
    
      cy.checkHeaderText('Beschrijf uw melding');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:afwateringBrug.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1069HM 224','Lederambachtstraat 224, 1069HM Amsterdam');
      createSignal.setDescription('Voor mijn deur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?');
      createSignal.setDateTime('Nu');

      // Select source
      cy.get('select').select('Telefoon – Stadsdeel');

      cy.clickButton('Volgende');
    });

    it('Should enter a phonenumber and email address', () => {
      cy.clickButton('Volgende');
      cy.clickButton('Volgende');
    });

    it('Should show an overview', () => {
      cy.url().should('include', '/incident/samenvatting');
      cy.checkHeaderText('Controleer uw gegevens');
    });

    it('Should show the last screen', () => {   
      cy.server();
      cy.postSignalRoutePrivate();

      cy.clickButton('Verstuur');
      cy.wait('@postSignalPrivate');
      cy.contains('Ik beoordeel deze melding niet, het lijkt me namelijk allemaal onzin');
      createSignal.checkThanksPage();
      // Capture signal id to check details later
      createSignal.getSignalId();
    });
    it('Should show the change in category description', () => {   
      localStorage.setItem('accessToken', (Cypress.env('token')));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutes();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      
      // Open incident details
      cy.get('[href*="/manage/incident/"]').contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();

      // Edit signal category
      cy.get('dt').contains('Subcategorie').find(SIGNAL_DETAILS.buttonEdit).click();
      cy.get(SIGNAL_DETAILS.infoText).should('contain', 'Dit is het verhaal van de brug die moest afwateren');
    }); 
  });
  // describe('Change back servicebelofte', () => {
  //   before(() =>  {
  //     localStorage.setItem('accessToken', (Cypress.env('token')));

  //     cy.server();
  //     cy.getManageSignalsRoutes();
  //     cy.getCategoriesRoutes();

  //     cy.visitFetch('/manage/incidents/');

  //     cy.waitForManageSignalsRoutes();
  //   });

  //   it('Change back servicebelofte of category', () => {
  //     // Open Categorieën menu
  //     cy.openMenu();
  //     cy.contains('Instellingen').click();
  //     cy.contains('Categorieën').click();

  //     // Wait for loading the Categorieën page
  //     cy.wait('@getDepartments');
  //     cy.wait('@getRoles');
  //     cy.wait('@getPermissions');
  //     cy.wait('@getCategories');

  //     cy.url().should('include', '/instellingen/categorieen/');
  //     cy.checkHeaderText('Categorieën');

  //     // Open category Afwatering brug
  //     cy.contains('Afwatering brug').click();
  //     cy.url().should('include', 'instellingen/categorie/');
  //     cy.wait('@getCategories');

  //     // Change category
  //     cy.get(CATEGORIES.inputDays).clear().type('5');
  //     cy.get(CATEGORIES.dropdownTypeOfDays).select('Werkdagen');
  //     cy.get(CATEGORIES.inputMessage).clear().type('  Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail.');
  //     cy.get(CATEGORIES.buttonOpslaan).click();

  //     // Wait for saving the data
  //     cy.wait('@patchCategory');
  //     cy.wait('@getCategories');

  //     // Check if Categorieën page opens again
  //     cy.url().should('include', '/instellingen/categorieen/page/1');
  //     cy.checkHeaderText('Categorieën');

  //     // Check day change
  //     cy.get('[data-testid=dataViewBody] > [data-testid=dataViewBodyRow]',{ timeout: 10000 }).first().contains('5 werkdagen');
  //   });
  // });
});