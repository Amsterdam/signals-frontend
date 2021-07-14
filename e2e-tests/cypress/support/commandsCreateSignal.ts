// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import appConfig from '../../../app.amsterdam.json';
import { CREATE_SIGNAL } from './selectorsCreateSignal';
import { CHANGE_STATUS, SIGNAL_DETAILS } from './selectorsSignalDetails';
import { MANAGE_SIGNALS } from './selectorsManageIncidents';
import * as commandsGeneral from './commandsGeneral';
import * as routes from './commandsRouting';
import 'cypress-file-upload';

/**
 * Custom command to add a note to a signal.
 * @example cy.addnote('This is a note');
*/
export const addNote = (noteText: string) => {
  cy.get(SIGNAL_DETAILS.buttonAddNote).click();
  cy.get(SIGNAL_DETAILS.inputNoteText).type(noteText);
  cy.get(SIGNAL_DETAILS.buttonSaveNote).click();
};

/**
 * Custom command to change the status of a signal.
 * @example cy.changeSignalStatus('Gemeld', 'In afwachting van behandeling', CHANGE_STATUS.radioButtonInAfwachting);
*/
export const changeSignalStatus = (initialStatus: string, newStatus: string, radioButton: string) => {
  routes.getSortedByTimeRoutes();
  routes.getHistoryRoute();
  // Used a wait because sometimes the edit button is not clicked
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.get(CHANGE_STATUS.buttonEdit).click({ force: true });
  cy.contains('Status wijzigen').should('be.visible');
  cy.get(CHANGE_STATUS.currentStatus).contains(initialStatus).should('be.visible');
  cy.get(radioButton).click({ force: true }).should('be.checked');
  cy.get(CHANGE_STATUS.inputToelichting).type('Toeterlichting');
  cy.get(CHANGE_STATUS.buttonSubmit).click();

  cy.wait('@getHistory');
  cy.wait('@getSortedTimeDESC');
  cy.get(SIGNAL_DETAILS.status)
    .should('have.text', newStatus)
    .and('be.visible')
    .and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });
};

/**
 * Custom command to check if all directing departments of a signal are visible in the signal details.
 * @example cy.checkDepartments('../fixtures/signals/fietsNietje.json');
*/
export const checkDepartments = (json: signal.RootObject) => {
  Object.values(json.directing_departments).forEach((elementValue: signal.DirectingDepartment) => {
    cy.contains(elementValue.code).should('be.visible');
  });
};

/**
 * Custom command to check if a detail of a signal is flashing yellow after changing it.
 * @example cy.checkFlashingYellow();
*/
export const checkFlashingYellow = () => {
  if (Cypress.browser.name === 'firefox') {
    cy.log('No check on flashing yellow in Firefox');
  } else {
    cy.get('.animate').then($selectors => {
      const win = $selectors[0].ownerDocument.defaultView as Window;
      const after = win.getComputedStyle($selectors[0], 'after');
      const contentValue = after.getPropertyValue('background-color');
      expect(contentValue).to.eq('rgb(254, 200, 19)');
    });
  }
};

/**
 * Custom command to check if all elements of the header and footer are visible.
 * @example cy.checkHeaderFooter();
*/
export const checkHeaderFooter = () => {
  cy.get(CREATE_SIGNAL.siteHeader).find('a').should('have.attr', 'href', `${appConfig.links.home}`).and('be.visible');
  cy.get(`${CREATE_SIGNAL.disclaimer} h2`).should('have.text', 'Lukt het niet om een melding te doen?').and('be.visible');
  cy.contains(appConfig.language.footer2).should('be.visible');
  cy.get(CREATE_SIGNAL.siteFooter).find('a').eq(1).should('have.attr', 'href', `${appConfig.links.privacy}`).and('be.visible');
};

