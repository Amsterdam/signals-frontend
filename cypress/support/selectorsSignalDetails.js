// General selectors for signal details
export const CHANGE_CATEGORY = {
  inputCategory: '[data-testid=input]',
};

export const CHANGE_LOCATION = {
  buttonCancelEditLocation: '[data-testid=cancelBtn]',
  buttonEditLocation: '[class*=Location__Description] > [data-testid=editButton]',
  buttonSubmitEditLocation: '[data-testid=submitBtn]',
};

export const CHANGE_STATUS = {
  buttonCancelEditStatus: '[data-testid=statusFormCancelButton]',
  buttonCloseEditStatus: '[class*="incident-detail__preview-close"]',
  buttonEditStatus: '[class*="MetaList__EditButton"]',
  buttonSubmitStatus: '[data-testid=statusFormSubmitButton]',
  currentStatus: '#currentStatus',
  inputToelichting: '[data-testid=text]',
  radioButtonGemeld: '[data-testid=status-m]',
  radioButtonInAfwachting: '[data-testid=status-i]',
  radioButtonIngepland: '[data-testid=status-ingepland]',
  radioButtonInBehandeling: '[data-testid=status-b]',
  radioButtonExtern: '[data-testid="status-closure requested"]',
  radioButtonAfgehandeld: '[data-testid=status-o]',
  radioButtonHeropend: '[data-testid=status-reopened]',
  radioButtonGeannuleerd: '[data-testid=status-a]',
};

export const CHANGE_TYPE = {
  radioButtonMelding: '[data-testid=input-SIG]',
  radioButtonAanvraag: '[data-testid=input-REQ]',
  radioButtonVraag: '[data-testid=input-QUE]',
  radioButtonKlacht: '[data-testid=input-COM]',
  radioButtonGrootOnderhoud: '[data-testid=input-MAI]',
};

export const CHANGE_URGENCY = {
  radioButtonHoog: '[data-testid=input-high]',
  radioButtonLaag: '[data-testid=input-low]',
  radioButtonNormaal: '[data-testid=input-normal]',
};

export const SIGNAL_DETAILS = {
  addressCity: '[data-testid="location-value-address-city"]',
  addressStreet: '[data-testid="location-value-address-street"]',
  buttonCancel: '[data-testid=cancelButton]',
  buttonEdit: '[data-testid="editButton"]',
  buttonSubmit: '[data-testid=submitButton]',
  creationDate: '[data-testid=meta-list-date-value]',
  email: '[data-testid="detail-email-value"]',
  historyAction: '[class*="History__Action"]',
  historyListItem: '[data-testid="history-list-item-description"]',
  infoText: '[data-testid=infoText]',
  mainCategory: '[data-testid="meta-list-main-category-value"]',
  phoneNumber: '[data-testid="detail-phone-value"]',
  source: '[data-testid="meta-list-source-value"]',
  stadsdeel: '[data-testid="location-value-address-stadsdeel"]',
  status: '[data-testid="meta-list-status-value"]',
  subCategory: '[data-testid="valuePath"]',
  type: '[data-testid="valuePath"]',
  urgency: '[data-testid="valuePath"]',
};