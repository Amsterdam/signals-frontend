import * as requests from '../../support/commandsRequests';
import { DEPARTMENTS, MENU } from '../../support/selectorsSettings';
import { CHANGE_CATEGORY, SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { generateToken } from '../../support/jwt';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as general from '../../support/commandsGeneral';

describe('Manage departments', () => {
  describe('Visit department page', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.getManageSignalsRoutes();
      routes.getCategoriesRoutes();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });
    it('Should visit the manage department page by menu', () => {
      general.openMenu();
      cy.contains('Instellingen').click();
      cy.contains('Afdelingen').click();

      routes.waitForCategoriesRoutes();
      cy.get(MENU.buttonMenu).click();
      cy.url().should('include', '/instellingen/afdelingen');
      general.checkHeaderText('Afdelingen');
      cy.get('th').eq(0).should('have.text', 'Naam').and('be.visible');
      cy.get('th').eq(1).should('have.text', 'Categorie').and('be.visible');
    });
  });
  describe('Edit department', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.defineDepartmentRoutes();
      cy.visit('/instellingen/afdelingen');
    });

    it('Should edit a department', () => {
      cy.get('tr').eq(1).click();
      cy.wait('@getDepartment');
      cy.get(DEPARTMENTS.departmentDetail).find('h2').should('have.text', 'Afdeling').and('be.visible');
      cy.get(DEPARTMENTS.categoryLists).contains('Verantwoordelijk voor categorie').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });
      cy.get(DEPARTMENTS.categoryLists).contains('Toegang tot categorie').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });
      // If 'responsible for category' is selected, access to category will be checked automatically
      cy.get(DEPARTMENTS.checkboxAsbestAccu).eq(0).should('not.be.checked');
      cy.get(DEPARTMENTS.checkboxAsbestAccu).eq(1).should('not.be.checked');
      cy.get(DEPARTMENTS.checkboxAsbestAccu).eq(0).check().should('be.checked');
      cy.get(DEPARTMENTS.checkboxAsbestAccu).eq(1).should('be.checked').and('be.disabled');

      cy.get(DEPARTMENTS.buttonOpslaan).click();
      cy.wait('@patchDepartment');
      cy.get(DEPARTMENTS.notification).should('have.text', "Afdeling 'Actie Service Centrum' bijgewerkt");
      cy.url().should('include', '/instellingen/afdelingen');
      // Because page doesn't refresh automatically, page is reloaded
      cy.visit('/instellingen/afdelingen');
      cy.get('td').eq(1).should('contain', 'Asbest / accu');
      cy.get('tr').eq(1).click();
      cy.wait('@getDepartment');
      cy.get(DEPARTMENTS.checkboxAsbestAccu).eq(0).check().should('be.checked');
      cy.get(DEPARTMENTS.checkboxAsbestAccu).eq(1).should('be.checked').and('be.disabled');
      cy.get(DEPARTMENTS.checkboxAsbestAccu).eq(0).uncheck().should('not.be.checked');
      cy.get(DEPARTMENTS.buttonOpslaan).click();
      cy.wait('@patchDepartment');
    });
    it('Should cancel editing a department', () => {
      cy.get('td').eq(3).should('not.contain', 'Wildplassen / poepen / overgeven');
      cy.get('tr').eq(2).click();
      cy.wait('@getDepartment');
      cy.get(DEPARTMENTS.checkboxWildplassenPoepen).check({ force: true }).should('be.checked');
      cy.get(DEPARTMENTS.buttonAnnuleren).click();
      // Because page doesn't refresh automatically, page is reloaded
      cy.visit('/instellingen/afdelingen');
      cy.get('td').eq(3).should('not.contain', 'Wildplassen / poepen / overgeven');
    });
  });
  describe('Edit responsible department and check signal category', () => {
    describe('Testdata', () => {
      it('Should setup testdata', () => {
        requests.createSignalRandom();
      });
    });
    describe('Change signal category', () => {
      before(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        routes.stubPreviewMap();
        routes.getManageSignalsRoutes();
        routes.getSignalDetailsRoutesById();
        cy.visit('/manage/incidents/');
        routes.waitForManageSignalsRoutes();
      });
      it('Should change signal category', () => {
        createSignal.openCreatedSignal();
        routes.waitForSignalDetailsRoutes();
        cy.get(CHANGE_CATEGORY.buttonEdit).click();
        cy.get(CHANGE_CATEGORY.inputCategory).select('Drank- / drugsoverlast (ASC, THO)');
        cy.get(CHANGE_CATEGORY.buttonSubmit).click();
      });
    });
    describe('Change responsible department', () => {
      before(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        routes.defineDepartmentRoutes();
        cy.visit('/instellingen/afdelingen');
      });
      it('Should change the responsible department', () => {
        cy.get('tr').eq(3).click();
        cy.wait('@getDepartment');
        cy.get(DEPARTMENTS.checkboxDrankDrugsOverlast).check({ force: true }).should('be.checked');
        cy.get(DEPARTMENTS.buttonOpslaan).click();
      });
    });
    describe('Should change signal again and check responsible department', () => {
      before(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        routes.stubPreviewMap();
        routes.getManageSignalsRoutes();
        routes.getSignalDetailsRoutesById();
        cy.visit('/manage/incidents/');
        routes.waitForManageSignalsRoutes();
      });
      it('Should change signal category and check responsible department', () => {
        createSignal.openCreatedSignal();
        routes.waitForSignalDetailsRoutes();
        cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Drank- / drugsoverlast (CCA, ASC, THO)').and('be.visible');
      });
    });
    describe('Change responsible department to initial state', () => {
      before(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        routes.defineDepartmentRoutes();
        cy.visit('/instellingen/afdelingen');
      });
      it('Should change the responsible department to initial state', () => {
        cy.get('tr').eq(3).click();
        cy.wait('@getDepartment');
        cy.get(DEPARTMENTS.checkboxDrankDrugsOverlast).eq(0).uncheck().should('not.be.checked');
        cy.get(DEPARTMENTS.buttonOpslaan).click();
      });
    });
  });
});
