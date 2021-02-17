import { CATEGORIES } from '../../support/selectorsSettings';
import { CREATE_SIGNAL } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/changeCategory.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as general from '../../support/commandsGeneral';

describe('Create signal and choose other subcategory than proposed', () => {
  describe('Set up testdata', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });
    it('Set description for category', () => {
      routes.getManageSignalsRoutes();
      routes.getCategoriesRoutes();

      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
      general.openMenu();
      cy.contains('Instellingen').click();
      cy.contains('Categorieën').click();

      routes.waitForCategoriesRoutes();
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
      routes.stubMap();
      routes.getManageSignalsRoutes();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
      general.openMenu();
      cy.contains('Melden').click();
      general.checkHeaderText('Beschrijf uw melding');
    });
    it('Should create the signal', () => {
      routes.stubPreviewMap();
      routes.postSignalRoutePrivate();

      createSignal.setDescriptionPage(signal);
      cy.get(CREATE_SIGNAL.dropdownSubcategory).select('Container is kapot (AEG)');
      cy.get(CREATE_SIGNAL.descriptionInfo).should('contain', 'Subcategorie voorstel: Wespen').and('be.visible');
      cy.get(CREATE_SIGNAL.infoText).should('contain', 'Een verhaal over een kapotte container').and('be.visible');
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(signal);

      cy.contains('Volgende').click();

      createSignal.setPhonenumber(signal);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(signal);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(signal);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPrivate');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

      createSignal.checkThanksPage();
      createSignal.saveSignalId();
    });
  });
  describe('Check data created signal', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.getManageSignalsRoutes();
      routes.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      routes.stubPreviewMap();
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(signal);
    });
  });
});
