// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
export const CATEGORIES = {
  buttonAnnuleren: '[data-testid="cancelBtn"]',
  buttonOpslaan: '[data-testid=submitBtn]',
  categoryValue: '[data-testid=dataViewBody] > [data-testid=dataViewBodyRow] > [data-testid="dataViewBodyRowValue"]',
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
  buttonAnnuleren: '[data-testid="cancelBtn"]',
  buttonOpslaan: '[data-testid="submitBtn"]',
  categoryLists: '[data-testid="categoryLists"]',
  checkboxAsbestAccu: '[data-testid*="asbest-accu"]',
  checkboxDrankDrugsOverlast: '[data-testid*="drank-en-drugsoverlast"]',
  checkboxWildplassenPoepen: '[data-testid*="wildplassen-poepen-overgeven"]',
  departmentDetail: '[data-testid="departmentDetail"]',
  linkBack: '[data-testid="backlink"]',
  notification: '[data-testid="notification"]',
};

export const MENU = {
  buttonMenu: '[aria-label="Menu"]',
};

export const ROLES = {
  backlink: '[data-testid="backlink"]',
  buttonAnnuleren: '[data-testid="cancelBtn"]',
  buttonOpslaan: '[data-testid="submitBtn"]',
  buttonToevoegen: 'a:contains("Rol toevoegen")',
  inputNaam: '[data-testid="rolesFormFieldName"]',
  listRoles: '[data-testid="rolesList"]',
  notification: '[data-testid="notification"]',
}
export const STANDAARDTEKSTEN = {
  buttonCloseNotification: '[data-testid=notificationClose]',
  buttonGebruikDezeTekst: '[data-testid="defaultTextsItemButton"]',
  buttonFirstTextOneDown: '[data-testid=defaultTextFormItemButton0Down]',
  buttonSecondTextup: '[data-testid="defaultTextFormItemButton1Up"]',
  buttonOpslaan: '[data-testid=defaultTextFormSubmitButton]',
  defaultTextItemText: '[data-testid="defaultTextsItemText"]',
  defaultTextTitle: '[data-testid="defaultTextsTitle"]',
  defaultTextItemTitle: '[data-testid="defaultTextsItemTitle"]',
  dropDownSubcategory: '[data-testid=category_url]',
  inputTitle01: '[data-testid=title0]',
  inputText01: '[data-testid=text0]',
  inputTitle02: '[data-testid=title1]',
  inputText02: '[data-testid=text1]',
  notification: '[data-testid=notification]',
  radioButtonAfgehandeld: '[data-testid=state-o]',
  radioButtonHeropend: '[data-testid=state-reopened]',
  radioButtonIngepland: '[data-testid=state-ingepland]',
  textAlert: "Er is een gereserveerd teken ('{{' of '}}') in de toelichting gevonden.\nMogelijk staan er nog een of meerdere interne aanwijzingen in deze tekst. Pas de tekst aan.",
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
  buttonAnnuleren: '[data-testid="cancelBtn"]',
  buttonOpslaan: '[data-testid="submitBtn"]',
  historyAction: '[data-testid="history-list-item-action"]',
  inputAchternaam: '#last_name',
  inputMail: '#username',
  inputVoornaam: '#first_name',
  inputNotitie: '#note',
  userRow: '[data-testid="dataViewBodyRow"]',
};