/**
 * Custom command to check if all the general elements of the description page are visible.
 * @example cy.checkDescriptionPage();
*/
export const checkDescriptionPage = () => {
  commandsGeneral.checkHeaderText('Beschrijf uw melding');
  cy.contains('Waar is het?').should('be.visible');
  cy.contains('Typ het dichtstbijzijnde adres of klik de locatie aan op de kaart').should('be.visible');
  cy.get(CREATE_SIGNAL.buttonGPS).should('be.visible');
  cy.contains('Waar gaat het om?').should('be.visible');
  cy.contains('Typ geen persoonsgegevens in deze omschrijving, dit wordt apart gevraagd').should('be.visible');
  cy.contains('Geef het tijdstip aan').should('be.visible');
  cy.contains("Foto's toevoegen").should('be.visible');
  cy.contains('Voeg een foto toe om de situatie te verduidelijken').should('be.visible');
  cy.get('body').then($body => {
    if ($body.find(`${CREATE_SIGNAL.disclaimer}`).length > 0) {
      checkHeaderFooter();
    }
  });
};

/**
 * Custom command to check if a status text is red and visible.
 * @example cy.checkRedTextStatus('Gemeld');
*/
export const checkRedTextStatus = (status: string) => {
  cy.get(SIGNAL_DETAILS.status)
    .should('have.text', status)
    .and('be.visible')
    .and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });
};

/**
 * Custom command to check if all questions and answers of a signal are visible, option for short or full lable.
 * @example cy.checkQuestions('../fixtures/signals/fietsNietje.json', short);
*/
export const checkQuestions = (json: signal.RootObject, labelType) => {
  Object.values(json.extra_properties).forEach((elementAValue: signal.ExtraProperties) => {
    if (labelType === 'short') {
      cy.contains(elementAValue.shortLabel).should('be.visible');
    }
    else if (labelType === 'full') {
      cy.contains(elementAValue.label).should('be.visible');
    }
    if (elementAValue.answer.label) {
      cy.contains(elementAValue.answer.label).should('be.visible');
    }
    else if (Array.isArray(elementAValue.answer)) {
      Object.values(elementAValue.answer).forEach((elementBValue: signal.ExtraProperties) => {
        cy.contains(elementBValue.label).should('be.visible');
      });
    }
    else {
      cy.contains(elementAValue.answer).should('be.visible');
    }
  });
};

/**
 * Custom command to check if all general elements on the signal detail page are visible.
 * @example cy.checkSignalDetailsPage();
*/
export const checkSignalDetailsPage = () => {
  cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
    cy.url().should('include', `/manage/incident/${json.signalId}`);
  });
  cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
  cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
  cy.get(SIGNAL_DETAILS.labelEmail).should('have.text', 'E-mail melder').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelLocatie).should('have.text', 'Locatie').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelOverlast).should('have.text', 'Overlast').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelTelefoon).should('have.text', 'Telefoon melder').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelToestemming).should('have.text', 'Toestemming contactgegevens delen').and('be.visible');
};

/**
 * Custom command to check if a source is correct and visible in the signal details.
 * @example cy.checkSource('online');
*/
export const checkSource = (source: string) => {
  if (source === 'online' || source === 'Interne melding') {
    cy.get(SIGNAL_DETAILS.source).should('have.text', source).and('be.visible');
  }
  else {
    cy.readFile('./cypress/fixtures/tempSource.json').then(jsontemp => {
      cy.get(SIGNAL_DETAILS.source).should('have.text', jsontemp.source).and('be.visible');
    });
  }
};

