import { CATEGORIES } from '../../support/selectorsSettings';
import { CONTAINERS, CREATE_SIGNAL } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/changeCategory.json';

describe('Create signal and choose other subcategory than proposed', () => {
  describe('Set up testdata', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });
    it('Set description for category', () => {
      cy.getManageSignalsRoutes();
      cy.getCategoriesRoutes();

      cy.visit('/manage/incidents/');
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
      cy.stubMap();
      cy.getManageSignalsRoutes();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.openMenu();
      cy.contains('Melden').click();
      cy.checkHeaderText('Beschrijf uw melding');
    });
    it('Should create the signal', () => {
      cy.stubPreviewMap();
      cy.postSignalRoutePrivate();

      cy.setDescriptionPage(signal);
      cy.get(CREATE_SIGNAL.dropdownSubcategory).select('Container is kapot (AEG)');
      cy.get(CREATE_SIGNAL.descriptionInfo).should('contain', 'Subcategorie voorstel: Wespen').and('be.visible');
      cy.get(CREATE_SIGNAL.infoText).should('contain', 'Een verhaal over een kapotte container').and('be.visible');
      cy.contains('Volgende').click();

      cy.checkSpecificInformationPage(signal);

      // Select container soort and number
      cy.contains(questions.afval.extra_container_kind.label).should('be.visible');
      cy.get(CONTAINERS.inputContainerSoort).eq(0).type('Een papiercontainer');
      cy.contains(questions.afval.extra_container_number.label).should('be.visible');
      cy.get(CONTAINERS.inputContainerNummer).eq(1).type('Nummertje 911');
      cy.contains('Volgende').click();

      cy.setPhonenumber(signal);
      cy.contains('Volgende').click();

      cy.setEmailAddress(signal);
      cy.contains('Volgende').click();

      cy.checkSummaryPage(signal);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPrivate');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

      cy.checkThanksPage();
      cy.saveSignalId();
    });
  });
  describe('Check data created signal', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      cy.stubPreviewMap();
      cy.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      cy.checkAllDetails(signal);
    });
  });
});
