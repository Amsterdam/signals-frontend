Cypress.Commands.add('defineDepartmentRoutes', () => {
  cy.intercept(/departments\/\d+/).as('getDepartment');
  cy.intercept('PATCH', '**/private/departments/*').as('patchDepartment');
});

Cypress.Commands.add('defineMapRoutes', () => {
  cy.intercept('**/geography?*').as('getGeography');
  cy.intercept('**?page=1&ordering=-created_at&page_size=50').as('getSignals');
  cy.intercept('**/me/filters/').as('getFilters');
  cy.intercept('**/categories/*').as('getCategories');
});

Cypress.Commands.add('defineNoteRoutes', () => {
  cy.intercept('PATCH', '**/private/signals/*').as('patchNote');
  cy.intercept('**/private/signals/?page=*').as('getSignal');
  cy.intercept('**/history').as('getHistory');
});

Cypress.Commands.add('deleteFilterRoute', () => {
  cy.intercept('DELETE', '**/private/me/filters/*').as('deleteFilter');
});

Cypress.Commands.add('getCategoriesRoutes', () => {
  cy.intercept('**/private/departments/').as('getDepartments');
  cy.intercept('**/private/roles/').as('getRoles');
  cy.intercept('**/private/permissions/').as('getPermissions');
  cy.intercept('PATCH', '**/private/categories/*').as('patchCategory');
});

Cypress.Commands.add('getDeelmeldingenRoute', () => {
  cy.intercept('**/private/signals/**/children/').as('getDeelmeldingen');
});

Cypress.Commands.add('getFilterByAddressRoute', () => {
  cy.intercept('**?address_text=**').as('getAddressFilter');
});

Cypress.Commands.add('getFilterByNoteRoute', () => {
  cy.intercept('**?note_keyword=*').as('submitNoteFilter');
});

Cypress.Commands.add('getFilterBySourceRoute', () => {
  cy.intercept('**?source=*&page=1&ordering=-created_at&page_size=50').as('getBron');
});

Cypress.Commands.add('getFilterByTypeRoute', () => {
  cy.intercept('**?type=*&page=1&ordering=-created_at&page_size=50').as('getType');
});

Cypress.Commands.add('getFilterByUrgencyRoute', () => {
  cy.intercept('**?priority=*&page=1&ordering=-created_at&page_size=50').as('getUrgency');
});

Cypress.Commands.add('getFilteredSignalsRoute', () => {
  cy.intercept('**?stadsdeel=B&status=m&page=1&ordering=-created_at&page_size=50').as(
    'getFilteredSignals'
  );
});

Cypress.Commands.add('getHistoryRoute', () => {
  cy.intercept('**/history').as('getHistory');
});

Cypress.Commands.add('getManageSignalsRoutes', () => {
  cy.intercept('**/me/filters/').as('getFilters');
  cy.intercept('**/categories/*').as('getCategories');
  cy.intercept('**/signals/?page=1&ordering=-created_at&page_size=50').as('getSignals');
  cy.intercept('**/me/').as('getUserInfo');
});

Cypress.Commands.add('getOpenbareVerlichtingRoute', () => {
  cy.intercept('**/maps/openbare_verlichting?REQUEST=GetFeature&SERVICE=wfs&OUTPUTFORMAT=application/*').as('getOpenbareVerlichting');
});

Cypress.Commands.add('getSearchResultsRoute', () => {
  cy.intercept('**/private/search?*').as('getSearchResults');
});

Cypress.Commands.add('getSignalDetailsRoutes', () => {
  cy.intercept('**/private/signals/*').as('getSignal');
  cy.intercept('**/private/signals/*/history').as('getHistory');
  cy.intercept('**/private/signals/*/attachments').as('getAttachments');
  cy.intercept('**/private/terms/categories/**').as('getTerms');
});

Cypress.Commands.add('getSignalDetailsRoutesById', () => {
  cy.readFile('./cypress/fixtures/tempSignalId.json').then(json => {
    cy.intercept(`**/private/signals/${json.signalId}`).as('getSignal');
    cy.intercept(`**/private/signals/${json.signalId}/history`).as('getHistory');
    cy.intercept(`**/private/signals/${json.signalId}/attachments`).as('getAttachments');
  });
  cy.intercept('**/private/terms/categories/**').as('getTerms');
});

Cypress.Commands.add('getSortedByAddressRoutes', () => {
  cy.intercept('**page=1&ordering=address**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-address**').as('getSortedDESC');
});

