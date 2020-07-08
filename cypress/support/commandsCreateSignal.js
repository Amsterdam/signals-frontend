import { CREATE_SIGNAL } from './selectorsCreateSignal';
import { SIGNAL_DETAILS } from './selectorsSignalDetails';
import { MANAGE_SIGNALS } from './selectorsManageIncidents';

export const addNote = noteText => {
  cy.get(SIGNAL_DETAILS.buttonAddNote).click();
  cy.get(SIGNAL_DETAILS.inputNoteText).type(noteText);
  cy.get(SIGNAL_DETAILS.buttonSaveNote).click();
};

// General functions for creating a signal
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
};

export const checkRedTextStatus = status => {
  cy.get(SIGNAL_DETAILS.status)
    .should('have.text', status)
    .and('be.visible')
    .and($labels => {
      expect($labels).to.have.css('color', 'rgb(236, 0, 0)');
    });
};

export const checkSignalDetailsPage = () => {
  cy.url().should('include', `/manage/incident/${Cypress.env('signalId')}`);
  cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
  cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
  cy.get(SIGNAL_DETAILS.labelEmail).should('have.text', 'E-mail melder').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelLocatie).should('have.text', 'Locatie').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelOverlast).should('have.text', 'Overlast').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelTelefoon).should('have.text', 'Telefoon melder').and('be.visible');
  cy.get(SIGNAL_DETAILS.labelToestemming).should('have.text', 'Toestemming contactgegevens delen').and('be.visible');
};

export const checkSpecificInformationPage = () => {
  cy.url().should('include', '/incident/vulaan');
  cy.checkHeaderText('Dit hebben we nog van u nodig');
  cy.contains('Dit hebt u net ingevuld:').should('be.visible');
};

export const checkSummaryPage = () => {
  cy.url().should('include', '/incident/samenvatting');
  cy.checkHeaderText('Controleer uw gegevens');
  cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
  cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
  cy.contains(
    'Ja, ik geef de gemeente Amsterdam toestemming om mijn contactgegevens te delen met andere organisaties, als dat nodig is om mijn melding goed op te lossen.'
  ).should('be.visible');
};

export const checkThanksPage = () => {
  cy.url().should('include', '/incident/bedankt');
  cy.checkHeaderText('Bedankt!');
};

export const getSignalId = () => {
  cy.get('.bedankt')
    .first()
    .then($signalLabel => {
      // Get the signal id
      const signalNumber = $signalLabel.text().match(/\d+/)[0];
      cy.log(signalNumber);
      // Set the signal id in variable for later use
      Cypress.env('signalId', signalNumber);
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

export const setAddress = (searchAdress, selectAdress) => {
  Cypress.env('address', selectAdress);
  searchAddress(searchAdress);
  cy.wait('@getAddress');
  selectAddress(selectAdress);
  cy.wait('@geoSearchLocation');
};

export const setDateTime = dateTime => {
  if (dateTime === 'Nu') {
    cy.get(CREATE_SIGNAL.radioButtonTijdstipNu).click();
  } else {
    cy.get(CREATE_SIGNAL.radioButtonTijdstipEerder).click();
    cy.get(CREATE_SIGNAL.dropdownDag).select('Vandaag');
    cy.get(CREATE_SIGNAL.dropdownUur).select('5');
    cy.get(CREATE_SIGNAL.dropdownMinuten).select('45');
  }
};

export const setDescription = description => {
  Cypress.env('description', description);
  cy.get('textarea').clear().invoke('val', description).trigger('input');
};

export const setEmailAddress = emailAddress => {
  Cypress.env('emailAddress', emailAddress);
  cy.url().should('include', '/incident/email');
  cy.checkHeaderText('Wilt u op de hoogte blijven?');
  if (emailAddress) {
    cy.get(CREATE_SIGNAL.inputEmail).clear().type(emailAddress);
  }
};

export const setPhonenumber = phoneNumber => {
  Cypress.env('phoneNumber', phoneNumber);
  cy.url().should('include', '/incident/telefoon');
  cy.checkHeaderText('Mogen we u bellen voor vragen?');
  if (phoneNumber) {
    cy.get(CREATE_SIGNAL.inputPhoneNumber).clear().type(phoneNumber);
  }
};

export const uploadFile = (fileName, fileType = '', selector) => {
  cy.get(selector).then(subject => {
    cy.fixture(fileName, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob => {
        const el = subject[0];
        const testFile = new File([blob], fileName, { type: fileType });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;
      });
  });
  cy.get(CREATE_SIGNAL.buttonUploadFile).trigger('change', { force: true });
};

// Functions specific for Lantaarnpaal
export const selectLampOnCoordinate = (coordinateA, coordinateB) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.get('.leaflet-container').should('be.visible').wait(500).click(coordinateA, coordinateB);
};
