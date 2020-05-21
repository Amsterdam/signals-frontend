import { CREATE_SIGNAL } from "./selectorsCreateSignal";
import { SIGNAL_DETAILS } from './selectorsSignalDetails';

// General functions for creating a signal
export const checkCreationDate = () => {
  const todaysDate = Cypress.moment().format('DD-MM-YYYY');
  cy.get(SIGNAL_DETAILS.creationDate).should('contain', todaysDate);
};

export const checkDescriptionPage = () => {
  cy.checkHeaderText('Beschrijf uw melding');
  cy.contains('Waar is het?').should('be.visible');
  cy.contains('Typ het dichtstbijzijnde adres of klik de locatie aan op de kaart').should('be.visible');
  cy.contains('Waar gaat het om?').should('be.visible');
  cy.contains('Typ geen persoonsgegevens in deze omschrijving, dit wordt apart gevraagd').should('be.visible');
  cy.contains('Geef het tijdstip aan').should('be.visible');
  cy.contains("Foto's toevoegen").should('be.visible');
  cy.contains('Voeg een foto toe om de situatie te verduidelijken').should('be.visible');
};

export const checkSpecificInformationPage = () => {
  cy.url().should('include', '/incident/vulaan');
  cy.checkHeaderText('Dit hebben we nog van u nodig');
  cy.contains('Dit hebt u net ingevuld:').should('be.visible');
};

export const checkSummaryPage = () => {
  cy.url().should('include', '/incident/samenvatting');
  cy.checkHeaderText('Controleer uw gegevens');
  // Check if map and marker are visible
  cy.get(CREATE_SIGNAL.mapStaticImage).should('be.visible');
  cy.get(CREATE_SIGNAL.mapStaticMarker).should('be.visible');
};

export const checkThanksPage = () => {
  cy.url().should('include', '/incident/bedankt');
  cy.checkHeaderText('Bedankt!');
};

export const getSignalId = () => {
  cy.get('.bedankt').first().then($signalLabel => {
    // Get the signal id
    const signalNumber = $signalLabel.text().match(/\d+/)[0];
    cy.log(signalNumber);
    // Set the signal id in variable for later use
    Cypress.env('signalId', signalNumber);
  });
};

export const searchAddress = address => {
  cy.get('[data-testid=autoSuggest]')
    .type(address, { delay: 60 });
};

export const selectAddress = address => {
  cy.get('[data-testid=suggestList] ')
    .should('be.visible')
    .and('contain.text', address)
    .trigger('click');
};

export const setAddress = (searchAdress, selectAdress) => {
  searchAddress(searchAdress);
  cy.wait('@getAddress');
  selectAddress(selectAdress);
  cy.wait('@geoSearchLocation');
};

export const setDescription = description => {
  cy.get('textarea')
    .clear()
    .invoke('val', description)
    .trigger('input');
};

export const setEmailAddress = emailAddress => {
  cy.url().should('include', '/incident/email');
  cy.checkHeaderText('Wilt u op de hoogte blijven?');
  if (emailAddress){
    cy.get(CREATE_SIGNAL.inputEmail).clear().type(emailAddress);
  }
};

export const setPhonenumber = phoneNumber => {
  cy.url().should('include', '/incident/telefoon');
  cy.checkHeaderText('Mogen we u bellen voor vragen?');
  if (phoneNumber){
    cy.get(CREATE_SIGNAL.inputPhoneNumber).clear().type(phoneNumber);
  } 
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

// Functions specific for Lantaarnpaal
export const selectLampOnCoordinate = (coordinateA, coordinateB) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.get('.leaflet-container').should('be.visible').wait(500).click(coordinateA, coordinateB);
};