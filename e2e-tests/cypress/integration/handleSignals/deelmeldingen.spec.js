/* eslint-disable max-nested-callbacks */
// <reference types="Cypress" />
import * as requests from '../../support/commandsRequests';
import * as deelmelding from '../../support/commandsDeelmeldingen';
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL } from '../../support/selectorsCreateSignal';
import { CHANGE_STATUS, DEELMELDING, SIGNAL_DETAILS } from '../../support/selectorsSignalDetails';
import { FILTER, MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { generateToken } from '../../support/jwt';

describe.skip('Deelmeldingen', () => {
  describe('Create Deelmeldingen', () => {
    describe('Set up data in Django admin', () => {
      before(() => {
        cy.visitFetch('http://localhost:8000/signals/admin');
      });
      it.skip('Should set can manage', () => {
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
    describe('Set up data', () => {
      beforeEach(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      });
      it('Initiate create signal from manage', () => {
        cy.server();
        cy.getManageSignalsRoutes();

        cy.visitFetch('/manage/incidents/');

        cy.waitForManageSignalsRoutes();
        cy.openMenu();
        cy.contains('Melden').click();
        cy.checkHeaderText('Beschrijf uw melding');
      });
      it('Should describe the signal', () => {
        cy.server();
        cy.route2('**/locatieserver/v3/suggest?fq=*').as('getAddress');
        cy.route('POST', '**/signals/category/prediction', 'fixture:predictions/waterSnelVaren.json').as('prediction');

        createSignal.checkDescriptionPage();
        cy.get(CREATE_SIGNAL.dropdownSource).select('Interne melding');

        createSignal.setAddress('1097DS 159-1', 'Weesperzijde 159-1, 1097DS Amsterdam');
        createSignal.setDescription('Wow, er vaart iemand te hard onder de Berlagebrug door, die BTW stuk is en er ligt ook nog eens een grote plas olie op het waterrr.');
        createSignal.setDateTime('Nu');

        createSignal.uploadFile('images/logo.png', 'image/png', CREATE_SIGNAL.buttonUploadFile);
        createSignal.uploadFile('images/logo2.png', 'image/png', CREATE_SIGNAL.buttonUploadFile);
        cy.contains('Volgende').click();
      });
      it('Should enter specific information', () => {
        cy.contains('Volgende').click();
      });
      it('Should enter a phonenumber and email address', () => {
        cy.contains('Volgende').click();
      });

      it('Should show a summary', () => {
        cy.route2('**/maps/topografie?bbox=**').as('map');
        cy.route2('POST', '/signals/v1/private/signals/').as('postSignalPrivate');

        cy.get(CREATE_SIGNAL.imageFileUpload).should('be.visible');

        cy.contains('Verstuur').click();
        cy.wait('@postSignalPrivate');
      });

      it('Should show the last screen', () => {
        createSignal.getSignalId();
        cy.get('[href*="/manage/incident/"]').click({ force: true });
      });
    });
    describe('Create Deelmeldingen', () => {
      beforeEach(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        cy.server();
        cy.getManageSignalsRoutes();
        cy.getSignalDetailsRoutesById();
        cy.visitFetch('/manage/incidents/');
        cy.waitForManageSignalsRoutes();
      });
      it('Should cancel creating deelmeldingen', () => {
        createSignal.openCreatedSignal();
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();

        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        cy.get(DEELMELDING.buttonCancel).click();
        cy.wait('@getSignal');
        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}`);
        });
      });
      it('Should create 3 deelmeldingen from signal', () => {
        cy.route('POST', '/signals/v1/private/signals/').as('postDeelmeldingen');
        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
          cy.route('PATCH', `/signals/v1/private/signals/${json.signalId}`).as('patchSignal');
          cy.route(`/signals/v1/private/signals/${json.signalId}/children/`).as('getDeelmeldingen');
        });
        createSignal.openCreatedSignal();
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        cy.get(DEELMELDING.radioButtonVerantwoordelijkeAfdeling).should('be.checked');
        cy.get(DEELMELDING.radioButtonASC).check({ force: true });
        cy.get(DEELMELDING.buttonAdd).click();
        cy.get(DEELMELDING.buttonAdd).click();

        deelmelding.setDeelmelding('1', '1', 'Snel varen (ASC, WAT)', 'Er vaart iemand te hard onder de Berlagebrug door.');
        deelmelding.setDeelmelding('2', '2', 'Brug (STW, WAT)', 'De Berlagebrug is stuk.');
        deelmelding.setDeelmelding('3', '3', 'Olie op het water (AEG, ASC, WAT)', 'In de buurt van de Berlagebrug ligt een plas olie op het water.');

        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.wait('@patchSignal');
        cy.get(DEELMELDING.notification).should('have.text', 'De melding is succesvol gedeeld').and('be.visible');
        cy.waitForSignalDetailsRoutes();
        cy.wait('@getDeelmeldingen');

        createSignal.checkSignalDetailsPage();
        createSignal.checkRedTextStatus('Gemeld');
        cy.get(SIGNAL_DETAILS.titleDeelmelding).should('have.text', 'Deelmelding').and('be.visible');
        cy.get(SIGNAL_DETAILS.deelmeldingen).find('li').should('have.length', 3).and('have.css', 'background-color', 'rgb(230, 230, 230)');

        cy.get(SIGNAL_DETAILS.historyAction).eq(0).contains('Regie voerende afdeling/afdelingen gewijzigd naar: ASC').should('be.visible');
        cy.get(SIGNAL_DETAILS.historyAction).eq(1).contains('Deelmelding toegevoegd').should('be.visible');
        cy.get(SIGNAL_DETAILS.historyAction).eq(2).contains('Deelmelding toegevoegd').should('be.visible');
        cy.get(SIGNAL_DETAILS.historyAction).eq(3).contains('Deelmelding toegevoegd').should('be.visible');

        deelmelding.checkDeelmelding('1', 'Snel varen (ASC, WAT)');
        deelmelding.checkDeelmelding('2', 'Brug (STW, WAT)');
        deelmelding.checkDeelmelding('3', 'Olie op het water (ASC, AEG, WAT)');

        // Check signal data deelmelding 01
        cy.get(SIGNAL_DETAILS.deelmeldingBlock).eq(0).find(SIGNAL_DETAILS.deelmeldingBlockValue).eq(0).click();
        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
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
      it('Should change status hoofdmelding to geannuleerd', () => {
        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
          cy.route('PATCH', `/signals/v1/private/signals/${json.signalId}`).as('patchSignal');
          cy.route(`/signals/v1/private/signals/${json.signalId}/children/`).as('getDeelmeldingen');
        });
        createSignal.openCreatedSignal();
        cy.get(CHANGE_STATUS.buttonEdit).click();
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
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).should('not.be.visible');
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
      cy.server();
      cy.getManageSignalsRoutes();
      cy.route('/maps/topografie?bbox=*').as('getMap');
      cy.route('/signals/v1/private/terms/categories/**').as('getTerms');
      cy.route('**&page=1&ordering=id&page_size=50').as('getSortedASC');
      cy.route('**&page=1&ordering=-id&page_size=50').as('getSortedDESC');
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });
    it('Should filter on melding', () => {
      deelmelding.filterSignalOnType('Melding', FILTER.checkboxMelding);
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
  describe.skip('Change status and add multiple times deelmeldingen', () => {
    // Not yet possible to split into more than 3 deelmeldingen, because we use the testsettings
    describe('Set up testdata', () => {
      it('Should create a signal', () => {
        requests.createSignalDeelmelding();
      });
    });
    describe('Change status and add multiple times deelmeldingen', () => {
      beforeEach(() => {
        localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
        cy.server();
        cy.getManageSignalsRoutes();
        cy.getSignalDetailsRoutesById();
        cy.route('POST', '/signals/v1/private/signals/').as('postDeelmeldingen');
        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
          cy.route('PATCH', `/signals/v1/private/signals/${json.signalId}`).as('patchSignal');
          cy.route(`/signals/v1/private/signals/${json.signalId}/children/`).as('getDeelmeldingen');
        });
        cy.visitFetch('/manage/incidents/');
        cy.waitForManageSignalsRoutes();
      });
      it('Should create deelmeldingen', () => {
        createSignal.openCreatedSignal();
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        cy.get(DEELMELDING.buttonAdd).click();

        deelmelding.setDeelmelding('1', '1', 'Stankoverlast (ASC, VTH)', 'Op dit adres stinkt het, vermoedelijk kruiden');
        deelmelding.setDeelmelding('2', '2', 'Overig afval (AEG, STW)', 'Veel afval op straat voor de deur van Jacob Hooy');

        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.wait('@patchSignal');
        cy.get(DEELMELDING.notification).should('have.text', 'De melding is succesvol gedeeld').and('be.visible');
        cy.waitForSignalDetailsRoutes();
        cy.wait('@getDeelmeldingen');

        // Add another deelmelding
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        deelmelding.setDeelmelding('1', '3', 'Straatverlichting (VOR)', 'Door de stank is ook alle straatverlichting kapot gegaan');
        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.wait('@patchSignal');
        cy.get(DEELMELDING.notification).should('have.text', 'De melding is succesvol gedeeld').and('be.visible');
        cy.waitForSignalDetailsRoutes();
        cy.wait('@getDeelmeldingen');
      });
      it('Should change status to \'In Behandeling\' and create deelmelding', () => {
        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
          cy.get(`[href="/manage/incident/${json.signalId}"]`).first().click();
        });
        cy.get(CHANGE_STATUS.buttonEdit).click();
        cy.contains('Status wijzigen').should('be.visible');
        cy.contains('Huidige status').should('be.visible');
        cy.get(CHANGE_STATUS.currentStatus).contains('Gemeld').should('be.visible');
        cy.get(CHANGE_STATUS.radioButtonInBehandeling).check({ force: true }).should('be.checked');
        cy.get(CHANGE_STATUS.buttonSubmit).click();
        cy.wait('@getHistory');
        cy.wait('@getSignal');
        cy.get(SIGNAL_DETAILS.status).should('have.text', 'In behandeling').and('be.visible');

        // Add another deelmelding
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        deelmelding.setDeelmelding('1', '4', 'Drank- / drugsoverlast (ASC, THO)', 'Er wordt zowel binnen als buiten het pand veel drugs gebruikt');
        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.wait('@patchSignal');
        cy.get(DEELMELDING.notification).should('have.text', 'De melding is succesvol gedeeld').and('be.visible');
        cy.waitForSignalDetailsRoutes();
        cy.wait('@getDeelmeldingen');
        cy.get(DEELMELDING.childIncident).should('have.length', 4);
      });
      it('Should change status to \'Ingepland\' and create deelmelding', () => {
        createSignal.openCreatedSignal();
        cy.get(CHANGE_STATUS.buttonEdit).click();
        cy.contains('Status wijzigen').should('be.visible');
        cy.contains('Huidige status').should('be.visible');
        cy.get(CHANGE_STATUS.currentStatus).contains('In behandeling').should('be.visible');
        cy.get(CHANGE_STATUS.radioButtonIngepland).check({ force: true }).should('be.checked');
        cy.get(CHANGE_STATUS.inputToelichting).type('Wij hebben de melding in behadeling genomen');
        cy.get(CHANGE_STATUS.buttonSubmit).click();
        cy.wait('@getHistory');
        cy.wait('@getSignal');
        cy.get(SIGNAL_DETAILS.status).should('have.text', 'Ingepland').and('be.visible');

        // Add another deelmelding
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).click();
        cy.readFile('./cypress/fixtures/tempSignalData.json').then(json => {
          cy.url().should('include', `/manage/incident/${json.signalId}/split`);
        });
        deelmelding.setDeelmelding('1', '5', 'Ratten (GGD)', 'Het hele pand zit vol met ratten');
        cy.get(DEELMELDING.buttonSubmit).click();
        cy.wait('@postDeelmeldingen');
        cy.wait('@patchSignal');
        cy.get(DEELMELDING.notification).should('have.text', 'De melding is succesvol gedeeld').and('be.visible');
        cy.waitForSignalDetailsRoutes();
        cy.wait('@getDeelmeldingen');
        cy.get(DEELMELDING.childIncident).should('have.length', 5);
      });
      it('Should change status to \'Afgehandeld\'', () => {
        createSignal.openCreatedSignal();
        cy.get(CHANGE_STATUS.buttonEdit).click();
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
        cy.wait('@getHistory');
        cy.wait('@getDeelmeldingen');
        // wait because status update is not visible yet
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        cy.get(SIGNAL_DETAILS.status).should('have.text', 'Afgehandeld').and('be.visible');
        cy.get(SIGNAL_DETAILS.buttonCreateDeelmelding).should('not.be.visible');
        deelmelding.checkDeelmeldingStatuses('Geannuleerd');
      });
    });
  });
});
