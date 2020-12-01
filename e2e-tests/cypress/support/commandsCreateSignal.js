/* eslint-disable no-loop-func */
/* eslint-disable promise/no-nesting */
import appConfig from '../../../app.base.json';
import { CREATE_SIGNAL } from './selectorsCreateSignal';
import { CHANGE_STATUS, SIGNAL_DETAILS } from './selectorsSignalDetails';
import { MANAGE_SIGNALS } from './selectorsManageIncidents';

export const addNote = noteText => {
  cy.get(SIGNAL_DETAILS.buttonAddNote).click();
  cy.get(SIGNAL_DETAILS.inputNoteText).type(noteText);
  cy.get(SIGNAL_DETAILS.buttonSaveNote).click();
};

export const changeSignalStatus = (initialStatus, newStatus, radioButton) => {
  cy.server();
  cy.route('/signals/v1/private/signals/?page=1&ordering=-created_at&page_size=50').as('getSignal');
  cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
    cy.route(`/signals/v1/private/signals/${json.signalId}/history`).as('getHistory');
  });
  cy.get(CHANGE_STATUS.buttonEdit).click();
  cy.contains('Status wijzigen').should('be.visible');
  cy.get(CHANGE_STATUS.currentStatus).contains(initialStatus).should('be.visible');
  cy.get(radioButton).click({ force: true }).should('be.checked');
  cy.get(CHANGE_STATUS.inputToelichting).type('Toeterlichting');
  cy.get(CHANGE_STATUS.buttonSubmit).click();

  cy.wait('@getHistory');
  cy.wait('@getSignal');
  cy.get(SIGNAL_DETAILS.status)
    .should('have.text', newStatus)
    .and('be.visible')
    .and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });
};

export const checkAllDetails = fixturePath => {
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
  cy.fixture(fixturePath).then(json => {
    const address = json.address.huisnummer_toevoeging ? `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}-${json.address.huisnummer_toevoeging}` : `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}`;
    cy.contains(json.text).should('be.visible');
    cy.get(SIGNAL_DETAILS.stadsdeel).should('have.text', `Stadsdeel: ${json.address.stadsdeel}`).and('be.visible');
    cy.get(SIGNAL_DETAILS.addressStreet).should('have.text', address).and('be.visible');
    cy.get(SIGNAL_DETAILS.addressCity).should('have.text', `${json.address.postcode} ${json.address.woonplaats}`).and('be.visible');
    cy.get(SIGNAL_DETAILS.email).should('have.text', json.reporter.email).and('be.visible');
    cy.get(SIGNAL_DETAILS.phoneNumber).should('have.text', json.reporter.phone).and('be.visible');
    cy.get(SIGNAL_DETAILS.shareContactDetails).should('have.text', json.reporter.sharing_allowed).and('be.visible');
    checkCreationDate();
    cy.get(SIGNAL_DETAILS.handlingTime).should('contain', json.category.handling_time).and('be.visible');
    checkRedTextStatus(json.status.state_display);
    cy.get(SIGNAL_DETAILS.urgency).should('have.text', json.priority).and('be.visible');
    cy.get(SIGNAL_DETAILS.type).should('have.text', json.type).and('be.visible');
    cy.get(SIGNAL_DETAILS.subCategory).should('contain', `${json.category.sub}`).and('be.visible');
    checkDepartments(fixturePath);
    cy.get(SIGNAL_DETAILS.mainCategory).should('have.text', json.category.main).and('be.visible');
    checkSource(json.source);
    if (json.fixtures.attachments) {
      cy.get(SIGNAL_DETAILS.photo).should('be.visible').click();
      cy.get(SIGNAL_DETAILS.photoViewerImage).should('be.visible');
      cy.get(SIGNAL_DETAILS.buttonCloseImageViewer).click();
    }
  });
};

export const checkCreationDate = () => {
  const todaysDate = Cypress.moment().format('DD-MM-YYYY');
  cy.get(SIGNAL_DETAILS.creationDate).should('contain', todaysDate);
};

export const checkDescriptionPage = () => {
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
      checkHeaderFooter();
    }
  });
};

export const checkDepartments = fixturePath => {
  cy.fixture(fixturePath).then(json => {
    // eslint-disable-next-line no-unused-vars
    Object.entries(json.directing_departments).forEach(([keyA, valueA]) => {
      cy.contains(valueA.code).should('be.visible');
    });
  });
};

