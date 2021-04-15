// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
/**
 * Custom command to define the routes for manage departments functionality.
 * @example cy.defineDepartmentRoutes();
*/
export const defineDepartmentRoutes = () => {
  cy.intercept(/departments\/\d+/).as('getDepartment');
  cy.intercept('PATCH', '**/private/departments/*').as('patchDepartment');
};

/**
 * Custom command to define routes for 24 hour map functionality.
 * @example cy.defineMapRoutes();
*/
export const defineMapRoutes = () => {
  cy.intercept('**/geography?*').as('getGeography');
  cy.intercept('**?page=1&ordering=-created_at&page_size=50').as('getSignals');
  cy.intercept('**/me/filters/').as('getFilters');
  cy.intercept('**/categories/*').as('getCategories');
};

/**
 * Custom command to define routes for notes functionality.
 * @example cy.defineNoteRoutes();
*/
export const defineNoteRoutes = () => {
  cy.intercept('PATCH', '**/private/signals/*').as('patchNote');
  cy.intercept('**/private/signals/?page=*').as('getSignal');
  cy.intercept('**/history').as('getHistory');
};

/**
 * Custom command to define routes for manage standaardteksten functionality.
 * @example cy.defineStandaardtekstenRoutes();
*/
export const defineStandaardtekstenRoutes = () => {
  cy.intercept('**/civiele-constructies/sub_categories/afwatering-brug/*').as('getAfwateringBrug');
  cy.intercept('**/overlast-van-dieren/sub_categories/duiven/*').as('getDuiven');
  cy.intercept('POST', '**/overlast-van-dieren/sub_categories/duiven/**').as('PostDuiven');
};

/**
 * Custom command to define routes for deleting a filter.
 * @example cy.deleteFilterRoute();
*/
export const deleteFilterRoute = () => {
  cy.intercept('DELETE', '**/private/me/filters/*').as('deleteFilter');
};

/**
 * Custom command to define routes for manage categories functionality.
 * @example cy.getCategoriesRoutes();
*/
export const getCategoriesRoutes = () => {
  cy.intercept('**/private/departments/').as('getDepartments');
  cy.intercept('**/private/roles/').as('getRoles');
  cy.intercept('**/private/permissions/').as('getPermissions');
  cy.intercept('PATCH', '**/private/categories/*').as('patchCategory');
};

/**
 * Custom command to define routes for deelmeldingen functionality.
 * @example cy.getDeelmeldingenRoute();
*/
export const getDeelmeldingenRoute = () => {
  cy.intercept('**/private/signals/**/children/').as('getDeelmeldingen');
};

/**
 * Custom command to define routes for filter by address.
 * @example cy.getFilterByAddressRoute();
*/
export const getFilterByAddressRoute = () => {
  cy.intercept('**?address_text=**').as('getAddressFilter');
};

/**
 * Custom command to define routes for filter by note.
 * @example cy.getFilterByNoteRoute();
*/
export const getFilterByNoteRoute = () => {
  cy.intercept('**?note_keyword=*').as('submitNoteFilter');
};

/**
 * Custom command to define routes for filter by directing department.
 * @example cy.getFilterByDirectingDepartmentRoute();
*/
export const getFilterByDirectingDepartmentRoute = () => {
  cy.intercept('**?directing_department=*').as('submitDirectingDepartmentFilter');
};

/**
 * Custom command to define routes for filter by signal source.
 * @example cy.getFilterBySourceRoute();
*/
export const getFilterBySourceRoute = () => {
  cy.intercept('**?source=*&page=1&ordering=-created_at&page_size=50').as('getBron');
};

/**
 * Custom command to define routes for filter by signal type.
 * @example cy.getFilterByTypeRoute();
*/
export const getFilterByTypeRoute = () => {
  cy.intercept('**?type=*&page=1&ordering=-created_at&page_size=50').as('getType');
};

/**
 * Custom command to define routes for filter by signal urgency.
 * @example cy.getFilterByUrgencyRoute();
*/
export const getFilterByUrgencyRoute = () => {
  cy.intercept('**?priority=*&page=1&ordering=-created_at&page_size=50').as('getUrgency');
};

/**
 * Custom command to to define routes for filtered signals.
 * @example cy.getFilteredSignalsRoute();
*/
export const getFilteredSignalsRoute = () => {
  cy.intercept('**?stadsdeel=B&status=m&page=1&ordering=-created_at&page_size=50').as(
    'getFilteredSignals'
  );
};

