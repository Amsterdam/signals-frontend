import appConfig from '../../../app.amsterdam.json';
import { CREATE_SIGNAL } from './selectorsCreateSignal';
import { CHANGE_STATUS, SIGNAL_DETAILS } from './selectorsSignalDetails';
import { MANAGE_SIGNALS } from './selectorsManageIncidents';
import 'cypress-file-upload';

Cypress.Commands.add('addNote', noteText => {
  cy.get(SIGNAL_DETAILS.buttonAddNote).click();
  cy.get(SIGNAL_DETAILS.inputNoteText).type(noteText);
  cy.get(SIGNAL_DETAILS.buttonSaveNote).click();
});

Cypress.Commands.add('changeSignalStatus', (initialStatus, newStatus, radioButton) => {
  cy.getSortedByTimeRoutes();
  cy.getHistoryRoute();
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
});

Cypress.Commands.add('checkAllDetails', json => {
  cy.readFile('./cypress/fixtures/tempSignalId.json').then(jsonSignal => {
    cy.url().should('include', `/manage/incident/${jsonSignal.signalId}`);
  });
  cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
  cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
  cy.get(SIGNAL_DETAILS.labelEmail).should('have.text', 'E-mail melder').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelLocatie).should('have.text', 'Locatie').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelOverlast).should('have.text', 'Overlast').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelTelefoon).should('have.text', 'Telefoon melder').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelToestemming).should('have.text', 'Toestemming contactgegevens delen').and('be.visible');
  const address = json.address.huisnummer_toevoeging ? `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}-${json.address.huisnummer_toevoeging}` : `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}`;
  cy.contains(json.text).should('be.visible');
  cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', `Stadsdeel: ${json.address.stadsdeel}`).and('be.visible');
  cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', address).and('be.visible');
  cy.get(SIGNAL_DETAILS.addressCity).should('have.text', `${json.address.postcode} ${json.address.woonplaats}`).and('be.visible');
  cy.get(SIGNAL_DETAILS.email).should('have.text', json.reporter.email).and('be.visible');
  cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', json.reporter.phone).and('be.visible');
  cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', json.reporter.sharing_allowed).and('be.visible');
  cy.checkCreationDate();
  cy.get(SIGNAL_DETAILS.handlingTime).should('contain', json.category.handling_time).and('be.visible');
  cy.checkRedTextStatus(json.status.state_display);
  cy.get(SIGNAL_DETAILS.urgency).should('have.text', json.priority).and('be.visible');
  cy.get(SIGNAL_DETAILS.type).should('have.text', json.type).and('be.visible');
  cy.get(SIGNAL_DETAILS.subCategory).should('contain', `${json.category.sub}`).and('be.visible');
  cy.checkDepartments(json);
  cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', json.category.main).and('be.visible');
  cy.checkSource(json.source);
  if (json.fixtures.attachments) {
    cy.get(SIGNAL_DETAILS.photo).should('be.visible').click();
    cy.get(SIGNAL_DETAILS.photoViewerImage).should('be.visible');
    cy.get(SIGNAL_DETAILS.buttonCloseImageViewer).click();
  }
  cy.checkQuestions(json);
});

Cypress.Commands.add('checkCreationDate', () => {
  const todaysDate = Cypress.moment().format('DD-MM-YYYY');
  cy.get(SIGNAL_DETAILS.creationDate).should('contain', todaysDate);
});

Cypress.Commands.add('checkDescriptionPage', () => {
  cy.checkHeaderText('Beschrijf uw melding');
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
      cy.checkHeaderFooter();
    }
  });
});

Cypress.Commands.add('checkDepartments', json => {
  Object.values(json.directing_departments).forEach((elementValue: signal.DirectingDepartment) => {
    cy.contains(elementValue.code).should('be.visible');
  });
});

Cypress.Commands.add('checkFlashingYellow', () => {
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
});

Cypress.Commands.add('checkHeaderFooter', () => {
  cy.get(CREATE_SIGNAL.logoAmsterdam).should('have.attr', 'href', `${appConfig.links.home}`).and('be.visible');
  cy.get(`${CREATE_SIGNAL.disclaimer} h2`).should('have.text', 'Lukt het niet om een melding te doen?');
  cy.contains(appConfig.language.footer2);
  cy.get(CREATE_SIGNAL.footerPrivacyLink).should('have.attr', 'href', `${appConfig.links.privacy}`).and('be.visible');
});

Cypress.Commands.add('checkRedTextStatus', status => {
  cy.get(SIGNAL_DETAILS.status)
    .should('have.text', status)
    .and('be.visible')
    .and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });
});