/**
 * Custom command to check all the details of a signal.
 * @example cy.checkAllDetails('../fixtures/signals/fietsNietje.json');
*/
export const checkAllDetails = (json: signal.RootObject, signalType: string) => {
  if (signalType === 'deelmelding') {
    cy.get(SIGNAL_DETAILS.addressStreet).should('not.exist');
    cy.get(SIGNAL_DETAILS.addressCity).should('not.exist');
    cy.get(SIGNAL_DETAILS.email).should('have.text', '').and('be.visible');
    cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', '').and('be.visible');
  }
  else {
    cy.readFile('./cypress/fixtures/tempSignalId.json').then(jsonSignal => {
      cy.url().should('include', `/manage/incident/${jsonSignal.signalId}`);
    });
    const address = json.address.huisnummer_toevoeging ? `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}-${json.address.huisnummer_toevoeging}` : `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}`;
    cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', address).and('be.visible');
    cy.get(SIGNAL_DETAILS.addressCity).should('have.text', `${json.address.postcode} ${json.address.woonplaats}`).and('be.visible');
    cy.get(SIGNAL_DETAILS.email).should('have.text', json.reporter.email).and('be.visible');
    cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', json.reporter.phone).and('be.visible');
    cy.get(SIGNAL_DETAILS.phoneNumberLink).should('have.attr', 'href');
  }

  cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
  cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
  cy.get(SIGNAL_DETAILS.labelEmail).should('have.text', 'E-mail melder').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelLocatie).should('have.text', 'Locatie').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelOverlast).should('have.text', 'Overlast').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelTelefoon).should('have.text', 'Telefoon melder').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelToestemming).should('have.text', 'Toestemming contactgegevens delen').and('be.visible');
  cy.contains(json.text).should('be.visible');
  cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', `Stadsdeel: ${json.address.stadsdeel}`).and('be.visible');
  cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', json.reporter.sharing_allowed).and('be.visible');
  cy.get(SIGNAL_DETAILS.creationDate).should('contain', commandsGeneral.getTodaysDate());
  cy.get(SIGNAL_DETAILS.handlingTime).should('contain', json.category.handling_time).and('be.visible');
  checkRedTextStatus(json.status.state_display);
  cy.get(SIGNAL_DETAILS.urgency).should('have.text', json.priority).and('be.visible');
  cy.get(SIGNAL_DETAILS.labelDoorlooptijd).should('have.text', 'Doorlooptijd').and('be.visible');
  cy.get(SIGNAL_DETAILS.doorlooptijd).should('have.text', json.process_time).and('be.visible');
  cy.get(SIGNAL_DETAILS.type).should('have.text', json.type).and('be.visible');
  cy.get(SIGNAL_DETAILS.subCategory).should('contain', `${json.category.sub}`).and('be.visible');
  checkDepartments(json);
  cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', json.category.main).and('be.visible');
  checkSource(json.source);
  if (json.fixtures.attachments) {
    cy.get(SIGNAL_DETAILS.photo).each(($el) => {
      cy.wrap($el).should('be.visible').click();
      cy.get(SIGNAL_DETAILS.photoViewerImage).should('be.visible');
      cy.get(SIGNAL_DETAILS.buttonCloseImageViewer).click();
    });
  }
  checkQuestions(json, 'short');
};

/**
 * Custom command to check if all general elements on the specific questions page are visible.
 * @example cy.checkSpecificInformationPage('../fixtures/signals/fietsNietje.json');
*/
export const checkSpecificInformationPage = (json: signal.RootObject) => {
  cy.url().should('include', '/incident/vulaan');
  commandsGeneral.checkHeaderText('Dit hebben we nog van u nodig');
  cy.contains('Dit hebt u net ingevuld:').should('be.visible');
  cy.contains(json.text).should('be.visible');
  cy.get('body').then($body => {
    if ($body.find(`${CREATE_SIGNAL.disclaimer}`).length > 0) {
      checkHeaderFooter();
    }
  });
};

/**
 * Custom command to check if all elements on the summary page are visible.
 * @example cy.checkSummaryPage('../fixtures/signals/fietsNietje.json');
*/
export const checkSummaryPage = (json: signal.RootObject) => {
  cy.url().should('include', '/incident/samenvatting');
  commandsGeneral.checkHeaderText('Controleer uw gegevens');
  cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
  cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
  cy.contains(
    'Ja, ik geef de gemeenten Amsterdam en Weesp toestemming om mijn melding met contactgegevens te delen met andere organisaties, zoals de Politie of de Dierenambulance, als de melding niet voor de gemeente is bestemd.'
  ).should('be.visible');
  cy.get('body').then($body => {
    if ($body.find(`${CREATE_SIGNAL.disclaimer}`).length > 0) {
      checkHeaderFooter();
    }
  });
  const address = json.address.huisnummer_toevoeging ? `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}-${json.address.huisnummer_toevoeging}, ${json.address.postcode} ${json.address.woonplaats}` : `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}, ${json.address.postcode} ${json.address.woonplaats}`;
  cy.contains(address).should('be.visible');
  cy.contains(json.text).should('be.visible');
  if (json.time === 'Eerder') {
    cy.readFile('./cypress/fixtures/tempDateTime.json').then(jsonDateTime => {
      cy.contains(jsonDateTime.dateTime).should('be.visible');
    });
  }
  else {
    cy.contains(json.time).should('be.visible');
  }
  if (json.reporter.phone) {
    cy.contains(json.reporter.phone).should('be.visible');
  }
  if (json.reporter.email) {
    cy.contains(json.reporter.email).should('be.visible');
  }
  if (json.reporter.sharing_allowed === 'Ja') {
    cy.get(CREATE_SIGNAL.checkBoxSharingAllowed).check().should('be.checked');
  }
  if (json.fixtures.attachments) {
    cy.get(CREATE_SIGNAL.imageFileUpload).should('be.visible');
  }
  checkQuestions(json, 'full');
};

