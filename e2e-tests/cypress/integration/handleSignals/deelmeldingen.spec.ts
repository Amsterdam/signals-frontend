/* eslint-disable max-nested-callbacks */
import { CREATE_SIGNAL, BOTEN } from '../../support/selectorsCreateSignal';
import { CHANGE_STATUS, CHANGE_URGENCY, DEELMELDING, SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { FILTER, MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { NOTIFICATONS } from '../../support/texts';
import { generateToken } from '../../support/jwt';
import signal01 from '../../fixtures/signals/deelmelding01.json';
import signal02 from '../../fixtures/signals/deelmelding02.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';
import * as deelmeldingen from '../../support/commandsDeelmeldingen';
import * as general from '../../support/commandsGeneral';

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
      before(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      });
      it('Create a signal, user is logged in', () => {
        routes.stubMap();
        routes.getManageSignalsRoutes();
        routes.stubPreviewMap();
        routes.postSignalRoutePrivate();
        cy.visit('/manage/incidents/');
        routes.waitForManageSignalsRoutes();
        general.openMenu();
        cy.contains('Melden').click();
        general.checkHeaderText('Beschrijf uw melding');

        createSignal.setDescriptionPage(signal01);
        cy.get(CREATE_SIGNAL.dropdownSubcategory).select('Snel varen (ASC, WAT)');

        cy.contains('Volgende').click();
        cy.get(BOTEN.radioButtonVrachtschip).check({ force: true });
        cy.contains('Volgende').click();
        createSignal.setPhonenumber(signal01);
        cy.contains('Volgende').click();

        createSignal.setEmailAddress(signal01);
        cy.contains('Volgende').click();

        createSignal.checkSummaryPage(signal01);
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
        routes.stubPreviewMap();
        routes.getManageSignalsRoutes();
        routes.getSignalDetailsRoutesById();
        cy.visit('/manage/incidents/');
        routes.waitForManageSignalsRoutes();
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
        routes.postDeelmeldingenRoute();
        routes.patchSignalRoute();
        routes.getDeelmeldingenRoute();
        createSignal.openCreatedSignal();
        cy.wait('@getSignal');
        cy.get(SIGNAL_DETAILS.signalHeaderTitle).contains('Standaardmelding');
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();

        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        cy.get(DEELMELDING.radioButtonVerantwoordelijkeAfdeling).should('be.checked');
        cy.get(DEELMELDING.radioButtonASC).check({ force: true });
        cy.get(DEELMELDING.inputNote).type('Het staat genoteerd!');
        cy.get(DEELMELDING.buttonAdd).click();
        cy.get(DEELMELDING.buttonAdd).click();

        deelmeldingen.setDeelmelding(1, '1', 'Snel varen', 'Er vaart iemand te hard onder de Berlagebrug door.');
        deelmeldingen.setDeelmelding(2, '2', 'Brug', 'De Berlagebrug is stuk.');
        deelmeldingen.setDeelmelding(3, '3', 'Olie op het water', 'In de buurt van de Berlagebrug ligt een plas olie op het water.');

        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.wait('@patchSignal');
        cy.get(DEELMELDING.notification).should('have.text', NOTIFICATONS.deelmelding).and('be.visible');
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

        deelmeldingen.checkDeelmelding(1, 'Snel varen', 'Gemeld', '3 werkdagen');
        deelmeldingen.checkDeelmelding(2, 'Brug', 'Gemeld', '21 dagen');
        deelmeldingen.checkDeelmelding(3, 'Olie op het water', 'Gemeld', '3 dagen');

        cy.get(SIGNAL_DETAILS.signalHeaderTitle).contains('Hoofdmelding');

        // Check signal data deelmelding 01
        cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(0).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(0).click();
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.get(SIGNAL_DETAILS.linkParent).should('have.text', json.signalId).and('be.visible');
        });
        cy.get(SIGNAL_DETAILS.signalHeaderTitle).contains('Deelmelding');
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

        cy.get(SIGNAL_DETAILS.creationDate).should('contain', general.getTodaysDate());
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
        routes.getSortedRoutes();

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
        deelmeldingen.checkSignalNotVisible();
      });
      it('Should change a deelmelding', () => {
        routes.getSignalDetailsRoutes();

        createSignal.openCreatedSignal();
        cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(0).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(1).click();

        routes.waitForSignalDetailsRoutes();
        cy.wait('@getTerms');
        // Used a wait because sometimes the edit button is not clicked
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get(CHANGE_URGENCY.buttonEdit).click();
        cy.get(CHANGE_URGENCY.radioButtonNormaal).should('be.checked');
        cy.get(CHANGE_URGENCY.radioButtonHoog).click({ force: true });
        cy.get(CHANGE_URGENCY.buttonSubmit).click();
        cy.wait('@getSignals');
        cy.get(SIGNAL_DETAILS.linkParent).click();
        cy.get(DEELMELDING.childIncident).first().should('have.css', 'border-left-color', 'rgb(254, 200, 19)');
      });
      it('Should filter on "Hoofdmelding met wijziging in deelmelding"', () => {
        routes.getSortedRoutes();

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
        deelmeldingen.checkSignalNotVisible();
      });
      it('Should click "no action" after deelmelding change', () => {
        routes.patchSignalRoute();
        routes.getDeelmeldingenRoute();
        routes.getSignalDetailsRoutes();
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
        routes.patchSignalRoute();
        routes.getDeelmeldingenRoute();
        createSignal.openCreatedSignal();
        // Used a wait because sometimes the edit button is not clicked
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get(CHANGE_STATUS.buttonEdit).click({ force: true });
        cy.contains('Status wijzigen').should('be.visible');
        cy.get(CHANGE_STATUS.currentStatus).contains('Gemeld').should('be.visible');
        cy.get(CHANGE_STATUS.radioButtonGeannuleerd).click({ force: true }).should('be.checked');
        cy.get(CHANGE_STATUS.inputToelichting).type('Toeterlichting');
        cy.get(CHANGE_STATUS.warningDeelmeldingenOpen).should('contain', 'Let op, er staan nog deelmeldingen open!Als je de hoofdmelding nu afhandelt, worden de openstaande deelmeldingen geannuleerd. ').and('be.visible');
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
        deelmeldingen.checkDeelmeldingStatus('Geannuleerd');
      });
    });
  });
  describe('Change status and add multiple times deelmeldingen', () => {
    describe('Set up testdata', () => {
      before(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      });
      it('Create a signal, user is logged in', () => {
        routes.stubMap();
        routes.getManageSignalsRoutes();
        routes.stubPreviewMap();
        routes.postSignalRoutePrivate();
        cy.visit('/manage/incidents/');
        routes.waitForManageSignalsRoutes();
        general.openMenu();
        cy.contains('Melden').click();
        general.checkHeaderText('Beschrijf uw melding');

        createSignal.setDescriptionPage(signal02);

        cy.contains('Volgende').click();
        createSignal.setPhonenumber(signal02);
        cy.contains('Volgende').click();

        createSignal.setEmailAddress(signal02);
        cy.contains('Volgende').click();

        createSignal.checkSummaryPage(signal02);
        cy.contains('Verstuur').click();
        cy.wait('@postSignalPrivate');
        cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

        createSignal.checkThanksPage();
        createSignal.saveSignalId();
      });
    });
    describe('Change status and add multiple times deelmeldingen', () => {
      beforeEach(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        routes.stubPreviewMap();
        routes.getManageSignalsRoutes();
        routes.getSignalDetailsRoutesById();
        routes.postDeelmeldingenRoute();
        routes.patchSignalRoute();
        routes.getDeelmeldingenRoute();
        cy.visit('/manage/incidents/');
        routes.waitForManageSignalsRoutes();
      });
      it('Should create deelmeldingen', () => {
        createSignal.openCreatedSignal();
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        cy.get(DEELMELDING.radioButtonASC).check({ force: true });
        cy.get(DEELMELDING.buttonAdd).click();

        deelmeldingen.setDeelmelding(1, '1', 'Stankoverlast', 'Op dit adres stinkt het, vermoedelijk kruiden');
        deelmeldingen.setDeelmelding(2, '2', 'Overig afval', 'Veel afval op straat voor de deur van Jacob Hooy');

        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.get(DEELMELDING.notification).should('have.text', NOTIFICATONS.deelmelding).and('be.visible');
        cy.wait('@getSignal');
        cy.wait('@getDeelmeldingen');

        // Add another deelmelding
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        deelmeldingen.setDeelmelding(1, '3', 'Straatverlichting (VOR)', 'Door de stank is ook alle straatverlichting kapot gegaan');
        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.get(DEELMELDING.notification).should('have.text', NOTIFICATONS.deelmelding).and('be.visible');
        cy.wait('@getSignal');
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
        deelmeldingen.setDeelmelding(1, '4', 'Drank- / drugsoverlast', 'Er wordt zowel binnen als buiten het pand veel drugs gebruikt');
        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.wait('@patchSignal');
        cy.get(DEELMELDING.notification).should('have.text', NOTIFICATONS.deelmelding).and('be.visible');
        cy.wait('@getSignal');
        cy.wait('@getDeelmeldingen');
        cy.get(DEELMELDING.childIncident).should('have.length', 4);
      });
      it('Should change status to \'Ingepland\' and create deelmelding', () => {
        createSignal.openCreatedSignal();
        routes.waitForSignalDetailsRoutes();
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
        cy.get(SIGNAL_DETAILS.historyAction).should('be.visible');
        cy.get(SIGNAL_DETAILS.status).should('have.text', 'Ingepland').and('be.visible');

        // Add another deelmelding
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        deelmeldingen.setDeelmelding(1, '5', 'Ratten', 'Het hele pand zit vol met ratten');
        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.wait('@patchSignal');
        cy.get(DEELMELDING.notification).should('have.text', NOTIFICATONS.deelmelding).and('be.visible');
        routes.waitForSignalDetailsRoutes();
        cy.wait('@getDeelmeldingen');
        cy.get(DEELMELDING.childIncident).should('have.length', 5);
      });
      it('Should change status to \'Afgehandeld\'', () => {
        createSignal.openCreatedSignal();
        routes.waitForSignalDetailsRoutes();
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
        cy.get(SIGNAL_DETAILS.historyAction).should('be.visible');
        cy.get(SIGNAL_DETAILS.status).should('have.text', 'Afgehandeld').and('be.visible');
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).should('not.exist');
        // wait because status update is not visible yet
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        deelmeldingen.checkDeelmeldingStatus('Geannuleerd');
      });
    });
  });
  describe('Filter Deelmeldingen', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.getManageSignalsRoutes();
      routes.stubPreviewMap();
      routes.getTermsRoute();
      routes.getSortedRoutes();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
      routes.getSignalDetailsRoutes();
      routes.getFilterByDirectingDepartmentRoute();
    });
    it('Should filter on standaardmelding', () => {
      deelmeldingen.filterSignalOnType('Standaardmelding ', FILTER.checkboxMelding);
    });
    it('Should filter on hoofdmelding', () => {
      deelmeldingen.filterSignalOnType('Hoofdmelding', FILTER.checkboxHoofdmelding);
      cy.get(MANAGE_SIGNALS.firstSignalIcon).should('have.attr', 'aria-label', 'Hoofdmelding');
    });
    it('Should filter on deelmelding', () => {
      deelmeldingen.filterSignalOnType('Deelmelding', FILTER.checkboxDeelmelding);
    });
    it('Should filter on verantwoordelijke afdeling', () => {
      cy.get(MANAGE_SIGNALS.buttonFilteren).click();
      cy.get(FILTER.checkboxVerantwoordelijkeAfdeling).click();
      cy.get(FILTER.buttonSubmitFilter).click();
      cy.wait('@submitDirectingDepartmentFilter');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
      cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'Verantwoordelijke afdeling').and('be.visible');
      cy.get(MANAGE_SIGNALS.firstSignalId).click();
      routes.waitForSignalDetailsRoutes();
      cy.get(SIGNAL_DETAILS.regie).should('have.text', 'Verantwoordelijke afdeling');
      cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
      cy.get('th').contains('Id').click();
      cy.wait('@getSortedASC');
      cy.get(MANAGE_SIGNALS.firstSignalId).click();
      routes.waitForSignalDetailsRoutes();
      cy.get(SIGNAL_DETAILS.regie).should('have.text', 'Verantwoordelijke afdeling');
      cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
    });
    it('Should filter on ASC', () => {
      cy.get(MANAGE_SIGNALS.buttonFilteren).click();
      cy.get(FILTER.checkboxASC).click();
      cy.get(FILTER.buttonSubmitFilter).click();
      cy.wait('@submitDirectingDepartmentFilter');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');
      cy.get(MANAGE_SIGNALS.filterTagList).should('have.text', 'ASC').and('be.visible');
      cy.get(MANAGE_SIGNALS.firstSignalId).click();
      routes.waitForSignalDetailsRoutes();
      cy.get(SIGNAL_DETAILS.regie).should('have.text', 'ASC');
      cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
      cy.get('th').contains('Id').click();
      cy.wait('@getSortedASC');
      cy.get(MANAGE_SIGNALS.firstSignalId).click();
      routes.waitForSignalDetailsRoutes();
      cy.get(SIGNAL_DETAILS.regie).should('have.text', 'ASC');
      cy.get(SIGNAL_DETAILS.linkTerugNaarOverzicht).click();
    });
  });
});
