/* eslint-disable max-nested-callbacks */
// <reference types="Cypress" />
import * as requests from '../../support/commandsRequests';
import * as deelmelding from '../../support/commandsDeelmeldingen';
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL } from '../../support/selectorsCreateSignal';
import { CHANGE_STATUS, CHANGE_URGENCY, DEELMELDING, SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { FILTER, MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/deelmelding.json';

describe('Deelmeldingen', () => {
  describe('Set up data in Django admin', () => {
    before(() => {
      cy.visit(`${Cypress.env('backendUrl')}/signals/admin`);
    });
    it('Should set can manage', () => {
      cy.get('#id_username').type('signals.admin@example.com');
      cy.get('#id_password').type('password');
      cy.contains('Aanmelden').click();
      cy.get('a[href="/signals/admin/signals/department/"]').eq(1).click();
      cy.contains('ASC').click();
      cy.get('#id_can_direct').check().should('be.checked');
      cy.get('[name="_save"]').click();
      cy.get('a[href="/signals/admin/logout/"]').click();
    });
  });
  describe('Create Deelmeldingen', () => {
    describe('Set up data', () => {
      beforeEach(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      });
      it('Initiate create signal from manage', () => {
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

        createSignal.setDescriptionPage(fixturePath);
        cy.get(CREATE_SIGNAL.dropdownSubcategory).select('Snel varen (ASC, WAT)');

        cy.contains('Volgende').click();
        cy.contains('Volgende').click();
        createSignal.setPhonenumber(fixturePath);
        cy.contains('Volgende').click();

        createSignal.setEmailAddress(fixturePath);
        cy.contains('Volgende').click();

        createSignal.checkSummaryPage(fixturePath);
        cy.contains('Verstuur').click();
        cy.wait('@postSignalPrivate');
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

        createSignal.checkThanksPage();
        createSignal.saveSignalId();
      });
    });
    describe('Create Deelmeldingen', () => {
      beforeEach(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        cy.stubPreviewMap();
        cy.getManageSignalsRoutes();
        cy.getSignalDetailsRoutesById();
        cy.visit('/manage/incidents/');
        cy.waitForManageSignalsRoutes();
      });
      it('Should cancel creating deelmeldingen', () => {
        createSignal.openCreatedSignal();
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();

        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        cy.get(DEELMELDING.buttonCancel).click();
        cy.wait('@getSignal');
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}`);
        });
      });
      it('Should create 3 deelmeldingen from signal', () => {
        cy.postDeelmeldingenRoute();
        cy.patchSignalRoute();
        cy.getDeelmeldingenRoute();
        createSignal.openCreatedSignal();
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        cy.get(DEELMELDING.radioButtonVerantwoordelijkeAfdeling).should('be.checked');
        cy.get(DEELMELDING.radioButtonASC).check({ force: true });
        cy.get(DEELMELDING.inputNote).type('Het staat genoteerd!');
        cy.get(DEELMELDING.buttonAdd).click();
        cy.get(DEELMELDING.buttonAdd).click();

        deelmelding.setDeelmelding('1', '1', 'Snel varen', 'Er vaart iemand te hard onder de Berlagebrug door.');
        deelmelding.setDeelmelding('2', '2', 'Brug', 'De Berlagebrug is stuk.');
        deelmelding.setDeelmelding('3', '3', 'Olie op het water', 'In de buurt van de Berlagebrug ligt een plas olie op het water.');

        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.wait('@patchSignal');
        cy.get(DEELMELDING.notification).should('have.text', 'Deelmelding gemaakt').and('be.visible');
        cy.wait('@getSignal');
        cy.wait('@getDeelmeldingen');

        createSignal.checkSignalDetailsPage();
        createSignal.checkRedTextStatus('Gemeld');
        cy.get(SIGNAL_DETAILS.titleDeelmelding).should('have.text', 'Deelmelding').and('be.visible');
        cy.get(SIGNAL_DETAILS.deelmeldingen).find('li').should('have.length', 3).and('have.css', 'background-color', 'rgb(230, 230, 230)');

        cy.get(SIGNAL_DETAILS.historyAction).eq(0).contains('Regie gewijzigd naar: ASC').should('be.visible');
        cy.get(SIGNAL_DETAILS.historyAction).eq(1).contains('Notitie toegevoegd:').should('be.visible');
        cy.get(SIGNAL_DETAILS.historyListItem).eq(0).contains('Het staat genoteerd!');
        cy.get(SIGNAL_DETAILS.historyAction).eq(2).contains('Deelmelding toegevoegd').should('be.visible');
        cy.get(SIGNAL_DETAILS.historyAction).eq(3).contains('Deelmelding toegevoegd').should('be.visible');
        cy.get(SIGNAL_DETAILS.historyAction).eq(4).contains('Deelmelding toegevoegd').should('be.visible');

        deelmelding.checkDeelmelding('1', 'Snel varen', 'Gemeld', '3 werkdagen');
        deelmelding.checkDeelmelding('2', 'Brug', 'Gemeld', '21 dagen');
        deelmelding.checkDeelmelding('3', 'Olie op het water', 'Gemeld', '3 dagen');

        // Check signal data deelmelding 01
        cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(0).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(0).click();
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.get(SIGNAL_DETAILS.linkParent).should('have.text', json.signalId).and('be.visible');
        });
        cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Oost').should('be.visible');
        cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Weesperzijde 159-1').should('be.visible');
        cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1097DS Amsterdam').should('be.visible');
        cy.get(SIGNAL_DETAILS.email).should('have.text', '').should('be.visible');
        cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').should('be.visible');
        cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

        // Open and close uploaded pictures
        cy.get(SIGNAL_DETAILS.photo).eq(0).should('be.visible').click();
        cy.get(SIGNAL_DETAILS.photoViewerImage).should('be.visible');
        cy.get(SIGNAL_DETAILS.buttonCloseImageViewer).click();
        cy.get(SIGNAL_DETAILS.photo).eq(1).should('be.visible').click();
        cy.get(SIGNAL_DETAILS.photoViewerImage).should('be.visible');
        cy.get(SIGNAL_DETAILS.buttonCloseImageViewer).click();

        createSignal.checkCreationDate();
        cy.get(SIGNAL_DETAILS.handlingTime).should('have.text', '3 werkdagen').and('be.visible');
        createSignal.checkRedTextStatus('Gemeld');
        cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
        cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').should('be.visible');
        cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Snel varen (ASC, WAT)').and('be.visible');
        cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Overlast op het water').should('be.visible');
        cy.get(SIGNAL_DETAILS.source).should('have.text', 'Interne melding').should('be.visible');
      });
      it('Should change directing department', () => {
        createSignal.openCreatedSignal();
        cy.get(DEELMELDING.buttonEditDirectingDepartment).click();
        cy.get(DEELMELDING.radioButtonEditASC).should('be.checked');
        cy.get(DEELMELDING.radioButtonEditVerantwoordelijkeAfdeling).check({ force: true }).should('be.checked');
        cy.get(DEELMELDING.buttonSubmitDirectingDepartment).click();
        createSignal.checkFlashingYellow();
        cy.get(SIGNAL_DETAILS.directingDepartment).should('have.text', 'Verantwoordelijke afdeling').and('be.visible');
      });
      it('Should filter on "Hoofdmelding zonder wijziging in deelmelding"', () => {
        cy.getSortedRoutes();

        // Filter on deelmelding not modified, signal is visible
        cy.get(MANAGE_SIGNALS.buttonFilteren).click();
        cy.get(FILTER.checkboxHoofdmeldingGeenWijzigingDeelmelding).check().should('be.checked');
        cy.get(FILTER.buttonSubmitFilter).click();
        cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'Hoofdmelding zonder wijziging in deelmelding').and('be.visible');
        cy.get('th').contains('Id').click();
        cy.wait('@getSortedASC');
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
        cy.get('th').contains('Id').click();
        cy.wait('@getSortedDESC');
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.get(MANAGE_SIGNALS.firstSignalId).should('have.text', `${json.signalId}`);
        });

        // Filter on deelmelding modified, signal is not visible
        cy.get(MANAGE_SIGNALS.buttonFilteren).click();
        cy.get(FILTER.checkboxHoofdmeldingGeenWijzigingDeelmelding).uncheck().should('not.be.checked');
        cy.get(FILTER.checkboxHoofdmeldingWijzigingDeelmelding).check().should('be.checked');
        cy.get(FILTER.buttonSubmitFilter).click();
        cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'Hoofdmelding met wijziging in deelmelding').and('be.visible');
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
        deelmelding.checkSignalNotVisible();
      });
      it('Should change a deelmelding', () => {
        cy.getSignalDetailsRoutes();

        createSignal.openCreatedSignal();
        cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(0).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(1).click();

        cy.waitForSignalDetailsRoutes();
        cy.wait('@getTerms');

        cy.get(CHANGE_URGENCY.buttonEdit).click();
        cy.get(CHANGE_URGENCY.radioButtonNormaal).should('be.checked');
        cy.get(CHANGE_URGENCY.radioButtonHoog).click({ force: true });
        cy.get(CHANGE_URGENCY.buttonSubmit).click();
        cy.wait('@getSignals');
        cy.get(SIGNAL_DETAILS.linkParent).click();
        cy.get(DEELMELDING.childIncident).first().should('have.css', 'border-left-color', 'rgb(254, 200, 19)');
      });
      it('Should filter on "Hoofdmelding met wijziging in deelmelding"', () => {
        cy.getSortedRoutes();

        // Filter on deelmelding modified, signal is visible
        cy.get(MANAGE_SIGNALS.buttonFilteren).click();
        cy.get(FILTER.checkboxHoofdmeldingWijzigingDeelmelding).check().should('be.checked');
        cy.get(FILTER.buttonSubmitFilter).click();
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
        cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'Hoofdmelding met wijziging in deelmelding').and('be.visible');
        cy.get('th').contains('Id').click();
        cy.wait('@getSortedASC');
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
        cy.get('th').contains('Id').click();
        cy.wait('@getSortedDESC');
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.get(MANAGE_SIGNALS.firstSignalId).should('have.text', `${json.signalId}`);
        });

        // Filter on deelmelding not modified, signal is not visible
        cy.get(MANAGE_SIGNALS.buttonFilteren).click();
        cy.get(FILTER.checkboxHoofdmeldingWijzigingDeelmelding).uncheck().should('not.be.checked');
        cy.get(FILTER.checkboxHoofdmeldingGeenWijzigingDeelmelding).check().should('be.checked');
        cy.get(FILTER.buttonSubmitFilter).click();
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
        cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'Hoofdmelding zonder wijziging in deelmelding').and('be.visible');
        deelmelding.checkSignalNotVisible();
      });
      it('Should click "no action" after deelmelding change', () => {
        cy.patchSignalRoute();
        cy.getDeelmeldingenRoute();
        cy.getSignalDetailsRoutes();
        createSignal.openCreatedSignal();
        cy.get(DEELMELDING.buttonNoAction).should('be.visible').click();

        cy.wait('@patchSignal');
        cy.wait('@getSignal');
        cy.wait('@getHistory');
        cy.wait('@getDeelmeldingen');
        cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 13);

        cy.get(SIGNAL_DETAILS.historyAction).eq(0).should('have.text', 'Notitie toegevoegd:Geen actie nodig').and('be.visible');
        cy.get(DEELMELDING.childIncident).first().should('have.css', 'border-left-color', 'rgb(0, 0, 0)');
      });
      it('Should change status hoofdmelding to geannuleerd', () => {
        cy.patchSignalRoute();
        cy.getDeelmeldingenRoute();
        createSignal.openCreatedSignal();
        // Used a wait because sometimes the edit button is not clicked
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get(CHANGE_STATUS.buttonEdit).click({ force: true });
        cy.contains('Status wijzigen').should('be.visible');
        cy.get(CHANGE_STATUS.currentStatus).contains('Gemeld').should('be.visible');
        cy.get(CHANGE_STATUS.radioButtonGeannuleerd).click({ force: true }).should('be.checked');
        cy.get(CHANGE_STATUS.inputToelichting).type('Toeterlichting');
        cy.get(CHANGE_STATUS.warningDeelmeldingenOpen).should('have.text', 'Let op! Er zijn deelmeldingen nog niet afgehandeld.').and('be.visible');
        cy.get(CHANGE_STATUS.buttonSubmit).click();
        cy.wait('@patchSignal');
        cy.wait('@getDeelmeldingen');
        cy.wait('@getTerms');
        cy.wait('@getHistory');
        cy.wait('@getSignals');
        cy.get(SIGNAL_DETAILS.status)
          .should('have.text', 'Geannuleerd')
          .and('be.visible')
          .and($labels => {
            expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
          });
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).should('not.exist');
        // wait because status update is not visible yet
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        deelmelding.checkDeelmeldingStatuses('Geannuleerd');
      });
    });
  });
  describe('Filter Deelmeldingen', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      cy.getManageSignalsRoutes();
      cy.stubPreviewMap();
      cy.getTermsRoute();
      cy.getSortedRoutes();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });
    it('Should filter on standaardmelding', () => {
      deelmelding.filterSignalOnType('Standaardmelding ', FILTER.checkboxMelding);
    });
    it('Should filter on hoofdmelding', () => {
      deelmelding.filterSignalOnType('Hoofdmelding', FILTER.checkboxHoofdmelding);
      cy.get(MANAGE_SIGNALS.firstSignalIcon).should('have.attr', 'aria-label', 'Hoofdmelding');
    });
    it('Should filter on deelmelding', () => {
      deelmelding.filterSignalOnType('Deelmelding', FILTER.checkboxDeelmelding);
    });
    it.skip('Should filter on verantwoordelijke afdeling', () => {
      // Make tests when possible
    });
    it.skip('Should filter on ASC', () => {
      // Make tests when possible
    });
  });
  describe('Change status and add multiple times deelmeldingen', () => {
    describe('Set up testdata', () => {
      it('Should create a signal', () => {
        requests.createSignalDeelmelding();
      });
    });
    describe('Change status and add multiple times deelmeldingen', () => {
      beforeEach(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        cy.stubPreviewMap();
        cy.getManageSignalsRoutes();
        cy.getSignalDetailsRoutesById();
        cy.postDeelmeldingenRoute();
        cy.patchSignalRoute();
        cy.getDeelmeldingenRoute();
        cy.visit('/manage/incidents/');
        cy.waitForManageSignalsRoutes();
      });
      it('Should create deelmeldingen', () => {
        createSignal.openCreatedSignal();
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        cy.get(DEELMELDING.buttonAdd).click();

        deelmelding.setDeelmelding('1', '1', 'Stankoverlast', 'Op dit adres stinkt het, vermoedelijk kruiden');
        deelmelding.setDeelmelding('2', '2', 'Overig afval', 'Veel afval op straat voor de deur van Jacob Hooy');

        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.get(DEELMELDING.notification).should('have.text', 'Deelmelding gemaakt').and('be.visible');
        cy.waitForSignalDetailsRoutes();
        cy.wait('@getDeelmeldingen');

        // Add another deelmelding
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        deelmelding.setDeelmelding('1', '3', 'Straatverlichting (VOR)', 'Door de stank is ook alle straatverlichting kapot gegaan');
        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.get(DEELMELDING.notification).should('have.text', 'Deelmelding gemaakt').and('be.visible');
        cy.waitForSignalDetailsRoutes();
        cy.wait('@getDeelmeldingen');
      });
      it('Should change status to \'In Behandeling\' and create deelmelding', () => {
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.get(`[href="/manage/incident/${json.signalId}"]`).first().click();
        });
        // Used a wait because sometimes the edit button is not clicked
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get(CHANGE_STATUS.buttonEdit).click({ force: true });
        cy.contains('Status wijzigen').should('be.visible');
        cy.contains('Huidige status').should('be.visible');
        // Test sometimes failes on next statement, only in github action not on a local machine. For testing purposes it is commented out.
        // cy.get(CHANGE_STATUS.currentStatus).contains('Gemeld').should('be.visible');
        cy.get(CHANGE_STATUS.radioButtonInBehandeling).check({ force: true }).should('be.checked');
        cy.get(CHANGE_STATUS.buttonSubmit).click();
        cy.wait('@getHistory');
        cy.wait('@getSignal');
        // Wait for signals details to be visible, then check status
        cy.get(SIGNAL_DETAILS.historyAction).should('be.visible');
        cy.get(SIGNAL_DETAILS.status).should('have.text', 'In behandeling').and('be.visible');

        // Add another deelmelding
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        deelmelding.setDeelmelding('1', '4', 'Drank- / drugsoverlast', 'Er wordt zowel binnen als buiten het pand veel drugs gebruikt');
        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.wait('@patchSignal');
        cy.get(DEELMELDING.notification).should('have.text', 'Deelmelding gemaakt').and('be.visible');
        cy.wait('@getSignal');
        cy.wait('@getDeelmeldingen');
        cy.get(DEELMELDING.childIncident).should('have.length', 4);
      });
      it('Should change status to \'Ingepland\' and create deelmelding', () => {
        createSignal.openCreatedSignal();
        cy.waitForSignalDetailsRoutes();
        cy.wait('@getDeelmeldingen');
        // Used a wait because sometimes the edit button is not clicked
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get(CHANGE_STATUS.buttonEdit).click({ force: true });
        cy.contains('Status wijzigen').should('be.visible');
        cy.contains('Huidige status').should('be.visible');
        cy.get(CHANGE_STATUS.currentStatus).contains('In behandeling').should('be.visible');
        cy.get(CHANGE_STATUS.radioButtonIngepland).check({ force: true }).should('be.checked');
        cy.get(CHANGE_STATUS.inputToelichting).type('Wij hebben de melding in behadeling genomen');
        cy.get(CHANGE_STATUS.buttonSubmit).click();
        cy.wait('@getHistory');
        cy.wait('@getSignal');
        // Wait for signals details to be visible, then check status
        cy.get(SIGNAL_DETAILS.historyAction).should('be.visible');
        cy.get(SIGNAL_DETAILS.status).should('have.text', 'Ingepland').and('be.visible');

        // Add another deelmelding
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        deelmelding.setDeelmelding('1', '5', 'Ratten', 'Het hele pand zit vol met ratten');
        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.wait('@patchSignal');
        cy.get(DEELMELDING.notification).should('have.text', 'Deelmelding gemaakt').and('be.visible');
        cy.waitForSignalDetailsRoutes();
        cy.wait('@getDeelmeldingen');
        cy.get(DEELMELDING.childIncident).should('have.length', 5);
      });
      it('Should change status to \'Afgehandeld\'', () => {
        createSignal.openCreatedSignal();
        cy.waitForSignalDetailsRoutes();
        cy.wait('@getDeelmeldingen');
        // Used a wait because sometimes the edit button is not clicked
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get(CHANGE_STATUS.buttonEdit).click({ force: true });
        cy.contains('Status wijzigen').should('be.visible');
        cy.contains('Huidige status').should('be.visible');
        cy.get(CHANGE_STATUS.currentStatus).contains('Ingepland').should('be.visible');
        cy.get(CHANGE_STATUS.radioButtonAfgehandeld).check({ force: true }).should('be.checked');
        cy.get(CHANGE_STATUS.inputToelichting).type('Wij hebben de melding in afgehandeld');
        cy.get(CHANGE_STATUS.buttonSubmit).click();
        cy.wait('@patchSignal');
        cy.wait('@getHistory');
        cy.wait('@getSignal');
        cy.wait('@getSignals');
        cy.wait('@getDeelmeldingen');
        // Wait for signals details to be visible, then check status
        cy.get(SIGNAL_DETAILS.historyAction).should('be.visible');
        cy.get(SIGNAL_DETAILS.status).should('have.text', 'Afgehandeld').and('be.visible');
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).should('not.exist');
        // wait because status update is not visible yet
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        deelmelding.checkDeelmeldingStatuses('Geannuleerd');
      });
    });
  });
});