export const checkFlashingYellow = () => {
  if (Cypress.browser.name === 'firefox') {
    cy.log('No check on flashing yellow in Firefox');
  } else {
    cy.get('.animate').then($selectors => {
      const win = $selectors[0].ownerDocument.defaultView;
      const after = win.getComputedStyle($selectors[0], 'after');
      const contentValue = after.getPropertyValue('background-color');
      expect(contentValue).to.eq('rgb(254, 200, 19)');
    });
  }
};

export const checkHeaderFooter = () => {
  cy.get(CREATE_SIGNAL.logoAmsterdam).should('have.attr', 'href', `${appConfig.links.home}`).and('be.visible');
  cy.get(`${CREATE_SIGNAL.disclaimer} h2`).should('have.text', 'Lukt het niet om een melding te doen?');
  cy.contains(appConfig.language.footer2);
  cy.get(CREATE_SIGNAL.footerPrivacyLink).should('have.attr', 'href', `${appConfig.links.privacy}`).and('be.visible');
};

export const checkRedTextStatus = status => {
  cy.get(SIGNAL_DETAILS.status)
    .should('have.text', status)
    .and('be.visible')
    .and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });
};

export const checkQuestions = fixturePath => {
  cy.fixture(fixturePath).then(json => {
    // eslint-disable-next-line no-unused-vars
    Object.entries(json.extra_properties).forEach(([keyA, valueA]) => {
      cy.contains(valueA.label);
      if (valueA.answer.label) {
        cy.contains(valueA.answer.label);
      }
      else if (Array.isArray(valueA.answer)) {
        // eslint-disable-next-line no-unused-vars
        Object.entries(valueA.answer).forEach(([keyB, valueB]) => {
          cy.contains(valueB.label);
        });
      }
      else {
        cy.contains(valueA.answer);
      }
    });
  });
};

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

export const checkSource = source => {
  if (source === 'online' || source === 'Interne melding') {
    cy.get(SIGNAL_DETAILS.source).should('have.text', source).and('be.visible');
  }
  else {
    cy.readFile('./cypress/fixtures/tempSource.json').then(jsontemp => {
      cy.get(SIGNAL_DETAILS.source).should('have.text', jsontemp.source).and('be.visible');
    });
  }
};

export const checkSpecificInformationPage = fixturePath => {
  cy.url().should('include', '/incident/vulaan');
  cy.checkHeaderText('Dit hebben we nog van u nodig');
  cy.contains('Dit hebt u net ingevuld:').should('be.visible');
  cy.fixture(fixturePath).then(json => {
    cy.contains(json.text).should('be.visible');
  });
  cy.get('body').then($body => {
    if ($body.find(`${CREATE_SIGNAL.disclaimer}`).length > 0) {
      checkHeaderFooter();
    }
  });
};

export const checkSummaryPage = fixturePath => {
  cy.url().should('include', '/incident/samenvatting');
  cy.checkHeaderText('Controleer uw gegevens');
  cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
  cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
  cy.contains(
    'Ja, ik geef gemeente Amsterdam en gemeente Weesp toestemming om mijn contactgegevens te delen met andere organisaties, als dat nodig is om mijn melding goed op te lossen.',
  ).should('be.visible');
  cy.get('body').then($body => {
    if ($body.find(`${CREATE_SIGNAL.disclaimer}`).length > 0) {
      checkHeaderFooter();
    }
  });
  cy.fixture(fixturePath).then(json => {
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
  });
};

export const checkThanksPage = () => {
  cy.url().should('include', '/incident/bedankt');
  cy.checkHeaderText('Bedankt!');
  cy.get('body').then($body => {
    if ($body.find(`${CREATE_SIGNAL.disclaimer}`).length > 0) {
      checkHeaderFooter();
    }
  });
};

export const openCreatedSignal = () => {
  cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
    cy.get('tr td:nth-child(2)').contains(new RegExp(`^${json.signalId}$`, 'g')).click();
  });
};

export const saveSignalId = () => {
  cy.get('[data-testid="plainText"')
    .then($signalLabel => {
      // Get the signal id
      const signalNumber = $signalLabel.text().match(/\d+/)[0];
      cy.log(signalNumber);
      // Set the signal id in variable for later use
      cy.writeFile('./cypress/fixtures/tempSignalId.json', { signalId: `${signalNumber}` }, { flag: 'w' });
    });
};

export const searchAddress = address => {
  cy.get('[data-testid=autoSuggest]').type(address, { delay: 60 });
};

