// Select an address from autosuggest
Cypress.Commands.add('defineGeoSearchRoutes', () => {
  cy.route('/geosearch/bag/?lat=*').as('geoSearchLocation');
});

// Search for an address
Cypress.Commands.add('getAddressRoute', ()=> {
  cy.route('/locatieserver/v3/suggest?fq=*').as('getAddress');
});

// Routes for loading manage signals page
Cypress.Commands.add('getManageSignalsRoutes', () => {
  cy.route('/signals/v1/private/me/filters/').as('getFilters');
  cy.route('/signals/v1/private/categories/*').as('getCategories');
  cy.route('/signals/v1/private/signals/?page=1&ordering=-created_at&page_size=50').as('getSignals');
  cy.route('/signals/v1/private/me/').as('getUserInfo');
});

// Wait for loading the Manage Signals page
Cypress.Commands.add('waitForManageSignalsRoutes', () => {
  cy.wait('@getFilters');
  cy.wait('@getCategories');
  cy.wait('@getSignals');
  cy.wait('@getUserInfo');
});

// Loading the Categories page
Cypress.Commands.add('getCategoriesRoutes', () => {
  cy.route('/signals/v1/private/departments/').as('getDepartments');
  cy.route('/signals/v1/private/roles/').as('getRoles');
  cy.route('/signals/v1/private/permissions/').as('getPermissions');
  cy.route('PATCH', '/signals/v1/private/categories/*').as('patchCategory');
});

// Submit signal public
Cypress.Commands.add('postSignalRoutePublic', () => {
  cy.route('POST','/signals/v1/public/signals/').as('postSignalPublic');
});

// Submit signal private
Cypress.Commands.add('postSignalRoutePrivate', () => {
  cy.route('POST','/signals/v1/private/signals/').as('postSignalPrivate');
});

// Submit image
Cypress.Commands.add('postImageRoute', () => {
  cy.route('POST','/signals/signal/image/').as('postImage');
});

// Loading overview map for signals
Cypress.Commands.add('defineMapRoutes', () => {
  cy.route('/signals/v1/private/signals/geography?*').as('getGeography');
  cy.route('signals/v1/private/signals/?page=1&ordering=-created_at&page_size=50').as('getSignals');
  cy.route('/signals/v1/private/me/filters/').as('getFilters');
  cy.route('/signals/v1/private/categories/*').as('getCategories');
});

// Routes loading signal details
Cypress.Commands.add('getSignalDetailsRoutes', () => {
  cy.route(`/signals/v1/private/signals/${  Cypress.env('signalId')}`).as('getSignal');
  cy.route(`/signals/v1/private/signals/${  Cypress.env('signalId')  }/history`).as('getHistory');
  cy.route(`/signals/v1/private/signals/${  Cypress.env('signalId')}/attachments`).as('getAttachments');
  cy.route('/maps/topografie?bbox=*').as('getMap');
  cy.route('/signals/v1/private/terms/categories/**').as('getTerms');  
});

// Waits loading signal details
Cypress.Commands.add('waitForSignalDetailsRoutes', () => {
  cy.wait('@getSignal');
  cy.wait('@getHistory');
  cy.wait('@getAttachments');
  cy.wait('@getMap');
  cy.wait('@getTerms');
}); 