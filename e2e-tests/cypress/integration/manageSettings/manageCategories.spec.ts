import { CATEGORIES } from '../../support/selectorsSettings';
import { CHANGE_CATEGORY, SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { CREATE_SIGNAL } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/signalForManageCategories.json';

describe('Manage categories', () => {
  describe('Change category ', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.getManageSignalsRoutes();
      cy.getCategoriesRoutes();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should change the attributes of the category and shows changes in history', () => {
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
      cy.get(CATEGORIES.inputName).clear().type('Afgewaterde brug');
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
      cy.get(CATEGORIES.categoryValue, { timeout: 10000 }).eq(0).should('contain', 'Afgewaterde brug');
      cy.get(CATEGORIES.categoryValue, { timeout: 10000 }).eq(1).should('contain', '4 dagen');

      cy.contains('Afgewaterde brug').click();
      cy.url().should('include', 'instellingen/categorie/');
      cy.get(CATEGORIES.historyAction).eq(0).should('contain', 'Afhandeltermijn gewijzigd naar').and('contain', '4 weekdagen');
      cy.get(CATEGORIES.historyAction).eq(0).should('contain', 'Naam gewijzigd naar:').and('contain', 'Afgewaterde brug');
      cy.get(CATEGORIES.historyAction).eq(0).should('contain', 'Servicebelofte gewijzigd naar:').and('contain', 'Ik beoordeel deze melding niet, het lijkt me namelijk allemaal onzin');
      cy.get(CATEGORIES.historyAction).eq(0).should('contain', 'Omschrijving gewijzigd naar:').and('contain', 'Dit is het verhaal van de brug die moest afwateren');
    });
    it('Should change the status of a category to inactive', () => {
      cy.openMenu();
      cy.contains('Instellingen').click();
      cy.contains('Categorieën').click();

      cy.waitForCategoriesRoutes();
      cy.checkHeaderText('Categorieën');
      cy.url().should('include', '/instellingen/categorieen/');

      cy.contains('Beplanting').click();
      cy.url().should('include', 'instellingen/categorie/');
      cy.wait('@getCategories');

      // Change category
      cy.get(CATEGORIES.radioButtonNietActief).click({ force: true }).should('be.checked');
      cy.get(CATEGORIES.buttonOpslaan).click();

      // Wait for saving the data
      cy.wait('@patchCategory');
      cy.wait('@getCategories');

      // Check if Categorieën page opens again
      cy.url().should('include', '/instellingen/categorieen/page/1');
      // Load page again, because page refresh is very slow and test fails
      cy.visit('/instellingen/categorieen/page/1');

      cy.contains('Beplanting').click();
      cy.get(CATEGORIES.historyAction).eq(0).should('contain', 'Status gewijzigd naar:').and('contain', 'Inactief');
      cy.get(CATEGORIES.buttonAnnuleren).click();

      // Load page again, because page refresh is very slow and test fails
      cy.visit('/instellingen/categorieen/page/1');
      cy.openMenu();
      cy.contains('Melden').click();
      cy.url().should('include', '/incident/beschrijf');
      cy.get(CREATE_SIGNAL.dropdownSubcategory).then($selectlist => {
        expect($selectlist).to.contain('Afgewaterde brug (STW, VOR)');
        expect($selectlist).to.not.contain('Beplanting');
      });
    });
  });
  describe('Create a signal and validate changes of category', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
    });

    it('Should initiate create signal', () => {
      cy.getManageSignalsRoutes();

      cy.visit('/incident/beschrijf/');

      cy.checkHeaderText('Beschrijf uw melding');
    });

    it('Should describe the signal', () => {
      cy.stubPreviewMap();
      cy.stubMap();
      cy.postSignalRoutePrivate();

      cy.setDescriptionPage(signal);
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
    it('Should show the change in category description', () => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.stubPreviewMap();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();

      // Open incident details
      cy.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      // Edit signal category
      cy.get(CHANGE_CATEGORY.buttonEdit).click();
      cy.get(CHANGE_CATEGORY.inputCategory).find(':selected').should('contain', 'Afgewaterde brug');
      cy.get(SIGNAL_DETAILS.infoText).should('contain', 'Dit is het verhaal van de brug die moest afwateren');
    });
  });
  describe('Change back servicebelofte', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.getManageSignalsRoutes();
      cy.getCategoriesRoutes();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Change back servicebelofte of category', () => {
      cy.openMenu();
      cy.contains('Instellingen').click();
      cy.contains('Categorieën').click();

      cy.waitForCategoriesRoutes();

      cy.url().should('include', '/instellingen/categorieen/');
      cy.checkHeaderText('Categorieën');

      cy.contains('Afgewaterde brug').click();
      cy.url().should('include', 'instellingen/categorie/');
      cy.wait('@getCategories');

      // Change category
      cy.get(CATEGORIES.inputName).clear().type('Afwatering brug');
      cy.get(CATEGORIES.inputDescription).clear().type('Dit is het verhaal van de brug die helemaal niet moest afwateren');
      cy.get(CATEGORIES.inputDays).clear().type('5');
      cy.get(CATEGORIES.dropdownTypeOfDays).select('Werkdagen');
      cy.get(CATEGORIES.inputMessage)
        .clear()
        .type(
          '  Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail.'
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