/**
 * Custom command to define routes for getting the history of a signal.
 * @example cy.getHistoryRoute();
*/
export const getHistoryRoute = () => {
  cy.intercept('**/history').as('getHistory');
};

/**
 * Custom command to define routes for the manage signals page.
 * @example cy.getManageSignalsRoutes();
*/
export const getManageSignalsRoutes = () => {
  cy.intercept('**/me/filters/').as('getFilters');
  cy.intercept('**/categories/*').as('getCategories');
  cy.intercept('**/signals/?page=1&ordering=-created_at&page_size=50').as('getSignals');
  cy.intercept('**/me/').as('getUserInfo');
};

/**
 * Custom command to define routes for getting the lampposts.
 * @example cy.getOpenbareVerlichtingRoute();
*/
export const getOpenbareVerlichtingRoute = () => {
  cy.intercept('**/maps/openbare_verlichting?REQUEST=GetFeature&SERVICE=wfs&OUTPUTFORMAT=application/*').as('getOpenbareVerlichting');
};

/**
 * Custom command to define routes for getting search results.
 * @example cy.getSearchResultsRoute();
*/
export const getSearchResultsRoute = () => {
  cy.intercept('**/private/search?*').as('getSearchResults');
};

/**
 * Custom command to define routes for getting the signal details without id.
 * @example cy.getSignalDetailsRoutes();
*/
export const getSignalDetailsRoutes = () => {
  cy.intercept('**/private/signals/*').as('getSignal');
  cy.intercept('**/private/signals/*/history').as('getHistory');
  cy.intercept('**/private/signals/*/attachments').as('getAttachments');
  cy.intercept('**/private/terms/categories/**').as('getTerms');
};

/**
 * Custom command to define routes for getting signal details with id.
 * @example cy.getSignalDetailsRoutesById();
*/
export const getSignalDetailsRoutesById = () => {
  cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
    cy.intercept(`**/private/signals/${json.signalId}`).as('getSignal');
    cy.intercept(`**/private/signals/${json.signalId}/history`).as('getHistory');
    cy.intercept(`**/private/signals/${json.signalId}/attachments`).as('getAttachments');
  });
  cy.intercept('**/private/terms/categories/**').as('getTerms');
};

/**
 * Custom command to define routes for getting signals sorted by address.
 * @example cy.getSortedByAddressRoutes();
*/
export const getSortedByAddressRoutes = () => {
  cy.intercept('**page=1&ordering=address**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-address**').as('getSortedDESC');
};

/**
 * Custom command to define routes for getting signals sorted by city area.
 * @example cy.getSortedByCityAreaRoutes();
*/
export const getSortedByCityAreaRoutes = () => {
  cy.intercept('**page=1&ordering=stadsdeel**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-stadsdeel**').as('getSortedDESC');
};

/**
 * Custom command to define routes for getting signals sorted by id.
 * @example cy.getSortedByIdRoutes();
*/
export const getSortedByIdRoutes = () => {
  cy.intercept('**page=1&ordering=id**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-id**').as('getSortedDESC');
};

/**
 * Custom command to define routes for getting signals sorted by status.
 * @example cy.getSortedByStatusRoutes();
*/
export const getSortedByStatusRoutes = () => {
  cy.intercept('**page=1&ordering=status**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-status**').as('getSortedDESC');
};

/**
 * Custom command to define routes for getting signals sorted by subategory.
 * @example cy.getSortedBySubcategoryRoutes();
*/
export const getSortedBySubcategoryRoutes = () => {
  cy.intercept('**page=1&ordering=sub_category**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-sub_category**').as('getSortedDESC');
};

/**
 * Custom command to define routes for getting signals sorted by datetime.
 * @example cy.getSortedByTimeRoutes();
*/
export const getSortedByTimeRoutes = () => {
  cy.intercept('**page=1&ordering=created_at&page_size=50').as('getSortedTimeASC');
  cy.intercept('**page=1&ordering=-created_at&page_size=50').as('getSortedTimeDESC');
};

/**
 * Custom command to define routes for getting signals sorted by urgency.
 * @example cy.getSortedByUrgencyRoutes();
*/
export const getSortedByUrgencyRoutes = () => {
  cy.intercept('**page=1&ordering=priority**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-priority**').as('getSortedDESC');
};

