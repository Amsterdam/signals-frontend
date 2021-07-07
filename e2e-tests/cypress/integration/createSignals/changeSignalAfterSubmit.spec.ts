// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import {
  CHANGE_CATEGORY,
  CHANGE_LOCATION,
  CHANGE_STATUS,
  CHANGE_TYPE,
  CHANGE_URGENCY,
  SIGNAL_DETAILS,
} from '../../support/selectorsSignalDetails';
import { MANAGE_SIGNALS, OVERVIEW_MAP } from '../../support/selectorsManageIncidents';
import { MESSAGES, TYPE_TEXT, URGENCY_TEXT } from '../../support/texts';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/graffiti.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Change signal after submit', () => {
  describe('Create signal in category "Graffiti"', () => {
    before(() => {
      routes.postSignalRoutePublic();
      routes.stubPreviewMap();
      routes.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(signal);
      cy.contains('Volgende').click();

      createSignal.setPhonenumber(signal);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(signal);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(signal);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

      createSignal.checkThanksPage();
      createSignal.saveSignalId();
    });
  });
  describe('Check data created signal', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.stubPreviewMap();
      routes.getManageSignalsRoutes();
      routes.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(signal, 'standaardmelding');
    });
  });
  describe('Change signal data', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.stubPreviewMap();
      routes.getManageSignalsRoutes();
      routes.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });

    it('Should change location using pencil button', () => {
      routes.stubAddress('changeAddressPencil');
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();

      cy.get(CHANGE_LOCATION.buttonEdit).click();

      cy.get(CHANGE_LOCATION.map).should('be.visible');
      cy.get(CHANGE_LOCATION.buttonCancel).click();
      cy.contains(signal.text).should('be.visible');


      cy.get(CHANGE_LOCATION.buttonEdit).click();
      cy.get(CHANGE_LOCATION.map).should('be.visible');
      cy.get(OVERVIEW_MAP.autoSuggest).type('{selectall}{backspace}Bethaniënstraat 12', { delay: 60 });
      createSignal.selectAddress('Bethaniënstraat 12, 1012CA Amsterdam');
      // Used a wait, because we have to wait until zoom to new adres is done.
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get(CHANGE_LOCATION.buttonSubmit).click();

      createSignal.checkFlashingYellow();

      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Centrum').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Bethaniënstraat 12').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1012CA Amsterdam').should('be.visible');


      cy.get(SIGNAL_DETAILS.historyListItem).should('have.length', 4);
      cy.get(SIGNAL_DETAILS.historyListItem)
        .first()
        .should('contain', 'Stadsdeel: Centrum')
        .and('contain', 'Bethaniënstraat 12')
        .and('contain', 'Amsterdam')
        .and('be.visible');
    });
    it('Should change location by clicking on picture', () => {
      routes.stubAddress('changeAddressPicture');
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();
      cy.get(SIGNAL_DETAILS.imageLocation).click();
      cy.get(CHANGE_LOCATION.buttonLocationDetailEdit).click();
      cy.get(CHANGE_LOCATION.map).should('be.visible');
      cy.get(OVERVIEW_MAP.autoSuggest).type('{selectall}{backspace}Noordhollandschkanaaldijk 114', { delay: 60 });

      createSignal.selectAddress('Noordhollandschkanaaldijk 114, 1034NW Amsterdam');
      // Used a wait, because we have to wait until zoom to new adres is done.
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get(CHANGE_LOCATION.buttonSubmit).click();

      createSignal.checkFlashingYellow();

      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', 'Stadsdeel: Noord').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', 'Noordhollandschkanaaldijk 114').should('be.visible');
      cy.get(SIGNAL_DETAILS.addressCity).should('have.text', '1034NW Amsterdam').should('be.visible');

      cy.get(SIGNAL_DETAILS.historyListItem).should('have.length', 5);
      cy.get(SIGNAL_DETAILS.historyListItem)
        .first()
        .should('contain', 'Stadsdeel: Noord')
        .and('contain', 'Noordhollandschkanaaldijk 114')
        .and('contain', 'Amsterdam')
        .and('be.visible');
    });
    it('Should change status', () => {
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();
      // Used a wait because sometimes the edit button is not clicked
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      cy.get(CHANGE_STATUS.buttonEdit).click();

      cy.contains('Status wijzigen').should('be.visible');
      cy.contains('Huidige status').should('be.visible');
      cy.get(CHANGE_STATUS.currentStatus).contains('Gemeld').should('be.visible');

      cy.get(CHANGE_STATUS.buttonCancel).click();
      cy.contains(Cypress.env('description')).should('be.visible');

      cy.get(CHANGE_STATUS.buttonEdit).click();
      cy.contains('Status wijzigen').should('be.visible');

      cy.get(CHANGE_STATUS.radioButtonGemeld).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('not.be.checked').and('not.be.disabled');
      cy.contains(MESSAGES.sendMailText).should('be.visible');
      cy.contains('Toelichting (niet verplicht)').should('be.visible');
      cy.get(CHANGE_STATUS.radioButtonInAfwachting).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('not.be.checked').and('not.be.disabled');
      cy.contains(MESSAGES.sendMailText).should('be.visible');
      cy.contains('Toelichting (niet verplicht)').should('be.visible');
      cy.get(CHANGE_STATUS.radioButtonIngepland).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('be.checked').and('be.disabled');
      cy.contains(MESSAGES.sendMailText).should('be.visible');
      cy.contains('Toelichting (niet verplicht)').should('not.exist');
      cy.get(CHANGE_STATUS.radioButtonExtern).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('not.be.checked').and('not.be.disabled');
      cy.contains(MESSAGES.sendMailText).should('be.visible');
      cy.contains('Toelichting (niet verplicht)').should('be.visible');
      cy.get(CHANGE_STATUS.radioButtonAfgehandeld).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('be.checked').and('be.disabled');
      cy.contains(MESSAGES.sendMailText).should('be.visible');
      cy.contains('Toelichting (niet verplicht)').should('not.exist');
      cy.get(CHANGE_STATUS.radioButtonHeropend).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('be.checked').and('be.disabled');
      cy.contains(MESSAGES.sendMailText).should('be.visible');
      cy.contains('Toelichting (niet verplicht)').should('not.exist');
      cy.get(CHANGE_STATUS.radioButtonGeannuleerd).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.checkboxSendEmail).should('be.visible').and('not.be.checked').and('not.be.disabled');
      cy.contains(MESSAGES.sendMailText).should('be.visible');
      cy.contains('Toelichting (niet verplicht)').should('be.visible');

      cy.get(CHANGE_STATUS.radioButtonInBehandeling).check({ force: true }).should('be.checked');
      cy.get(CHANGE_STATUS.inputToelichting).type('Wij hebben uw zinloze melding toch maar in behandeling genomen');
      cy.get(CHANGE_STATUS.buttonSubmit).click();

      createSignal.checkFlashingYellow();

      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.status)
        .should('have.text', 'In behandeling')
        .and('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });

      cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 10);
      cy.get(SIGNAL_DETAILS.historyAction)
        .first()
        .should('contain', 'Status gewijzigd naar: In behandeling')
        .and('be.visible');
      cy.get(SIGNAL_DETAILS.historyListItem)
        .first()
        .should('contain', 'Wij hebben uw zinloze melding toch maar in behandeling genomen')
        .and('be.visible');
    });

    it('Should change urgency', () => {
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();

      // Used a wait because sometimes the edit button is not clicked
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      cy.get(CHANGE_URGENCY.buttonEdit).click();

      cy.get(CHANGE_URGENCY.radioButtonNormaal).should('be.checked');
      cy.get(CHANGE_URGENCY.radioButtonLaag).click({ force: true });
      cy.contains(URGENCY_TEXT.laag).should('be.visible');
      cy.get(CHANGE_URGENCY.radioButtonHoog).click({ force: true });
      cy.contains(URGENCY_TEXT.hoog).should('be.visible');

      cy.get(CHANGE_URGENCY.buttonCancel).click();
      cy.get(SIGNAL_DETAILS.urgency).should('have.text', 'Normaal').and('be.visible');

      cy.get(CHANGE_URGENCY.buttonEdit).click();
      cy.get(CHANGE_URGENCY.radioButtonNormaal).should('be.checked');
      cy.get(CHANGE_URGENCY.radioButtonHoog).click({ force: true });
      cy.get(CHANGE_URGENCY.buttonSubmit).click();

      createSignal.checkFlashingYellow();

      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.urgency)
        .should('have.text', 'Hoog')
        .and('be.visible')
        .and($labels => {
          expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
        });

      cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 11);
      cy.get(SIGNAL_DETAILS.historyAction).contains('Urgentie gewijzigd naar: Hoog').should('be.visible');
    });

    it('Should change type', () => {
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();
      // Used a wait because sometimes the edit button is not clicked
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      cy.get(CHANGE_TYPE.buttonEdit).click();

      cy.get(CHANGE_TYPE.radioButtonMelding).should('be.checked');
      cy.contains(TYPE_TEXT.melding);
      cy.get(CHANGE_TYPE.radioButtonAanvraag).click({ force: true }).should('be.checked');
      cy.contains(TYPE_TEXT.aanvraag);
      cy.get(CHANGE_TYPE.radioButtonVraag).click({ force: true }).should('be.checked');
      cy.contains(TYPE_TEXT.vraag);
      cy.get(CHANGE_TYPE.radioButtonKlacht).click({ force: true }).should('be.checked');
      cy.contains(TYPE_TEXT.klacht);
      cy.get(CHANGE_TYPE.radioButtonGrootOnderhoud).click({ force: true }).should('be.checked');
      cy.contains(TYPE_TEXT.grootOnderhoud);

      cy.get(CHANGE_TYPE.buttonCancel).click();
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Melding').and('be.visible');

      cy.get(CHANGE_TYPE.buttonEdit).click();
      cy.get(CHANGE_TYPE.radioButtonGrootOnderhoud).click({ force: true });
      cy.get(CHANGE_TYPE.buttonSubmit).click();

      createSignal.checkFlashingYellow();

      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.type).should('have.text', 'Groot onderhoud').and('be.visible');

      cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 12);
      cy.get(SIGNAL_DETAILS.historyAction).contains('Type gewijzigd naar: Groot onderhoud').should('be.visible');
    });

    it('Should change category', () => {
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();
      // Used a wait because sometimes the edit button is not clicked
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
      cy.get(CHANGE_CATEGORY.buttonEdit).click();
      cy.get(CHANGE_CATEGORY.inputCategory).select('Overig openbare ruimte (ASC)');

      cy.get(CHANGE_CATEGORY.buttonCancel).click();

      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Graffiti / wildplak (STW)').and('be.visible');
      cy.get(CHANGE_CATEGORY.buttonEdit).click();
      cy.get(CHANGE_CATEGORY.inputCategory).select('Overig openbare ruimte (ASC)');
      cy.get(CHANGE_CATEGORY.buttonSubmit).click();

      createSignal.checkFlashingYellow();

      cy.wait('@getHistory');
      cy.wait('@getSignals');
      cy.get(SIGNAL_DETAILS.subCategory).should('have.text', 'Overig openbare ruimte (ASC)').and('be.visible');
      cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', 'Overlast in de openbare ruimte').and('be.visible');

      cy.get(SIGNAL_DETAILS.historyAction).should('have.length', 14);
      cy.get(SIGNAL_DETAILS.historyAction)
        .contains('Categorie gewijzigd naar: Overig openbare ruimte')
        .should('be.visible');
    });
  });
});
