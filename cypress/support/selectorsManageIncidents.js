// Selectors for Manage Signals page
export const MANAGE_SIGNALS = {
  buttonMijnFilters: '[data-testid=myFiltersModalBtn]',
  buttonCloseMijnFilters: '[data-testid=closeBtn]',
  buttonFilteren: '[data-testid=filterModalBtn]',
  clearSearchTerm: '[aria-label="Close"]',
  firstSignalAdres: 'tbody > :nth-child(1) > :nth-child(8) > a',
  firstSignalDag: 'tbody > :nth-child(1) > :nth-child(2) > a',
  firstSignalDatumTijd: 'tbody > :nth-child(1) > :nth-child(3) > a',
  firstSignalId: 'tbody > :nth-child(1) > :nth-child(1) > a',
  firstSignalStadsdeelName: 'tbody > :nth-child(1) > :nth-child(4) > a',
  firstSignalStatus: 'tbody > :nth-child(1) > :nth-child(6) > a',
  firstSignalSubcategorie: 'tbody > :nth-child(1) > :nth-child(5) > a',
  firstSignalUrgentie: 'tbody > :nth-child(1) > :nth-child(7) > a',
  filterTagList: '[data-testid=filterTagListTag]',
  linkSignal: '[href*="/manage/incident/"]',
  paginationPages: '[data-testid="pagination"] > ul > li',
  refreshIcon: '[class*=PageHeader__RefreshIcon]',
  searchBar: '[data-testid="searchBar"]',
  searchResultsTag: '[class*=PageHeader__SubTitle]',
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
  inputSearchInNote: '#filter_notes',
};

// Selectors on filter page for selection of all elements per category
export const FILTER_ALL_ITEMS = {
  selectAllStatus: '[data-testid=statusCheckboxGroup] > [data-testid=checkboxList] > [class*=CheckboxList__Toggle]',
  selectAllStadsdelen:
    '[data-testid=stadsdeelCheckboxGroup] > [data-testid=checkboxList] > [class*=CheckboxList__Toggle]',
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
  selectAllDisturbancePersonsGroups:
    '[class*=CheckboxList__Toggle] > [data-id*=overlast-van-en-door-personen-of-groepen]',
  selectAllClean: '[class*=CheckboxList__Toggle] > [data-id*=schoon]',
  selectAllRoadsTraffic: '[class*=CheckboxList__Toggle] > [data-id*=wegen-verkeer-straatmeubilair]',
  selectAllLiving: '[class*=CheckboxList__Toggle] > [data-id*=wonen]',
};

// Selectors for Mijn Filters page
export const MY_FILTERS = {
  buttonDeleteFilter: '[data-testid=handleRemoveFilterButton]',
};

// Selectors for signals overview map
export const OVERVIEW_MAP = {
  autoSuggest: '[data-testid=autoSuggest]',
  buttonBack: '[data-testid=backlink]',
  buttonZoomOut: '[title="Uitzoomen"]',
  buttonZoomIn: '[title="Inzoomen"]',
  detailPane: '[data-testid=mapDetailPanel]',
  openSignalDetails: '[data-testid=mapDetailPanel] > [href*="/manage"]',
  markerCluster: '.leaflet-marker-icon',
  markerSignal: '.map-marker-incident',
  overViewMap: '[data-testid=map-base]',
};
