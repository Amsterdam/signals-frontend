// <reference types="Cypress" />
import * as createSignal from '../support/commandsCreateSignal';
import { CREATE_SIGNAL } from '../support/selectorsCreateSignal';
import { CHANGE_CATEGORY, CHANGE_LOCATION, CHANGE_STATUS, CHANGE_TYPE, CHANGE_URGENCY, SIGNAL_DETAILS } from '../support/selectorsSignalDetails';
import { MANAGE_SIGNALS, OVERVIEW_MAP } from '../support/selectorsManageIncidents';
describe('Change signal after submit', () => {
  describe('Create signal graffitie', () => {
    before(() => {
      cy.server();
      cy.defineGeoSearchRoutes();
      cy.getAddressRoute();

      cy.visitFetch('incident/beschrijf');
    });

    it('Should search for an address', () => {
      // Search on address
      createSignal.searchAddress("Plein '40-'45 11A, 1063KR Amsterdam");
      cy.wait('@getAddress');

      // Select found item  
      createSignal.selectAddress("Plein '40-'45 11A, 1063KR Amsterdam");
      cy.wait('@geoSearchLocation');
    });

    it('Should enter a description', () => {
      cy.server();
      cy.route('POST', '**/signals/category/prediction', 'fixture:graffiti.json').as('prediction');

      createSignal.setDescription('Mijn hele huis zit onder de graffiti');
      cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click();
      cy.clickButton('Volgende');
    });

    it('Should enter a phonenumber', () => {
      cy.url().should('include', '/incident/telefoon');
      cy.get(CREATE_SIGNAL.inputPhoneNumber).type('06-12345678');
      cy.clickButton('Volgende');
    });

    it('Should enter an email address', () => {
      cy.url().should('include', '/incident/email');
      cy.get(CREATE_SIGNAL.inputEmail).type('siafakemail@fake.nl');
      cy.clickButton('Volgende');
    });

    it('Should show an overview', () => {
      cy.url().should('include', '/incident/samenvatting');

      // Check if map and marker are visible
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

      // Check Signal information
      cy.contains("Plein '40-'45 11A, 1063KR Amsterdam");
      cy.contains('Mijn hele huis zit onder de graffiti');
      cy.contains('06-12345678').should('be.visible');
      cy.contains('siafakemail@fake.nl').should('be.visible');
    });

    it('Should show the last screen', () => {
      cy.server();
      cy.postSignalRoutePublic();

      cy.clickButton('Verstuur');
   
      cy.wait('@postSignalPublic');

      cy.url().should('include', '/incident/bedankt');
    
      // Capture signal id
      cy.get('.bedankt').first().then($signalLabel => {
        // Get the signal id
        const signalNumber = $signalLabel.text().match(/\d+/)[0];
        cy.log(signalNumber);
        // Set the signal id in variable for later use
        Cypress.env('signalId', signalNumber);
      });
    });
  });
  describe('Check data created signal', () => {
    before(() => {
      localStorage.setItem('accessToken', (Cypress.env('token')));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutes();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });

    it('Should show the signal details', () => {
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);
      cy.contains('Mijn hele huis zit onder de graffiti');
    
      // Check if map and marker are visible
      cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
      cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');

      // Check signal data
      cy.get(SIGNAL_DETAILS.stadsdeel).contains('Stadsdeel: ').and('contain', 'West').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).contains("Plein '40-'45").and('contain', '5').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).contains('1063KR').and('contain', 'Amsterdam').should('be.visible');
      cy.get(SIGNAL_DETAILS.email).contains('siafakemail@fake.nl').should('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).contains('06-12345678').should('be.visible');

      // Check if status is 'gemeld' with red coloured text
      cy.get(SIGNAL_DETAILS.status).contains('Gemeld').should('be.visible').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });

      cy.get(SIGNAL_DETAILS.urgency).contains('Normaal').should('be.visible');
      cy.get(SIGNAL_DETAILS.type).contains('Melding').should('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).contains('Graffiti / wildplak').should('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).contains('Schoon').should('be.visible');
      cy.get(SIGNAL_DETAILS.department).contains('STW').should('be.visible');
      cy.get(SIGNAL_DETAILS.source).contains('online').should('be.visible');
    });
  });
  describe('Change signal data', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', (Cypress.env('token')));
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
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal location
      cy.get(CHANGE_LOCATION.buttonEditLocation).click();

      // Check on map and cancel
      cy.get(OVERVIEW_MAP.overViewMap).should('be.visible');
      cy.get(CHANGE_LOCATION.buttonCancelEditLocation).click();
      cy.contains('Mijn hele huis zit onder de graffiti');

      // Edit signal location
      cy.get(CHANGE_LOCATION.buttonEditLocation).click();
      cy.get(OVERVIEW_MAP.overViewMap).should('be.visible');
      cy.get(OVERVIEW_MAP.autoSuggest).type('{selectall}{backspace}Bethaniënstraat 12', { delay: 60 });;
      cy.wait('@getAddress');
      createSignal.selectAddress("Bethaniënstraat 12, 1012CA Amsterdam");
      cy.wait('@geoSearchLocation');
      cy.get(CHANGE_LOCATION.buttonSubmitEditLocation).click();

      // Check location data
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.stadsdeel).contains('Stadsdeel: ').and('contain', 'Centrum').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).contains("Bethaniënstraat 12").and('contain', '12').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).contains('1012CA').and('contain', 'Amsterdam').should('be.visible');
      
      // Check history
      cy.get(SIGNAL_DETAILS.historyListItem).first().should('contain','Stadsdeel: Centrum')
        .and('contain','Bethaniënstraat 12').and('contain', 'Amsterdam').and('be.visible');
    });

    it('Should change status', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal status
      cy.get(CHANGE_STATUS.buttonEditStatus).click();

      // Check on status information
      cy.contains('Status wijzigen').should('be.visible');
      cy.contains('Huidige status').should('be.visible');
      cy.get(CHANGE_STATUS.currentStatus).contains('Gemeld').should('be.visible');
      cy.contains('Nieuwe status').should('be.visible');
     
      // Cancel edit status
      cy.get(CHANGE_STATUS.buttonCancelEditStatus).click();
      cy.contains('Mijn hele huis zit onder de graffiti');
      
      // Edit signal status
      cy.get(CHANGE_STATUS.buttonEditStatus).click();
      cy.contains('Status wijzigen').should('be.visible');

      // Close edit status with X
      cy.get(CHANGE_STATUS.buttonCloseEditStatus).click();
      cy.contains('Mijn hele huis zit onder de graffiti');

      // Edit signal status
      cy.get(CHANGE_STATUS.buttonEditStatus).click();

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
      cy.get(CHANGE_STATUS.buttonSubmitStatus).click();
      
      // Check if status is 'In behandeling' with red coloured text
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.status).contains('In behandeling').should('be.visible').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });

      // Check history
      cy.get(SIGNAL_DETAILS.historyAction).first().should('contain','Update status naar: In behandeling')
        .and('contain','Wij hebben uw zinloze melding toch maar in behandeling genomen').and('be.visible');
    });

    it('Should change urgency', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);
      
      // Edit signal urgency 
      cy.get('dt').contains('Urgentie').find(SIGNAL_DETAILS.buttonEdit).click();

      // Check on urgency information
      cy.get(CHANGE_URGENCY.radioButtonNormaal).should('be.checked');
      cy.get(CHANGE_URGENCY.radioButtonLaag).click();
      cy.contains('interne melding zonder servicebelofte').should('be.visible');
      cy.get(CHANGE_URGENCY.radioButtonHoog).click();
      cy.contains('Hoog: melding met spoed oppakken').should('be.visible');

      // Cancel edit urgency
      cy.get(SIGNAL_DETAILS.buttonCancel).click();
      cy.get(SIGNAL_DETAILS.urgency).contains('Normaal').should('be.visible');

      // Edit signal urgency and submit
      cy.get('dt').contains('Urgentie').find(SIGNAL_DETAILS.buttonEdit).click();
      cy.get(CHANGE_URGENCY.radioButtonNormaal).should('be.checked');
      cy.get(CHANGE_URGENCY.radioButtonHoog).click();
      cy.get(SIGNAL_DETAILS.buttonSubmit).click();

      // Check urgency change
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.urgency).contains('Hoog').should('be.visible').and($labels => {
        expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
      });

      // Check history
      cy.get(SIGNAL_DETAILS.historyAction).contains('Prioriteit update naar: Hoog').should('be.visible');
    });

    it('Should change type', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);
      
      // Edit signal type
      cy.get('dt').contains('Type').find(SIGNAL_DETAILS.buttonEdit).click();

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
      cy.contains('Groot onderhoud: Een verzoek dat niet onder dagelijks beheer valt, maar onder een langdurig traject.');

      // Cancel edit urgency
      cy.get(SIGNAL_DETAILS.buttonCancel).click();
      cy.get(SIGNAL_DETAILS.type).contains('Melding').should('be.visible');

      // Edit signal type and submit
      cy.get('dt').contains('Type').find(SIGNAL_DETAILS.buttonEdit).click();
      cy.get(CHANGE_TYPE.radioButtonGrootOnderhoud).click();
      cy.get(SIGNAL_DETAILS.buttonSubmit).click();

      // Check type change
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.type).contains('Groot onderhoud').should('be.visible');

      // Check history
      cy.get(SIGNAL_DETAILS.historyAction).contains('Type update naar: Groot onderhoud').should('be.visible');
    });

    it('Should change Category', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal category
      cy.get('dt').contains('Subcategorie').find(SIGNAL_DETAILS.buttonEdit).click();
      cy.get(CHANGE_CATEGORY.inputCategory).select('Overig openbare ruimte');

      // Cancel edit category
      cy.get(SIGNAL_DETAILS.buttonCancel).click();

      // Edit signal category and submit
      cy.get(SIGNAL_DETAILS.subCategory).contains('Graffiti / wildplak').should('be.visible');
      cy.get('dt').contains('Subcategorie').find(SIGNAL_DETAILS.buttonEdit).click();
      cy.get(CHANGE_CATEGORY.inputCategory).select('Overig openbare ruimte');
      cy.get(SIGNAL_DETAILS.buttonSubmit).click();

      // Check change in subcategory, maincategory and department
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.subCategory).contains('Overig openbare ruimte').should('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).contains('Overlast in de openbare ruimte').should('be.visible');
      cy.get(SIGNAL_DETAILS.department).contains('ASC').should('be.visible');
      
      // Check history
      cy.get(SIGNAL_DETAILS.historyAction).contains('Categorie gewijzigd naar: Overig openbare ruimte').should('be.visible');
    });
  });
});