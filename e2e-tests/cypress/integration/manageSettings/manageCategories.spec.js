// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { CATEGORIES } from '../../support/selectorsSettings';
import { CREATE_SIGNAL } from '../../support/selectorsCreateSignal';
import { CHANGE_CATEGORY, SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { generateToken } from '../../support/jwt';

describe('Manage categories', () => {
  describe('Change category ', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getCategoriesRoutes();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should change servicebelofte and description of category', () => {
      cy.openMenu();
      cy.contains('Instellingen').click();
      cy.contains('Categorieën').click();

      cy.waitForCategoriesRoutes();
      cy.checkHeaderText('Categorieën');
      cy.url().should('include', '/instellingen/categorieen/');

      // Open category Afwatering brug
      cy.contains('Afwatering brug').click();
      cy.url().should('include', 'instellingen/categorie/');
      cy.wait('@getCategories');

      // Change category
      cy.get(CATEGORIES.inputDescription).clear().type('Dit is het verhaal van de brug die moest afwateren');
      cy.get(CATEGORIES.inputDays).clear().type('4');
      cy.get(CATEGORIES.dropdownTypeOfDays).select('Dagen');
      cy.get(CATEGORIES.inputMessage)
        .clear()
        .type('Ik beoordeel deze melding niet, het lijkt me namelijk allemaal onzin');
      cy.get(CATEGORIES.buttonOpslaan).click();

      // Wait for saving the data
      cy.wait('@patchCategory');
      cy.wait('@getCategories');

      // Check if Categorieën page opens again
      cy.url().should('include', '/instellingen/categorieen/page/1');
      // Load page again, because page refresh is very slow and test fails
      cy.visit('/instellingen/categorieen/page/1');
      cy.checkHeaderText('Categorieën');
      cy.get('[data-testid=dataViewBody] > [data-testid=dataViewBodyRow]', { timeout: 10000 })
        .first()
        .contains('4 dagen');
    });
  });
  describe('Create a signal and validate changes of category', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });

    it('Should initiate create signal', () => {
      cy.server();
      cy.getManageSignalsRoutes();

      cy.visitFetch('/incident/beschrijf/');

      cy.checkHeaderText('Beschrijf uw melding');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:predictions/afwateringBrug.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1069HM 224', 'Lederambachtstraat 224, 1069HM Amsterdam');
      createSignal.setDescription(
        'Voor mijn deur ligt allemaal afval op de stoep, zouden jullie ervoor kunnen zorgen dat dit wordt opgeruimd?',
      );
      createSignal.setDateTime('Nu');

      // Select source
      cy.get(CREATE_SIGNAL.dropdownSource).select('Telefoon – Stadsdeel');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.server();
      cy.route('/maps/topografie?bbox=**').as('map');
      cy.postSignalRoutePrivate();

      cy.contains('Volgende').click();
      cy.wait('@map');
      createSignal.checkSummaryPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      cy.contains('Verstuur').click();
      cy.wait('@postSignalPrivate');
      cy.contains('Ik beoordeel deze melding niet, het lijkt me namelijk allemaal onzin');
    });

    it('Should show the last screen', () => {
      createSignal.checkThanksPage();
      // Capture signal id to check details later
      createSignal.getSignalId();
    });
    it('Should show the change in category description', () => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();

      // Open incident details
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      // Edit signal category
      cy.get(CHANGE_CATEGORY.buttonEdit).click();
      cy.get(SIGNAL_DETAILS.infoText).should('contain', 'Dit is het verhaal van de brug die moest afwateren');
    });
  });
  describe('Change back servicebelofte', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getCategoriesRoutes();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Change back servicebelofte of category', () => {
      cy.openMenu();
      cy.contains('Instellingen').click();
      cy.contains('Categorieën').click();

      cy.waitForCategoriesRoutes();

      cy.url().should('include', '/instellingen/categorieen/');
      cy.checkHeaderText('Categorieën');

      // Open category Afwatering brug
      cy.contains('Afwatering brug').click();
      cy.url().should('include', 'instellingen/categorie/');
      cy.wait('@getCategories');

      // Change category
      cy.get(CATEGORIES.inputDays).clear().type('5');
      cy.get(CATEGORIES.dropdownTypeOfDays).select('Werkdagen');
      cy.get(CATEGORIES.inputMessage)
        .clear()
        .type(
          '  Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail.',
        );
      cy.get(CATEGORIES.buttonOpslaan).click();

      // Wait for saving the data
      cy.wait('@patchCategory');
      cy.wait('@getCategories');

      // Check if Categorieën page opens again
      cy.url().should('include', '/instellingen/categorieen/page/1');
      // Load page again, because page refresh is very slow and test fails
      cy.visit('/instellingen/categorieen/page/1');
      cy.checkHeaderText('Categorieën');
      cy.get('[data-testid=dataViewBody] > [data-testid=dataViewBodyRow]', { timeout: 10000 })
        .first()
        .contains('5 werkdagen');
    });
  });
});
