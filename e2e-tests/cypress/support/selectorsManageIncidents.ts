// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam

export const DASHBOARD = {
  bar: '[data-testid=bar]',
  barSignalcount: '[data-testid=value]',
  barSubcategory: '[data-testid=description]',
  checkmarkIcon: '[data-testid=checkmark]',
  graphDescription: '[data-testid=graph-description]',
  graphTitle: '[data-testid=graph-title]',
  graphTotalSignals: '[data-testid=total-open]',
  emptyText: '[data-testid=empty-text]',
  heading: '[data-testid=heading]',
  noSignalsText: '[data-testid=empty-text]',
};

export const FILTER = {
  buttonSubmitFilter: '[data-testid=submit-btn]',
  buttonNieuwFilter: '[data-testid=reset-btn]',
  buttonCancel: '[data-testid=cancel-btn]',
  checkboxASC: '[data-testid="checkbox-directing_department_ASC"]',
  checkboxBronInterswitch: '[data-testid="checkbox-source_Telefoon – Interswitch"]',
  checkboxDeelmelding: '[data-testid="checkbox-kind_child_signal"]',
  checkboxGemeld: '#status_m',
  checkboxHoofdmelding: '[data-testid="checkbox-kind_parent_signal"]',
  checkboxHoofdmeldingWijzigingDeelmelding: '[data-testid="checkbox-has_changed_children_true"]',
  checkboxHoofdmeldingGeenWijzigingDeelmelding: '[data-testid="checkbox-has_changed_children_false"]',
  checkboxMelding: '[data-testid="checkbox-kind_signal"]',
  checkboxRefresh: '#filter_refresh',
  checkboxTypeKlacht: '[data-testid="checkbox-type_COM"]',
  checkboxUrgentieHoog: '[data-testid="checkbox-priority_high"]',
  checkboxVerantwoordelijkeAfdeling: '[data-testid="checkbox-directing_department_null"]',
  inputFilterAddres: '[data-testid="filter-address"]',
  inputFilterDayBefore: '#filter_created_before',
  inputFilterDayFrom: '#filter_created_after',
  inputFilterName: '#filter_name',
  inputSearchInNote: '#filter_notes',
};

export const FILTER_ALL_ITEMS = {
  selectAllStatus: '[data-testid=status-checkbox-group] > [data-testid=checkbox-list] > [class*=CheckboxList__Toggle]',
  selectAllStadsdelen:
    '[data-testid=stadsdeel-checkbox-group] > [data-testid=checkbox-list] > [class*=CheckboxList__Toggle]',
  selectAllSource: '[data-testid=source-checkbox-group] > [data-testid=checkbox-list] > [class*=CheckboxList__Toggle]',
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

export const MANAGE_SIGNALS = {
  buttonMijnFilters: '[data-testid=my-filters-modal-btn]',
  buttonCloseMijnFilters: '[data-testid=close-btn]',
  buttonFilter: '[data-testid=filter-modal-btn]',
  clearSearchTerm: '[aria-label="Close"]',
  signalAdres: '[data-testid="incident-address"]',
  signalDag: '[data-testid="incident-days-open"]',
  signalDatumTijd: '[data-testid=incident-created-at]',
  signalParentIcon: '[data-testid=parent-icon]',
  signalId: '[data-testid=incident-id]',
  signalStadsdeelName: '[data-testid=incident-area]',
  signalStatus: '[data-testid=incident-status]',
  signalSubcategorie: '[data-testid=incident-subcategory]',
  signalUrgentie: '[data-testid=incident-urgency]',
  filterTagList: '[data-testid=filter-tag-list-tag]',
  labelHoofmelding: '[aria-label="Hoofdmelding"]',
  paginationPages: '[data-testid="pagination"] > ul > li',
  refreshIcon: '[data-testid=refresh-icon]',
  searchBar: '[data-testid="search-bar"]',
  searchResultsTag: '[class*=PageHeader__SubTitle]',
  spinner: '[data-testid="loading-indicator"]',
  stadsdeelFromSignal: 'tr td:nth-child(4)',
};

export const MY_FILTERS = {
  buttonDeleteFilter: '[data-testid=handle-remove-filter-button]',
};

export const OVERVIEW_MAP = {
  autoSuggest: '[data-testid=auto-suggest]',
  buttonBack: '[data-testid=backlink]',
  buttonZoomOut: '[title="Uitzoomen"]',
  buttonZoomIn: '[title="Inzoomen"]',
  clusterIcon: '[data-testid=marker-cluster-icon]',
  detailPane: '[data-testid=map-detail-panel]',
  markerCluster: '.leaflet-marker-icon',
  markerSignal: '.map-marker-incident',
  overViewMap: '[data-testid="overview-map"]',
  signalDetails: '[data-testid=map-detail-panel]',
};