Cypress.Commands.add('checkQuestions', json => {
  Object.values(json.extra_properties).forEach((elementAValue: signal.ExtraProperties) => {
    cy.contains(elementAValue.label).should('be.visible');
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
});

Cypress.Commands.add('checkSignalDetailsPage', () => {
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
});

Cypress.Commands.add('checkSource', source => {
  if (source === 'online' || source === 'Interne melding') {
    cy.get(SIGNAL_DETAILS.source).should('have.text', source).and('be.visible');
  }
  else {
    cy.readFile('./cypress/fixtures/tempSource.json').then(jsontemp => {
      cy.get(SIGNAL_DETAILS.source).should('have.text', jsontemp.source).and('be.visible');
    });
  }
});

Cypress.Commands.add('checkSpecificInformationPage', json => {
  cy.url().should('include', '/incident/vulaan');
  cy.checkHeaderText('Dit hebben we nog van u nodig');
  cy.contains('Dit hebt u net ingevuld:').should('be.visible');
  cy.contains(json.text).should('be.visible');
  cy.get('body').then($body => {
    if ($body.find(`${CREATE_SIGNAL.disclaimer}`).length > 0) {
      cy.checkHeaderFooter();
    }
  });
});

Cypress.Commands.add('checkSummaryPage', json => {
  cy.url().should('include', '/incident/samenvatting');
  cy.checkHeaderText('Controleer uw gegevens');
  cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
  cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
  cy.contains(
    'Ja, ik geef gemeente Amsterdam en gemeente Weesp toestemming om mijn contactgegevens te delen met andere organisaties, als dat nodig is om mijn melding goed op te lossen.'
  ).should('be.visible');
  cy.get('body').then($body => {
    if ($body.find(`${CREATE_SIGNAL.disclaimer}`).length > 0) {
      cy.checkHeaderFooter();
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
  cy.checkQuestions(json);
});

Cypress.Commands.add('checkThanksPage', () => {
  cy.url().should('include', '/incident/bedankt');
  cy.checkHeaderText('Bedankt!');
  cy.get('body').then($body => {
    if ($body.find(`${CREATE_SIGNAL.disclaimer}`).length > 0) {
      cy.checkHeaderFooter();
    }
  });
});

Cypress.Commands.add('openCreatedSignal', () => {
  cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
    cy.get('tr td:nth-child(2)').contains(new RegExp(`^${json.signalId}$`, 'g')).click();
  });
});

Cypress.Commands.add('saveSignalId', () => {
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
});

Cypress.Commands.add('searchAddress', address => {
  cy.get('[data-testid=autoSuggest]').type(address, { delay: 60 });
});

Cypress.Commands.add('searchAndCheck', (searchTerm, selector) => {
  cy.getSignalDetailsRoutes();
  cy.get(MANAGE_SIGNALS.searchBar).type(`${searchTerm}{enter}`);
  cy.wait('@getSearchResults');
  cy.get(MANAGE_SIGNALS.searchResultsTag).should('have.text', `Zoekresultaten voor "${searchTerm}"`).and('be.visible');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.get('[href*="/manage/incident/"]').first().click();
  cy.waitForSignalDetailsRoutes();
  cy.get(selector).should('contain', `${searchTerm}`);
});

Cypress.Commands.add('selectAddress', address => {
  cy.get('[data-testid=suggestList] > li ')
    .contains(new RegExp(`^${address}$`, 'g'))
    .trigger('click');
});

Cypress.Commands.add('selectLampOnCoordinate', (coordinateA, coordinateB) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.get('.leaflet-container').should('be.visible').wait(500).click(coordinateA, coordinateB);
});

Cypress.Commands.add('selectSource', index => {
  cy.get('[data-testid="source"] > option')
    .eq(index)
    .then((source: JQuery) => {
      const sourceValue = source.val() as string;
      cy.get('[data-testid="source"]').select(sourceValue);
      cy.writeFile('./cypress/fixtures/tempSource.json', { source: `${source.val()}` }, { flag: 'w' });
    });
});

Cypress.Commands.add('setAddress', json => {
  cy.stubAddress(json.fixtures.address);
  const address = json.address.huisnummer_toevoeging ? `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}-${json.address.huisnummer_toevoeging}, ${json.address.postcode} ${json.address.woonplaats}` : `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}, ${json.address.postcode} ${json.address.woonplaats}`;
  cy.searchAddress(`${json.address.postcode} ${json.address.huisnummer}`);
  cy.selectAddress(address);
});

Cypress.Commands.add('setDateTime', dateTime => {
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
      cy.get('[data-testid=day] > option')
        .eq(2)
        .then((element: JQuery) => {
          const date = element.val() as string;
          cy.get('[data-testid=day]').select(date);
          cy.writeFile('./cypress/fixtures/tempDateTime.json', { dateTime: `${Cypress.$(element).text()}` }, { flag: 'w' });
        });
      break;
    default:
      cy.log('Unknown datetime, default is chosen');
  }
});

Cypress.Commands.add('setDescription', description => {
  Cypress.env('description', description);
  cy.get('textarea').clear().invoke('val', description).trigger('input');
});

Cypress.Commands.add('setDescriptionPage', json => {
  cy.stubPrediction(json.fixtures.prediction);
  cy.checkDescriptionPage();
  cy.setAddress(json);
  cy.setDescription(json.text);
  cy.setDateTime(json.time);
  cy.uploadAllFiles(json);
  if (json.source !== 'online' && json.source !== 'Interne melding') {
    cy.selectSource(1);
    cy.contains(json.priority).should('be.visible').click();
    cy.contains(json.type).should('be.visible').click();
  }
});

Cypress.Commands.add('setEmailAddress', json => {
  cy.url().should('include', '/incident/email');
  cy.checkHeaderText('Wilt u op de hoogte blijven?');
  if (json.reporter.email) {
    cy.get(CREATE_SIGNAL.inputEmail).clear().type(json.reporter.email);
  }
});

Cypress.Commands.add('setPhonenumber', json => {
  cy.url().should('include', '/incident/telefoon');
  cy.checkHeaderText('Mogen we u bellen voor vragen?');
  if (json.reporter.phone) {
    cy.get(CREATE_SIGNAL.inputPhoneNumber).clear().type(json.reporter.phone);
  }
});

Cypress.Commands.add('uploadAllFiles', json => {
  if (json.fixtures.attachments) {
    // Check for every itemlist all key-value pairs
    const amountAttachments = Object.keys(json.fixtures.attachments).length;
    let attachmentNumber = 0;
    for (attachmentNumber = 0; attachmentNumber < amountAttachments; attachmentNumber += 1) {
      cy.get(CREATE_SIGNAL.buttonUploadFile).attachFile(json.fixtures.attachments[attachmentNumber]);
    }
  }
});
