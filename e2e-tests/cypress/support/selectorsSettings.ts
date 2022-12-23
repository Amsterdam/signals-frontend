// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
export const CATEGORIES = {
  buttonAnnuleer: '[data-testid="cancel-btn"]',
  buttonOpslaan: '[data-testid=submit-btn]',
  categoryValue: '[data-testid=data-view-body] > [data-testid=data-view-body-row] > [data-testid="data-view-body-row-value"]',
  dropdownTypeOfDays: '#use_calendar_days',
  historyAction: '[data-testid="history-list-item-action"]',
  inputDays: '#n_days',
  inputDescription: '#description',
  inputMessage: '#handling_message',
  inputNote: '#note',
  inputName: '#name',
  notification: '[data-testid="notification"]',
  radioButtonNietActief: '[data-testid="is_active-false"]',
  verantwoordelijkeAfdeling: '[data-testid=responsible_departments]',
};

export const DEPARTMENTS = {
  buttonAnnuleer: '[data-testid="cancel-btn"]',
  buttonOpslaan: '[data-testid="submit-btn"]',
  categoryLists: '[data-testid="category-lists"]',
  checkboxAsbestAccu: '[data-testid*="asbest-accu"]',
  checkboxDrankDrugsOverlast: '[data-testid*="drank-en-drugsoverlast"]',
  checkboxWildplassenPoepen: '[data-testid*="wildplassen-poepen-overgeven"]',
  departmentDetail: '[data-testid="department-detail"]',
  linkBack: '[data-testid="backlink"]',
  notification: '[data-testid="notification"]',
};

export const MENU = {
  buttonMenu: '[aria-label="Menu"]',
};

export const ROLES = {
  backlink: '[data-testid="backlink"]',
  buttonAnnuleren: '[data-testid="cancel-btn"]',
  buttonOpslaan: '[data-testid="submit-btn"]',
  buttonToevoegen: 'a:contains("Rol toevoegen")',
  inputNaam: '[data-testid="roles-form-field-name"]',
  listRoles: '[data-testid="roles-list"]',
  notification: '[data-testid="notification"]',
}
export const STANDAARDTEKSTEN = {
  buttonCloseNotification: '[data-testid=notification-close]',
  buttonGebruikDezeTekst: '[data-testid="default-texts-item-button"]',
  buttonFirstTextOneDown: '[data-testid=default-text-form-item-button0Down]',
  buttonSecondTextup: '[data-testid="default-textform-item-button1Up"]',
  buttonOpslaan: '[data-testid=default-text-form-submit-button]',
  defaultTextItemText: '[data-testid="default-texts-item-text"]',
  defaultTextTitle: '[data-testid="default-texts-title"]',
  defaultTextItemTitle: '[data-testid="default-texts-item-title"]',
  dropDownSubcategory: '[data-testid=category_url]',
  inputTitle01: '[data-testid=title0]',
  inputText01: '[data-testid=text0]',
  inputTitle02: '[data-testid=title1]',
  inputText02: '[data-testid=text1]',
  notification: '[data-testid=notification]',
  radioButtonAfgehandeld: '[data-testid=state-o]',
  radioButtonHeropend: '[data-testid=state-reopened]',
  radioButtonIngepland: '[data-testid=state-ingepland]',
  textAlert: "Er is een gereserveerd teken ('{{' of '__') in de toelichting gevonden.\nMogelijk staan er nog een of meerdere interne aanwijzingen in deze tekst. Pas de tekst aan.",
  textDescriptionAfhandelen01: 'Beschrijving standaardtekst 1 melding duiven AFHANDELEN. De overlastgevende duif is geïdentificeerd als {{naam duif}}',
  textDescriptionAfhandelen02: 'Beschrijving standaardtekst 2 melding duiven AFHANDELEN. De overlastgevende duif is geïdentificeerd als {{naam duif}}',
  textDescriptionHeropenen: 'Beschrijving standaardtekst 1 melding duiven HEROPENEN. De overlastgevende duif is geïdentificeerd als {{naam duif}}',
  textDescriptionInplannen: 'Beschrijving standaardtekst 1 melding duiven INPLANNEN. De overlastgevende duif is geïdentificeerd als {{naam duif}}',
  textTitleAfhandelen01: 'Titel 1 standaardtekst melding duiven AFHANDELEN',
  textTitleAfhandelen02: 'Titel 2 standaardtekst melding duiven AFHANDELEN',
  textTitleHeropenen: 'Titel standaardtekst melding duiven HEROPENEN',
  textTitleInplannen: 'Titel standaardtekst melding duiven INPLANNEN',

};

export const USERS = {
  buttonAnnuleer: '[data-testid="cancel-btn"]',
  buttonOpslaan: '[data-testid="submit-btn"]',
  historyAction: '[data-testid="history-list-item-action"]',
  inputAchternaam: '#last_name',
  inputMail: '#username',
  inputVoornaam: '#first_name',
  inputNotitie: '#note',
  userRow: '[data-testid="data-view-body-row"]',
};