Cypress.Commands.add('getSortedByCityAreaRoutes', () => {
  cy.intercept('**page=1&ordering=stadsdeel**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-stadsdeel**').as('getSortedDESC');
});

Cypress.Commands.add('getSortedByIdRoutes', () => {
  cy.intercept('**page=1&ordering=id**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-id**').as('getSortedDESC');
});

Cypress.Commands.add('getSortedByStatusRoutes', () => {
  cy.intercept('**page=1&ordering=status**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-status**').as('getSortedDESC');
});

Cypress.Commands.add('getSortedBySubcategoryRoutes', () => {
  cy.intercept('**page=1&ordering=sub_category**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-sub_category**').as('getSortedDESC');
});

Cypress.Commands.add('getSortedByTimeRoutes', () => {
  cy.intercept('**page=1&ordering=created_at&page_size=50').as('getSortedTimeASC');
  cy.intercept('**page=1&ordering=-created_at&page_size=50').as('getSortedTimeDESC');
});

Cypress.Commands.add('getSortedByUrgencyRoutes', () => {
  cy.intercept('**page=1&ordering=priority**').as('getSortedASC');
  cy.intercept('**page=1&ordering=-priority**').as('getSortedDESC');
});

Cypress.Commands.add('getSortedRoutes', () => {
  cy.intercept('**page=1&ordering=id&page_size=50').as('getSortedASC');
  cy.intercept('**page=1&ordering=-id&page_size=50').as('getSortedDESC');
});

Cypress.Commands.add('getTermsRoute', () => {
  cy.intercept('**/private/terms/categories/**').as('getTerms');
});

Cypress.Commands.add('getUserRoute', () => {
  cy.intercept('**/private/users/*').as('getUser');
});

Cypress.Commands.add('patchSignalRoute', () => {
  cy.intercept('PATCH', '**/private/signals/**').as('patchSignal');
});

Cypress.Commands.add('patchUserRoute', () => {
  cy.intercept('PATCH', '**/private/users/*').as('patchUser');
});

Cypress.Commands.add('postDeelmeldingenRoute', () => {
  cy.intercept('POST', '**/private/signals/').as('postDeelmeldingen');
});

Cypress.Commands.add('postFilterRoute', () => {
  cy.intercept('POST', '**/me/filters/').as('postFilter');
});

Cypress.Commands.add('postSignalRoutePublic', () => {
  cy.intercept('POST', '**/public/signals/').as('postSignalPublic');
});

Cypress.Commands.add('postSignalRoutePrivate', () => {
  cy.intercept('POST', '**/private/signals/').as('postSignalPrivate');
});

Cypress.Commands.add('defineStandaardtekstenRoutes', () => {
  cy.intercept('**/civiele-constructies/sub_categories/afwatering-brug/*').as('getAfwateringBrug');
  cy.intercept('**/overlast-van-dieren/sub_categories/duiven/*').as('getDuiven');
  cy.intercept('POST', '**/overlast-van-dieren/sub_categories/duiven/**').as('PostDuiven');
});

Cypress.Commands.add('stubAddress', fixture => {
  cy.intercept('GET', '/locatieserver/v3', { fixture: `addresses/${fixture}` }).as('getAddress');
});

Cypress.Commands.add('stubMap', () => {
  cy.intercept('**/**.data.amsterdam.nl/topo_rd/**', { fixture: 'images/map.png' }).as('getMap');
});

Cypress.Commands.add('stubPreviewMap', () => {
  cy.intercept('**/maps/topografie?bbox=**', { fixture: 'images/mapPreview.jpeg' }).as('getPreviewMap');
});

Cypress.Commands.add('stubPrediction', fixture => {
  cy.intercept('POST', '**/prediction', { fixture: `predictions/${fixture}` }).as('getPrediction');
});

Cypress.Commands.add('waitForCategoriesRoutes', () => {
  cy.wait('@getDepartments');
  cy.wait('@getRoles');
  cy.wait('@getPermissions');
});

Cypress.Commands.add('waitForManageSignalsRoutes', () => {
  cy.wait('@getFilters');
  cy.wait('@getCategories');
  cy.wait('@getSignals');
  cy.wait('@getUserInfo');
});

Cypress.Commands.add('waitForNoteRoutes', () => {
  cy.wait('@patchNote');
  cy.wait('@getSignal');
  cy.wait('@getHistory');
});

Cypress.Commands.add('waitForSignalDetailsRoutes', () => {
  cy.wait('@getSignal');
  cy.wait('@getHistory');
  cy.wait('@getAttachments');
  cy.wait('@getTerms');
});