/**
 * Custom command to check if all general elements on the thanks page are visible.
 * @example cy.checkThanksPage();
*/
export const checkThanksPage = () => {
  cy.url().should('include', '/incident/bedankt');
  commandsGeneral.checkHeaderText('Bedankt!');
  cy.contains('Wat doen we met uw melding?').should('be.visible');
  cy.contains('Wilt u nog een andere melding doen?').should('be.visible');
  cy.get('body').then($body => {
    if ($body.find(`${CREATE_SIGNAL.disclaimer}`).length > 0) {
      checkHeaderFooter();
    }
  });
};

/**
   * Custom command to open a previousely (in the same test) created signal.
   * @example cy.openCreatedSignal();
*/
export const openCreatedSignal = () => {
  cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
    cy.get('tr td:nth-child(2)').contains(new RegExp(`^${json.signalId}$`, 'g')).click();
  });
};

/**
 * Custom command to save the signal ID for later user.
 * @example cy.saveSignalId();
*/
export const saveSignalId = () => {
  cy.get('[data-testid="plainText"')
    .then($signalLabel => {
      // Get the signal id
      const text = $signalLabel.text();
      const expression = (/\d+/);
      const signalNumber = expression.exec(text)[0];
      cy.log(signalNumber);
      // Set the signal id in variable for later use
      cy.writeFile('./cypress/fixtures/tempSignalId.json', { signalId: `${signalNumber}` }, { flag: 'w' });
    });
};

/**
 * Custom command to search for an address.
 * @example cy.searchAddress('1012AB 1');
*/
export const searchAddress = (address: string) => {
  cy.get('[data-testid=autoSuggest]').type(address, { delay: 60 });
};

/**
 * Custom command to search signals with a searchterm and check if a selector contains the searchtext.
 * @example cy.searchAndCheck('Pakjesboot', SIGNAL_DETAILS.descriptionText);
*/
export const searchAndCheck = (searchTerm: string, selector: string) => {
  routes.getSignalDetailsRoutes();
  cy.get(MANAGE_SIGNALS.searchBar).type(`${searchTerm}{enter}`);
  cy.wait('@getSearchResults');
  cy.get(MANAGE_SIGNALS.searchResultsTag).should('have.text', `Zoekresultaten voor "${searchTerm}"`).and('be.visible');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.get('[href*="/manage/incident/"]').first().click();
  routes.waitForSignalDetailsRoutes();
  cy.get(selector).should('contain', `${searchTerm}`);
};

/**
 * Custom command to select an address from the autosuggest results.
 * @example cy.selectAddress('Bethaniënstraat 12, 1012CA Amsterdam');
*/
export const selectAddress = (address: string) => {
  cy.get('[data-testid=suggestList] > li ')
    .contains(new RegExp(`^${address}$`, 'g'))
    .trigger('click');
};

/**
 * Custom command to select a lamp on the map, based on coordinates.
 * @example cy.selectLampByCoordinate(414, 135);
*/
export const selectLampByCoordinate = (coordinateA: number, coordinateB: number) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.get('.leaflet-container').should('be.visible').wait(500).click(coordinateA, coordinateB);
};

/**
 * Custom command to select a source based on its index in the dropdown.
 * @example cy.selectSource(1);
*/
export const selectSource = (index: number) => {
  cy.get('[data-testid="source"] > option')
    .eq(index)
    .then((source: JQuery) => {
      const sourceValue = source.val() as string;
      cy.get('[data-testid="source"]').select(sourceValue);
      cy.writeFile('./cypress/fixtures/tempSource.json', { source: `${source.val()}` }, { flag: 'w' });
    });
};

