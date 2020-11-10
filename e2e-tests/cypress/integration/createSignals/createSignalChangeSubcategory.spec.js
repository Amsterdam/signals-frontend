// <reference types="Cypress" />
import { CATEGORIES } from '../../support/selectorsSettings';
import * as createSignal from '../../support/commandsCreateSignal';
import { CONTAINERS, CREATE_SIGNAL } from '../../support/selectorsCreateSignal';
import { SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

describe('Create signal and choose other subcategory than proposed', () => {
  describe('Set up testdata', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });
    it('Set description for category', () => {
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getCategoriesRoutes();

      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.openMenu();
      cy.contains('Instellingen').click();
      cy.contains('Categorieën').click();

      cy.waitForCategoriesRoutes();
      cy.url().should('include', '/instellingen/categorieen/');

      cy.contains('Container is kapot').click();
      cy.url().should('include', 'instellingen/categorie/');
      cy.wait('@getCategories');

      // Change category
      cy.get(CATEGORIES.inputDescription).clear().type('Een verhaal over een kapotte container');
      cy.get(CATEGORIES.buttonOpslaan).click();

      // Wait for saving the data
      cy.wait('@patchCategory');
      cy.wait('@getCategories');

      // Check if Categorieën page opens again
      cy.url().should('include', '/instellingen/categorieen/page/1');
    });
  });
  describe('Create signal animals', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });
    it('Should initiate create signal from manage', () => {
      cy.server();
      cy.getManageSignalsRoutes();

      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.openMenu();
      cy.contains('Melden').click();
      cy.checkHeaderText('Beschrijf uw melding');

      // cy.visitFetch('incident/beschrijf');
    });
    it('Should search for an address', () => {
      cy.server();
      // cy.getAddressRoute();
      cy.route2('**/locatieserver/v3/suggest?fq=*').as('getAddress');
      cy.route('POST', '**/signals/category/prediction', 'fixture:predictions/wespen.json').as('prediction');

      createSignal.checkDescriptionPage();
      // Select source
      cy.get(CREATE_SIGNAL.dropdownSource).select('Interne melding');

      createSignal.setAddress('1012GX 23', 'Oudekerksplein 23, 1012GX Amsterdam');
      createSignal.setDescription('Er vliegen allemaal wespen in de kerk.');
      cy.get(CREATE_SIGNAL.dropdownSubcategory).select('Container is kapot (AEG)');
      createSignal.setDateTime('Nu');
      cy.get(CREATE_SIGNAL.descriptionInfo).should('contain', 'Subcategorie voorstel: Wespen').and('be.visible');
      cy.get(CREATE_SIGNAL.infoText).should('contain', 'Een verhaal over een kapotte container').and('be.visible');

      cy.contains('Laag').should('be.visible').click();

      cy.contains('Groot onderhoud').should('be.visible').click();

      cy.contains('Volgende').click();
    });

    it('Should enter specific information', () => {
      createSignal.checkSpecificInformationPage();

      cy.contains(Cypress.env('description')).should('be.visible');

      // Select container soort and number
      cy.contains(questions.afval.extra_container_kind.label).should('be.visible');
      cy.get(CONTAINERS.inputContainerSoort).eq(0).type('Een papiercontainer');
      cy.contains(questions.afval.extra_container_number.label).should('be.visible');
      cy.get(CONTAINERS.inputContainerNummer).eq(1).type('Nummertje 911');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.route2('**/maps/topografie?bbox=**').as('map');
      cy.route2('POST', '**/signals/v1/private/signals/').as('postSignalPrivate');

      cy.contains('Volgende').click();
      cy.wait('@map');
      createSignal.checkSummaryPage();

      // Check information provided by user
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');
      cy.contains('Container is kapot');
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPrivate');
    });

    it('Should show the last screen', () => {
      createSignal.checkThanksPage();
      // Capture signal id to check details later
      createSignal.getSignalId();
    });
  });
  describe('Check data created signal', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      // cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Centrum').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Oudekerksplein 23').and('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1012GX Amsterdam').and('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Laag').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Groot onderhoud').and('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Container is kapot (AEG)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Afval').and('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'Interne melding').and('be.visible');
    });
  });
});
