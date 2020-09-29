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
    });

    it('Should show a summary', () => {
      cy.server();
      cy.route('/maps/topografie?bbox=**').as('map');
      cy.postSignalRoutePublic();

      cy.contains('Volgende').click();
      cy.wait('@map');
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
      cy.getSignalDetailsRoutesById();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });

    it('Should show the signal details', () => {
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      createSignal.checkSignalDetailsPage();
      cy.contains(Cypress.env('description')).should('be.visible');

      // Check signal data
      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Nieuw-West').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', "Plein '40-'45 11A").should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1063KR Amsterdam').should('be.visible');
      cy.get(SIGNAL_DETAILS.email).should('have.text', '').should('be.visible');
      cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').should('be.visible');
      cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', 'Nee').and('be.visible');

      createSignal.checkCreationDate();
      createSignal.checkRedTextStatus('Gemeld');
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').should('be.visible');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Graffiti / wildplak (STW)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Schoon').should('be.visible');
      cy.get(SIGNAL_DETAILS.source).should('have.text', 'online').should('be.visible');
    });
  });
  describe('Change signal data', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', Cypress.env('token'));
      cy.server();
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.getAddressRoute();
      cy.visitFetch('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
      cy.log(Cypress.env('signalId'));
    });

    it('Should change location using pencil button', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
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
      // Used a wait, because we have to wait until zoom to new adres is done.
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get(CHANGE_LOCATION.buttonSubmit).click();
      // Check if background colour of changed element is flashing orange
      createSignal.checkFlashingYellow();

      // Check location data
      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Centrum').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Bethaniënstraat 12').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1012CA Amsterdam').should('be.visible');

      // Check history
      cy.get(SIGNAL_DETAILS.historyListItem).should('have.length', 2);
      cy.get(SIGNAL_DETAILS.historyListItem)
        .first()
        .should('contain', 'Stadsdeel: Centrum')
        .and('contain', 'Bethaniënstraat 12')
        .and('contain', 'Amsterdam')
        .and('be.visible');
    });
    it('Should change location by clicking on picture', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);
      cy.get(SIGNAL_DETAILS.imageLocation).click();
      cy.get(CHANGE_LOCATION.buttonLocationDetailEdit).click();
      cy.get(OVERVIEW_MAP.overViewMap).should('be.visible');
      cy.get(OVERVIEW_MAP.autoSuggest).type('{selectall}{backspace}Noordhollandschkanaaldijk 114', { delay: 60 });
      cy.wait('@getAddress');
      createSignal.selectAddress('Noordhollandschkanaaldijk 114, 1034NW Amsterdam');
      // Used a wait, because we have to wait until zoom to new adres is done.
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get(CHANGE_LOCATION.buttonSubmit).click();

      // Check if background colour of changed element is flashing orange
      createSignal.checkFlashingYellow();

      // Check location data
      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Noord').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Noordhollandschkanaaldijk 114').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1034NW Amsterdam').should('be.visible');

      // Check history
      cy.get(SIGNAL_DETAILS.historyListItem).should('have.length', 3);
      cy.get(SIGNAL_DETAILS.historyListItem)
        .first()
        .should('contain', 'Stadsdeel: Noord')
        .and('contain', 'Noordhollandschkanaaldijk 114')
        .and('contain', 'Amsterdam')
        .and('be.visible');
    });
    it('Should change status', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal status
      cy.get(CHANGE_STATUS.buttonEdit).click();

      // Check on status information
      cy.contains('Status wijzigen').should('be.visible');
      cy.contains('Huidige status').should('be.visible');
      cy.get(CHANGE_STATUS.currentStatus).contains('Gemeld').should('be.visible');

      // Cancel edit status
      cy.get(CHANGE_STATUS.buttonCancel).click();
      cy.contains(Cypress.env('description')).should('be.visible');

      // Edit signal status
      cy.get(CHANGE_STATUS.buttonEdit).click();
      cy.contains('Status wijzigen').should('be.visible');

      // Check all checkboxes and submit change
      const sendMailText = 'Stuur deze toelichting naar de melder. Let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting.';
      cy.get(CHANGE_STATUS.radioButtonGemeld).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('not.be.checked').and('not.be.disabled');
      cy.contains(sendMailText).should('be.visible');
      cy.contains('Toelichting (optioneel)').should('be.visible');
      cy.get(CHANGE_STATUS.radioButtonInAfwachting).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('not.be.checked').and('not.be.disabled');
      cy.contains(sendMailText).should('be.visible');
      cy.contains('Toelichting (optioneel)').should('be.visible');
      cy.get(CHANGE_STATUS.radioButtonIngepland).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('be.checked').and('be.disabled');
      cy.contains(sendMailText).should('be.visible');
      cy.contains('Toelichting (optioneel)').should('not.be.visible');
      cy.get(CHANGE_STATUS.radioButtonExtern).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('not.be.checked').and('not.be.disabled');
      cy.contains(sendMailText).should('be.visible');
      cy.contains('Toelichting (optioneel)').should('be.visible');
      cy.get(CHANGE_STATUS.radioButtonAfgehandeld).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('be.checked').and('be.disabled');
      cy.contains(sendMailText).should('be.visible');
      cy.contains('Toelichting (optioneel)').should('not.be.visible');
      cy.get(CHANGE_STATUS.radioButtonHeropend).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('be.checked').and('be.disabled');
      cy.contains(sendMailText).should('be.visible');
      cy.contains('Toelichting (optioneel)').should('not.be.visible');
      cy.get(CHANGE_STATUS.radioButtonGeannuleerd).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('not.be.checked').and('not.be.disabled');
      cy.contains(sendMailText).should('be.visible');
      cy.contains('Toelichting (optioneel)').should('be.visible');

      cy.get(CHANGE_STATUS.radioButtonInBehandeling).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.inputToelichting).type('Wij hebben uw zinloze melding toch maar in behandeling genomen');
      cy.get(CHANGE_STATUS.buttonSubmit).click();

      // Check if background colour of changed element is flashing orange
      createSignal.checkFlashingYellow();

      // Check if status is 'In behandeling' with red coloured text
      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.status)
        .should('have.text', 'In behandeling')
        .and('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });

      // Check history
      cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 8);
      cy.get(SIGNAL_DETAILS.historyAction)
        .first()
        .should('contain', 'Update status naar: In behandeling')
        .and('contain', 'Wij hebben uw zinloze melding toch maar in behandeling genomen')
        .and('be.visible');
    });

    it('Should change urgency', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal urgency
      cy.get(CHANGE_URGENCY.buttonEdit).click();

      // Check on urgency information
      cy.get(CHANGE_URGENCY.radioButtonNormaal).should('be.checked');
      cy.get(CHANGE_URGENCY.radioButtonLaag).click({ force: true });
      cy.contains('interne melding zonder servicebelofte').should('be.visible');
      cy.get(CHANGE_URGENCY.radioButtonHoog).click({ force: true });
      cy.contains('Hoog: melding met spoed oppakken').should('be.visible');

      // Cancel edit urgency
      cy.get(CHANGE_URGENCY.buttonCancel).click();
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');

      // Edit signal urgency and submit
      cy.get(CHANGE_URGENCY.buttonEdit).click();
      cy.get(CHANGE_URGENCY.radioButtonNormaal).should('be.checked');
      cy.get(CHANGE_URGENCY.radioButtonHoog).click({ force: true });
      cy.get(CHANGE_URGENCY.buttonSubmit).click();

      // Check if background colour of changed element is flashing orange
      createSignal.checkFlashingYellow();

      // Check urgency change
      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.urgency)
        .should('have.text', 'Hoog')
        .and('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });

      // Check history
      cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 9);
      cy.get(SIGNAL_DETAILS.historyAction).contains('Urgentie update naar: Hoog').should('be.visible');
    });

    it('Should change type', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal type
      cy.get(CHANGE_TYPE.buttonEdit).click();

      // Check on type information
      cy.get(CHANGE_TYPE.radioButtonMelding).should('be.checked');
      cy.contains('Melding: Een verzoek tot herstel of handhaving om de normale situatie te herstellen');
      cy.get(CHANGE_TYPE.radioButtonAanvraag).click({ force: true }).should('be.checked');
      cy.contains('Aanvraag: Een verzoek om iets structureels te veranderen');
      cy.get(CHANGE_TYPE.radioButtonVraag).click({ force: true }).should('be.checked');
      cy.contains('Vraag: Een verzoek om informatie');
      cy.get(CHANGE_TYPE.radioButtonKlacht).click({ force: true }).should('be.checked');
      cy.contains('Klacht: Een uiting van ongenoegen over het handelen van de gemeente.');
      cy.get(CHANGE_TYPE.radioButtonGrootOnderhoud).click({ force: true }).should('be.checked');
      cy.contains(
        'Groot onderhoud: Een verzoek dat niet onder dagelijks beheer valt, maar onder een langdurig traject.'
      );

      // Cancel edit type
      cy.get(CHANGE_TYPE.buttonCancel).click();
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');

      // Edit signal type and submit
      cy.get(CHANGE_TYPE.buttonEdit).click();
      cy.get(CHANGE_TYPE.radioButtonGrootOnderhoud).click({ force: true });
      cy.get(CHANGE_TYPE.buttonSubmit).click();

      // Check if background colour of changed element is flashing orange
      createSignal.checkFlashingYellow();

      // Check type change
      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Groot onderhoud').and('be.visible');

      // Check history
      cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 10);
      cy.get(SIGNAL_DETAILS.historyAction).contains('Type update naar: Groot onderhoud').should('be.visible');
    });

    it('Should change category', () => {
      // Open Signal
      cy.get(MANAGE_SIGNALS.linkSignal).contains(Cypress.env('signalId')).click();
      cy.waitForSignalDetailsRoutes();
      cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);

      // Edit signal category
      cy.get(CHANGE_CATEGORY.buttonEdit).click();
      cy.get(CHANGE_CATEGORY.inputCategory).select('Overig openbare ruimte (ASC)');

      // Cancel edit category
      cy.get(CHANGE_CATEGORY.buttonCancel).click();

      // Edit signal category and submit
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Graffiti / wildplak (STW)').and('be.visible');
      cy.get(CHANGE_CATEGORY.buttonEdit).click();
      cy.get(CHANGE_CATEGORY.inputCategory).select('Overig openbare ruimte (ASC)');
      cy.get(CHANGE_CATEGORY.buttonSubmit).click();

      // Check if background colour of changed element is flashing orange
      createSignal.checkFlashingYellow();

      // Check change in subcategory, maincategory and department
      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Overig openbare ruimte (ASC)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Overlast in de openbare ruimte').and('be.visible');

      // Check history
      cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 12);
      cy.get(SIGNAL_DETAILS.historyAction)
        .contains('Categorie gewijzigd naar: Overig openbare ruimte')
        .should('be.visible');
    });
  });
});
