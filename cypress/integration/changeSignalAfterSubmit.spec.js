// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import {
  CHANGE_CATEGORY,
  CHANGE_LOCATION,
  CHANGE_STATUS,
  CHANGE_TYPE,
  CHANGE_URGENCY,
  SIGNAL_DETAILS,
} from '../support/selectorsSignalDetails';
import { MANAGE_SIGNALS, OVERVIEW_MAP } from '../support/selectorsManageIncidents';

describe('Change signal after submit', () => {
  describe('Create signal graffitie', () => {
    before(() => {
      cy.visitFetch('incident/beschrijf');
    });

    it('Should describe the signal', () => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();
      cy.route('POST', '**/signals/category/prediction', 'fixture:graffiti.json').as('prediction');

      createSignal.checkDescriptionPage();
      createSignal.setAddress('1063KR 11A', "Plein '40-'45 11A, 1063KR Amsterdam");
      createSignal.setDescription('Mijn hele huis zit onder de graffiti');
      createSignal.setDateTime('Nu');

      cy.contains('Volgende').click();
    });

    it('Should enter a phonenumber and email address', () => {
      cy.contains('Volgende').click();
      cy.contains('Volgende').click();
    });

    it('Should show a summary', () => {
      cy.server();
      cy.postSignalRoutePublic();

      createSignal.checkSummaryPage();

      // Check information provided by user
      cy.contains(Cypress.env('address')).should('be.visible');
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
    });

    it('Should show the last screen', () => {
      createSignal.checkThanksPage();
      // Capture signal id to check details later
      createSignal.getSignalId();
    });
  });
  describe('Check data created signal', () => {
    before(() => {
      localStorage.setItem('accessToken', Cypress.env('token'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutes();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });

    it('Should show the signal details', () => {
      cy.get(MANAGE_SIGNALS.linkSignal)
        .contains(Cypress.env('signalId'))
        .click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      // Check signal data
      cy.get(SIGNAL_DETAILS.stadsdeel)
        .should('have.text', 'Stadsdeel: Nieuw-West')
        .should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet)
        .should('have.text', "Plein '40-'45 11A")
        .should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity)
        .should('have.text', '1063KR Amsterdam')
        .should('be.visible');
      cy.get(SIGNAL_DETAILS.email)
        .should('have.text', '')
        .should('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber)
        .should('have.text', '')
        .should('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails)
        .should('have.text', 'Nee')
        .and('be.visible');

      // Check if status is 'gemeld' with red coloured text
      cy.get(SIGNAL_DETAILS.status)
        .should('have.text', 'Gemeld')
        .and('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });

      createSignal.checkCreationDate();
      cy.get(SIGNAL_DETAILS.urgency)
        .should('have.text', 'Normaal')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.type)
        .should('have.text', 'Melding')
        .should('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory)
        .should('have.text', 'Graffiti / wildplak (STW)')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory)
        .should('have.text', 'Schoon')
        .should('be.visible');
      cy.get(SIGNAL_DETAILS.source)
        .should('have.text', 'online')
        .should('be.visible');
    });
  });
  describe('Change signal data', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', Cypress.env('token'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutes();
      cy.getAddressRoute();
      cy.defineGeoSearchRoutes();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });

    it('Should change location', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal)
        .contains(Cypress.env('signalId'))
        .click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal location
      cy.get(CHANGE_LOCATION.buttonEdit).click();

      // Check on map and cancel
      cy.get(OVERVIEW_MAP.overViewMap).should('be.visible');
      cy.get(CHANGE_LOCATION.buttonCancel).click();
      cy.contains('Mijn hele huis zit onder de graffiti');

      // Edit signal location
      cy.get(CHANGE_LOCATION.buttonEdit).click();
      cy.get(OVERVIEW_MAP.overViewMap).should('be.visible');
      cy.get(OVERVIEW_MAP.autoSuggest).type('{selectall}{backspace}Bethaniënstraat 12', { delay: 60 });
      cy.wait('@getAddress');
      createSignal.selectAddress('Bethaniënstraat 12, 1012CA Amsterdam');
      cy.wait('@geoSearchLocation');
      cy.get(CHANGE_LOCATION.buttonSubmit).click();

      // Check location data
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.stadsdeel)
        .should('have.text', 'Stadsdeel: Centrum')
        .should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet)
        .should('have.text', 'Bethaniënstraat 12')
        .should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity)
        .should('have.text', '1012CA Amsterdam')
        .should('be.visible');

      // Check history
      cy.get(SIGNAL_DETAILS.historyListItem)
        .first()
        .should('contain', 'Stadsdeel: Centrum')
        .and('contain', 'Bethaniënstraat 12')
        .and('contain', 'Amsterdam')
        .and('be.visible');
    });

    it('Should change status', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal)
        .contains(Cypress.env('signalId'))
        .click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal status
      cy.get(CHANGE_STATUS.buttonEdit).click();

      // Check on status information
      cy.contains('Status wijzigen').should('be.visible');
      cy.contains('Huidige status').should('be.visible');
      cy.get(CHANGE_STATUS.currentStatus)
        .contains('Gemeld')
        .should('be.visible');
      cy.contains('Nieuwe status').should('be.visible');

      // Cancel edit status
      cy.get(CHANGE_STATUS.buttonCancel).click();
      cy.contains(Cypress.env('description')).should('be.visible');

      // Edit signal status
      cy.get(CHANGE_STATUS.buttonEdit).click();
      cy.contains('Status wijzigen').should('be.visible');

      // Close edit status with X
      cy.get(CHANGE_STATUS.buttonClose).click();
      cy.contains(Cypress.env('description')).should('be.visible');

      // Edit signal status
      cy.get(CHANGE_STATUS.buttonEdit).click();

      // Check all checkboxes and submit change
      cy.get(CHANGE_STATUS.radioButtonGemeld).click();
      cy.get(CHANGE_STATUS.radioButtonInAfwachting).click();
      cy.get(CHANGE_STATUS.radioButtonIngepland).click();
      cy.get(CHANGE_STATUS.radioButtonExtern).click();
      cy.get(CHANGE_STATUS.radioButtonAfgehandeld).click();
      cy.get(CHANGE_STATUS.radioButtonHeropend).click();
      cy.get(CHANGE_STATUS.radioButtonGeannuleerd).click();

      cy.get(CHANGE_STATUS.radioButtonInBehandeling).click();
      cy.get(CHANGE_STATUS.inputToelichting).type('Wij hebben uw zinloze melding toch maar in behandeling genomen');
      cy.get(CHANGE_STATUS.buttonSubmit).click();

      // Check if status is 'In behandeling' with red coloured text
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.status)
        .should('have.text', 'In behandeling')
        .and('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });

      // Check history
      cy.get(SIGNAL_DETAILS.historyAction)
        .first()
        .should('contain', 'Update status naar: In behandeling')
        .and('contain', 'Wij hebben uw zinloze melding toch maar in behandeling genomen')
        .and('be.visible');
    });

    it('Should change urgency', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal)
        .contains(Cypress.env('signalId'))
        .click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal urgency
      cy.get(CHANGE_URGENCY.buttonEdit).click();

      // Check on urgency information
      cy.get(CHANGE_URGENCY.radioButtonNormaal).should('be.checked');
      cy.get(CHANGE_URGENCY.radioButtonLaag).click();
      cy.contains('interne melding zonder servicebelofte').should('be.visible');
      cy.get(CHANGE_URGENCY.radioButtonHoog).click();
      cy.contains('Hoog: melding met spoed oppakken').should('be.visible');

      // Cancel edit urgency
      cy.get(CHANGE_URGENCY.buttonCancel).click();
      cy.get(SIGNAL_DETAILS.urgency)
        .should('have.text', 'Normaal')
        .and('be.visible');

      // Edit signal urgency and submit
      cy.get(CHANGE_URGENCY.buttonEdit).click();
      cy.get(CHANGE_URGENCY.radioButtonNormaal).should('be.checked');
      cy.get(CHANGE_URGENCY.radioButtonHoog).click();
      cy.get(CHANGE_URGENCY.buttonSubmit).click();

      // Check urgency change
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.urgency)
        .should('have.text', 'Hoog')
        .and('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });

      // Check history
      cy.get(SIGNAL_DETAILS.historyAction)
        .contains('Prioriteit update naar: Hoog')
        .should('be.visible');
    });

    it('Should change type', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal)
        .contains(Cypress.env('signalId'))
        .click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal type
      cy.get(CHANGE_TYPE.buttonEdit).click();

      // Check on type information
      cy.get(CHANGE_TYPE.radioButtonMelding).should('be.checked');
      cy.contains('Melding: Een verzoek tot herstel of handhaving om de normale situatie te herstellen');
      cy.get(CHANGE_TYPE.radioButtonAanvraag).click();
      cy.contains('Aanvraag: Een verzoek om iets structureels te veranderen');
      cy.get(CHANGE_TYPE.radioButtonVraag).click();
      cy.contains('Vraag: Een verzoek om informatie');
      cy.get(CHANGE_TYPE.radioButtonKlacht).click();
      cy.contains('Klacht: Een uiting van ongenoegen over het handelen van de gemeente Amsterdam.');
      cy.get(CHANGE_TYPE.radioButtonGrootOnderhoud).click();
      cy.contains(
        'Groot onderhoud: Een verzoek dat niet onder dagelijks beheer valt, maar onder een langdurig traject.'
      );

      // Cancel edit type
      cy.get(CHANGE_TYPE.buttonCancel).click();
      cy.get(SIGNAL_DETAILS.type)
        .should('have.text', 'Melding')
        .and('be.visible');

      // Edit signal type and submit
      cy.get(CHANGE_TYPE.buttonEdit).click();
      cy.get(CHANGE_TYPE.radioButtonGrootOnderhoud).click();
      cy.get(CHANGE_TYPE.buttonSubmit).click();

      // Check type change
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.type)
        .should('have.text', 'Groot onderhoud')
        .and('be.visible');

      // Check history
      cy.get(SIGNAL_DETAILS.historyAction)
        .contains('Type update naar: Groot onderhoud')
        .should('be.visible');
    });

    it('Should change category', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal)
        .contains(Cypress.env('signalId'))
        .click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal category
      cy.get(CHANGE_CATEGORY.buttonEdit).click();
      cy.get(CHANGE_CATEGORY.inputCategory).select('Overig openbare ruimte (ASC)');

      // Cancel edit category
      cy.get(CHANGE_CATEGORY.buttonCancel).click();

      // Edit signal category and submit
      cy.get(SIGNAL_DETAILS.subCategory)
        .should('have.text', 'Graffiti / wildplak (STW)')
        .and('be.visible');
      cy.get(CHANGE_CATEGORY.buttonEdit).click();
      cy.get(CHANGE_CATEGORY.inputCategory).select('Overig openbare ruimte (ASC)');
      cy.get(CHANGE_CATEGORY.buttonSubmit).click();

      // Check change in subcategory, maincategory and department
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.subCategory)
        .should('have.text', 'Overig openbare ruimte (ASC)')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory)
        .should('have.text', 'Overlast in de openbare ruimte')
        .and('be.visible');

      // Check history
      cy.get(SIGNAL_DETAILS.historyAction)
        .contains('Categorie gewijzigd naar: Overig openbare ruimte')
        .should('be.visible');
    });
  });
});