/**
 * Custom command to search and select an address.
 * @example cy.setAddress('../fixtures/signals/fietsNietje.json');
*/
export const setAddress = (json: signal.RootObject) => {
  routes.stubAddress(json.fixtures.address);
  const address = json.address.huisnummer_toevoeging ? `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}-${json.address.huisnummer_toevoeging}, ${json.address.postcode} ${json.address.woonplaats}` : `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}, ${json.address.postcode} ${json.address.woonplaats}`;
  searchAddress(`${json.address.postcode} ${json.address.huisnummer} ${json.address.huisletter}`);
  selectAddress(address);
};

/**
 * Custom command to set the date and time of a signal.
 * @example cy.setDateTime('Nu');
 * @example cy.setDateTime('Vandaag');
 * @example cy.setDateTime('Eerder');
*/
export const setDateTime = (dateTime: string) => {
  switch (dateTime) {
    case 'Nu':
      cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click({ force: true });
      break;
    case 'Vandaag':
      cy.get(CREATE_SIGNAL.radioButtonTijdstipEerder).click({ force: true });
      cy.get(CREATE_SIGNAL.dropdownDag).select('Vandaag');
      cy.get(CREATE_SIGNAL.dropdownUur).select('5');
      cy.get(CREATE_SIGNAL.dropdownMinuten).select('45');
      break;
    case 'Eerder':
      cy.get(CREATE_SIGNAL.radioButtonTijdstipEerder).click({ force: true });
      cy.get('[data-testid=selectDay] > option')
        .eq(2)
        .then((element: JQuery) => {
          const date = element.val() as string;
          cy.get('[data-testid=selectDay]').select(date);
          cy.writeFile('./cypress/fixtures/tempDateTime.json', { dateTime: `${Cypress.$(element).text()}` }, { flag: 'w' });
        });
      break;
    default:
      cy.log('Unknown datetime, default is chosen');
  }
};

/**
  * Custom command to input the description of a signal.
  * @example cy.setDescription('This is a description of the signal');
 */
export const setDescription = (description: string) => {
  Cypress.env('description', description);
  cy.get('textarea').clear().invoke('val', description).trigger('input');
};

/**
 * Custom command to set the email address.
 * @example cy.setEmailAddress('../fixtures/signals/fietsNietje.json');
*/
export const setEmailAddress = (json: signal.RootObject) => {
  cy.url().should('include', '/incident/email');
  commandsGeneral.checkHeaderText('Wilt u op de hoogte blijven?');
  if (json.reporter.email) {
    cy.get(CREATE_SIGNAL.inputEmail).clear().type(json.reporter.email);
  }
};

/**
 * Custom command to set the phonenumber.
 * @example cy.setPhonenumber('../fixtures/signals/fietsNietje.json');
*/
export const setPhonenumber = (json: signal.RootObject) => {
  cy.url().should('include', '/incident/telefoon');
  commandsGeneral.checkHeaderText('Mogen we u bellen voor vragen?');
  if (json.reporter.phone) {
    cy.get(CREATE_SIGNAL.inputPhoneNumber).clear().type(json.reporter.phone);
  }
};

/**
 * Custom command to upload 0 or more files belonging to a signal.
 * @example cy.uploadAllFiles('../fixtures/signals/fietsNietje.json');
*/
export const uploadAllFiles = (json: signal.RootObject) => {
  if (json.fixtures.attachments) {
    // Check for every itemlist all key-value pairs
    const amountAttachments = Object.keys(json.fixtures.attachments).length;
    let attachmentNumber = 0;
    for (attachmentNumber = 0; attachmentNumber < amountAttachments; attachmentNumber += 1) {
      cy.get(CREATE_SIGNAL.buttonUploadFile).attachFile(json.fixtures.attachments[attachmentNumber]);
    }
  }
};

/**
 * Custom command to input all the data on the description page.
 * @example cy.setDescriptionPage('../fixtures/signals/fietsNietje.json');
*/
export const setDescriptionPage = (json: signal.RootObject) => {
  routes.stubPrediction(json.fixtures.prediction);
  checkDescriptionPage();
  setAddress(json);
  setDescription(json.text);
  setDateTime(json.time);
  uploadAllFiles(json);
  if (json.source !== 'online' && json.source !== 'Interne melding') {
    selectSource(1);
    cy.contains(json.priority).should('be.visible').click();
    cy.contains(json.type).should('be.visible').click();
  }
};