/**
 * Custom command to define routes for getting signals sorted by id, ascending and descending.
 * @example cy.getSortedRoutes();
*/
export const getSortedRoutes = () => {
  cy.intercept('**page=1&ordering=id&page_size=50').as('getSortedASC');
  cy.intercept('**page=1&ordering=-id&page_size=50').as('getSortedDESC');
};

/**
 * Custom command to define route for getting terms of categories.
 * @example cy.getTermsRoute();
*/
export const getTermsRoute = () => {
  cy.intercept('**/private/terms/categories/**').as('getTerms');
};

/**
 * Custom command to define routes for managing users functionality.
 * @example cy.getUserRoute();
*/
export const getUserRoute = () => {
  cy.intercept('**/private/users/*').as('getUser');
};

/**
 * Custom command to define routes for patching a signal.
 * @example cy.patchSignalRoute();
*/
export const patchSignalRoute = () => {
  cy.intercept('PATCH', '**/private/signals/**').as('patchSignal');
};

/**
 * Custom command to define routes for patching a user.
 * @example cy.patchUserRoute();
*/
export const patchUserRoute = () => {
  cy.intercept('PATCH', '**/private/users/*').as('patchUser');
};

/**
 * Custom command to define routes for creating deelmeldingen.
 * @example cy.postDeelmeldingenRoute();
*/
export const postDeelmeldingenRoute = () => {
  cy.intercept('POST', '**/private/signals/').as('postDeelmeldingen');
};

/**
 * Custom command to define routes for saving a signal filter.
 * @example cy.postFilterRoute();
*/
export const postFilterRoute = () => {
  cy.intercept('POST', '**/me/filters/').as('postFilter');
};

/**
 * Custom command to define routes for creating a signal as a logged in user.
 * @example cy.postSignalRoutePrivate();
*/
export const postSignalRoutePublic = () => {
  cy.intercept('POST', '**/public/signals/').as('postSignalPublic');
};

/**
 * Custom command to define routes for creating a signal as a not logged in user.
 * @example cy.postSignalRoutePublic();
*/
export const postSignalRoutePrivate = () => {
  cy.intercept('POST', '**/private/signals/').as('postSignalPrivate');
};

/**
 * Custom command to stub the address response data from PDOK.
 * @example cy.stubAddress('changeAddressPencil');
*/
export const stubAddress = (fixture: string) => {
  cy.intercept('GET', '/locatieserver/v3', { fixture: `addresses/${fixture}` }).as('getAddress');
};

/**
 * Custom command to stub the reponse data for the map from the mapserver.
 * @example cy.stubMap();
*/
export const stubMap = () => {
  cy.intercept('**/**.data.amsterdam.nl/topo_rd/**', { fixture: 'images/map.png' }).as('getMap');
};

/**
 * Custom command to stub the reponse data from the prediction service.
 * @example cy.stubPrediction('container.json');
*/
export const stubPreviewMap = () => {
  cy.intercept('**/maps/topografie?bbox=**', { fixture: 'images/mapPreview.jpeg' }).as('getPreviewMap');
};

/**
 * Custom command to stub the response data for the previewmap from the mapserver.
 * @example cy.stubPreviewMap();
*/
export const stubPrediction = (fixture: string) => {
  cy.intercept('POST', '**/prediction', { fixture: `predictions/${fixture}` }).as('getPrediction');
};

/**
 * Custom command to define waits for categories functionality.
 * @example cy.waitForCategoriesRoutes();
*/
export const waitForCategoriesRoutes = () => {
  cy.wait('@getDepartments');
  cy.wait('@getRoles');
  cy.wait('@getPermissions');
};

/**
 * Custom command to define waits for manage signals functionality.
 * @example cy.waitForManageSignalsRoutes();
*/
export const waitForManageSignalsRoutes = () => {
  cy.wait('@getFilters');
  cy.wait('@getCategories');
  cy.wait('@getSignals');
  cy.wait('@getUserInfo');
};

/**
 * Custom command to define waits for notes functionality.
 * @example cy.waitForNoteRoutes();
*/
export const waitForNoteRoutes = () => {
  cy.wait('@patchNote');
  cy.wait('@getSignal');
  cy.wait('@getHistory');
};

/**
 * Custom command to define waits for getting the signal details.
 * @example cy.waitForSignalDetailsRoutes();
*/
export const waitForSignalDetailsRoutes = () => {
  cy.wait('@getSignal');
  cy.wait('@getHistory');
  cy.wait('@getAttachments');
  cy.wait('@getTerms');
};