export const searchAndCheck = (searchTerm, selector) => {
  cy.getSignalDetailsRoutes();
  cy.get(MANAGE_SIGNALS.searchBar).type(`${searchTerm}{enter}`);
  cy.wait('@getSearchResults');
  cy.get(MANAGE_SIGNALS.searchResultsTag).should('have.text', `Zoekresultaten voor "${searchTerm}"`).and('be.visible');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.get('[href*="/manage/incident/"]').first().click();
  cy.waitForSignalDetailsRoutes();
  cy.get(selector).should('contain', `${searchTerm}`);
};

export const selectAddress = address => {
  cy.get('[data-testid=suggestList] > li ')
    .contains(new RegExp(`^${address}$`, 'g'))
    .trigger('click');
};

// Function specific for Lantaarnpaal
export const selectLampOnCoordinate = (coordinateA, coordinateB) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.get('.leaflet-container').should('be.visible').wait(500).click(coordinateA, coordinateB);
};

export const selectSource = index => {
  cy.get('[data-testid="source"] > option')
    .eq(index)
    .then(element => {
      cy.get('[data-testid="source"]').select(element.val());
      cy.writeFile('./cypress/fixtures/tempSource.json', { source: `${element.val()}` }, { flag: 'w' });
    });
};

export const setAddress = fixturePath => {
  cy.fixture(fixturePath).then(json => {
    const address = json.address.huisnummer_toevoeging ? `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}-${json.address.huisnummer_toevoeging}, ${json.address.postcode} ${json.address.woonplaats}` : `${json.address.openbare_ruimte} ${json.address.huisnummer}${json.address.huisletter}, ${json.address.postcode} ${json.address.woonplaats}`;
    searchAddress(`${json.address.postcode} ${json.address.huisnummer}`);
    cy.wait('@getAddress');
    selectAddress(address);
  });
};

export const setDateTime = dateTime => {
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
        .then(element => {
          cy.get('[data-testid=day]').select(element.val());
          cy.writeFile('./cypress/fixtures/tempDateTime.json', { dateTime: `${Cypress.$(element).text()}` }, { flag: 'w' });
        });
      break;
    default:
      cy.log('Unknown datetime, default is chosen');
  }
};

export const setDescription = description => {
  Cypress.env('description', description);
  cy.get('textarea').clear().invoke('val', description).trigger('input');
};

export const setDescriptionPage = fixturePath => {
  cy.fixture(fixturePath).then(json => {
    cy.stubCategoryPrediction(json.fixtures.prediction);
    checkDescriptionPage();
    setAddress(fixturePath);
    setDescription(json.text);
    setDateTime(json.time);
    uploadAllFiles(fixturePath);
    if (json.source !== 'online' && json.source !== 'Interne melding') {
      selectSource(1);
      cy.contains(json.priority).should('be.visible').click();
      cy.contains(json.type).should('be.visible').click();
    }
  });
};

export const setEmailAddress = fixturePath => {
  cy.url().should('include', '/incident/email');
  cy.checkHeaderText('Wilt u op de hoogte blijven?');
  cy.fixture(fixturePath).then(json => {
    if (json.reporter.email) {
      cy.get(CREATE_SIGNAL.inputEmail).clear().type(json.reporter.email);
    }
  });
};

export const setPhonenumber = fixturePath => {
  cy.url().should('include', '/incident/telefoon');
  cy.checkHeaderText('Mogen we u bellen voor vragen?');
  cy.fixture(fixturePath).then(json => {
    if (json.reporter.phone) {
      cy.get(CREATE_SIGNAL.inputPhoneNumber).clear().type(json.reporter.phone);
    }
  });
};

export const uploadAllFiles = fixturePath => {
  cy.fixture(fixturePath).then(json => {
    if (json.fixtures.attachments) {
      // Check for every itemlist all key-value pairs
      const amountAttachments = Object.keys(json.fixtures.attachments).length;
      let attachmentNumber = 0;
      for (attachmentNumber = 0; attachmentNumber < amountAttachments; attachmentNumber += 1) {
        uploadFile(fixturePath, attachmentNumber);
      }
    }
  });
};

export const uploadFile = (fixturePath, itemNumber) => {
  cy.fixture(fixturePath).then(json => {
    cy.get(CREATE_SIGNAL.buttonUploadFile).then(subject => {
      // eslint-disable-next-line promise/no-nesting
      cy.fixture(json.fixtures.attachments[itemNumber], 'base64').then(file => {
        const blob = Cypress.Blob.base64StringToBlob(file, 'image/png');
        const el = subject[0];
        const testFile = new File([blob], json.fixtures.attachments[itemNumber], { type: 'image/png' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;
      });
    });
    cy.get(CREATE_SIGNAL.buttonUploadFile).trigger('change', { force: true });
  });
};
