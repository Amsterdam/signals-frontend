// General selectors for signal details
export const CHANGE_CATEGORY = {
  buttonCancel: '[data-testid=cancelSubcategoryButton]',
  buttonEdit: '[data-testid=editSubcategoryButton]',
  buttonSubmit: '[data-testid=submitSubcategoryButton]',
  inputCategory: '[data-testid=input]',
};

export const CHANGE_LOCATION = {
  buttonCancel: '[data-testid=cancelBtn]',
  buttonEdit: '[data-testid="editLocationButton"]',
  buttonLocationDetailEdit: '[data-testid=location-preview-button-edit]',
  buttonSubmit: '[data-testid=submitBtn]',
};

export const CHANGE_STATUS = {
  buttonCancel: '[data-testid=statusFormCancelButton]',
  buttonEdit: '[data-testid=editStatusButton]',
  buttonSubmit: '[data-testid=statusFormSubmitButton]',
  currentStatus: '[data-testid="currentStatus"]',
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
  buttonCancel: '[data-testid=cancelTypeButton]',
  buttonEdit: '[data-testid=editTypeButton]',
  buttonSubmit: '[data-testid=submitTypeButton]',
  radioButtonMelding: '[data-testid=input-SIG]',
  radioButtonAanvraag: '[data-testid=input-REQ]',
  radioButtonVraag: '[data-testid=input-QUE]',
  radioButtonKlacht: '[data-testid=input-COM]',
  radioButtonGrootOnderhoud: '[data-testid=input-MAI]',
};

export const CHANGE_URGENCY = {
  buttonCancel: '[data-testid=cancelPriorityButton]',
  buttonEdit: '[data-testid=editPriorityButton]',
  buttonSubmit: '[data-testid=submitPriorityButton]',
  radioButtonHoog: '[data-testid=input-high]',
  radioButtonLaag: '[data-testid=input-low]',
  radioButtonNormaal: '[data-testid=input-normal]',
};

export const SIGNAL_DETAILS = {
  addressCity: '[data-testid="location-value-address-city"]',
  addressStreet: '[data-testid="location-value-address-street"]',
  buttonAddNote: '[data-testid=addNoteNewNoteButton]',
  buttonCancel: '[data-testid=cancelButton]',
  buttonCancelNote: '[data-testid=addNoteCancelNoteButton]',
  buttonCloseImageViewer: '[data-testid=closeButton]',
  buttonEdit: '[data-testid="editButton"]',
  buttonSaveNote: '[data-testid=addNoteSaveNoteButton]',
  buttonSubmit: '[data-testid=submitButton]',
  creationDate: '[data-testid=meta-list-date-value]',
  descriptionText: '[data-testid="detail-title"]',
  email: '[data-testid="detail-email-value"]',
  historyAction: '[class*="History__Action"]',
  historyListItem: '[data-testid="history-list-item-description"]',
  imageLocation: '[data-testid=mapStaticImage]',
  infoText: '[data-testid=infoText]',
  inputNoteText: '[data-testid=addNoteText]',
  labelEmail: '[data-testid=detail-email-definition]',
  labelLocatie: '[data-testid=detail-location]',
  labelOverlast: '[class*=Detail__DefinitionList] > :nth-child(1)',
  labelTelefoon: '[data-testid=detail-phone-definition]',
  labelToestemming: '[data-testid=detail-sharing-definition]',
  linkTerugNaarOverzicht: '[data-testid=backlink]',
  mainCategory: '[data-testid="meta-list-main-category-value"]',
  phoneNumber: '[data-testid="detail-phone-value"]',
  photo: '[data-testid="attachmentsValueButton"]',
  photoViewerImage: '[data-testid="attachment-viewer-image"]',
  shareContactDetails: '[data-testid="detail-sharing-value"]',
  signalId: '[data-testid=detail-header-title] > span',
  source: '[data-testid="meta-list-source-value"]',
  stadsdeel: '[data-testid="location-value-address-stadsdeel"]',
  status: '[data-testid="meta-list-status-value"]',
  subCategory: '[data-testid="meta-list-subcategory-value"]',
  type: '[data-testid="meta-list-type-value"]',
  urgency: '[data-testid="meta-list-priority-value"]',
};
