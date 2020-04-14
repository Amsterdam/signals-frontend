// Selectors for Manage Signals page
export const MANAGE_SIGNALS = {
  buttonMijnFilters: '[data-testid=myFiltersModalBtn]',
  buttonCloseMijnFilters: '[data-testid=closeBtn]',
  buttonFilteren: '[data-testid=filterModalBtn]',
  firstSignalStadsdeelName: ':nth-child(1) > :nth-child(4) > a',
  filterTagList: '[data-testid=filterTagListTag]',
  paginationPages: '[data-testid="pagination"] > ul',
  refreshIcon: '[class*=PageHeader__RefreshIcon]',
  stadsdeelFromSignal: 'tr td:nth-child(4)',
};

// Selectors for Filteren page
export const FILTER = {
  buttonSubmitFilter: '[data-testid=submitBtn]',
  buttonNieuwFilter: '[data-testid=resetBtn]',
  buttonCancel: '[data-testid=cancelBtn]',
  checkboxRefresh: '#filter_refresh',
  checkboxGemeld: '#status_m',
  inputFilterName: '#filter_name',
};

// Selectors on filter page for selection of all elements per category
export const FILTER_ALL_ITEMS = {
  selectAllStatus: '[data-testid=statusCheckboxGroup] > [data-testid=checkboxList] > [class*=CheckboxList__Toggle]',
  selectAllStadsdelen: '[data-testid=stadsdeelCheckboxGroup] > [data-testid=checkboxList] > [class*=CheckboxList__Toggle]',
  selectAllSource: '[data-testid=sourceCheckboxGroup] > [data-testid=checkboxList] > [class*=CheckboxList__Toggle]',
  selectAllGarbage: '[class*=CheckboxList__Toggle] > [data-id*=afval]',
  selectAllCivilConstructs: '[class*=CheckboxList__Toggle] > [data-id*=civiele-constructies]',
  selectAllSubversion: '[class*=CheckboxList__Toggle] > [data-id*=ondermijning]',
  selectAllPublicParksWater: '[class*=CheckboxList__Toggle] > [data-id*=openbaar-groen-en-water]',
  selectAllOther: '[class*=CheckboxList__Toggle] > [data-id*=overig]',
  selectAllDisturbanceCompanies: '[class*=CheckboxList__Toggle] > [data-id*=overlast-bedrijven-en-horeca]',
  selectAllDisturbancePublicSpace: '[class*=CheckboxList__Toggle] > [data-id*=overlast-in-de-openbare-ruimte]',
  selectAllDisturbanceWater: '[class*=CheckboxList__Toggle] > [data-id*=overlast-op-het-water]',
  selectAllDisturbanceAnimals: '[class*=CheckboxList__Toggle] > [data-id*=overlast-van-dieren]',
  selectAllDisturbancePersonsGroups: '[class*=CheckboxList__Toggle] > [data-id*=overlast-van-en-door-personen-of-groepen]',
  selectAllClean: '[class*=CheckboxList__Toggle] > [data-id*=schoon]',
  selectAllRoadsTraffic: '[class*=CheckboxList__Toggle] > [data-id*=wegen-verkeer-straatmeubilair]',
  selectAllLiving: '[class*=CheckboxList__Toggle] > [data-id*=wonen]',
};

// Selectors for Mijn Filters page
export const MY_FILTERS = {
  buttonDeleteFilter: '[data-testid=handleRemoveFilterButton]',
};

// Selectors for Categories
export const CATEGORIES = {
  buttonOpslaan: '[data-testid=submitBtn]',
  dropdownTypeOfDays: '#use_calendar_days',
  inputDays: '#n_days',
  inputMessage: '#handling_message',
};