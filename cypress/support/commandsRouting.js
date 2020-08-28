// Search for an address
Cypress.Commands.add('getAddressRoute', () => {
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

// Wait for loading the Categories Signals page
Cypress.Commands.add('waitForCategoriesRoutes', () => {
  cy.wait('@getDepartments');
  cy.wait('@getRoles');
  cy.wait('@getPermissions');
  cy.wait('@getCategories');
});

// Submit signal public
Cypress.Commands.add('postSignalRoutePublic', () => {
  cy.route('POST', '/signals/v1/public/signals/').as('postSignalPublic');
});

// Submit signal private
Cypress.Commands.add('postSignalRoutePrivate', () => {
  cy.route('POST', '/signals/v1/private/signals/').as('postSignalPrivate');
});

// Submit image
Cypress.Commands.add('postImageRoute', () => {
  cy.route('POST', '/signals/signal/image/').as('postImage');
});

// Loading overview map for signals
Cypress.Commands.add('defineMapRoutes', () => {
  cy.route('/signals/v1/private/signals/geography?*').as('getGeography');
  cy.route('signals/v1/private/signals/?page=1&ordering=-created_at&page_size=50').as('getSignals');
  cy.route('/signals/v1/private/me/filters/').as('getFilters');
  cy.route('/signals/v1/private/categories/*').as('getCategories');
});

// Routes loading signal details
Cypress.Commands.add('getSignalDetailsRoutesById', () => {
  cy.route(`/signals/v1/private/signals/${Cypress.env('signalId')}`).as('getSignal');
  cy.route(`/signals/v1/private/signals/${Cypress.env('signalId')}/history`).as('getHistory');
  cy.route(`/signals/v1/private/signals/${Cypress.env('signalId')}/attachments`).as('getAttachments');
  cy.route('/maps/topografie?bbox=*').as('getMap');
  cy.route('/signals/v1/private/terms/categories/**').as('getTerms');
});

// Routes loading signal details
Cypress.Commands.add('getSignalDetailsRoutes', () => {
  cy.route('/signals/v1/private/signals/*').as('getSignal');
  cy.route('/signals/v1/private/signals/*/history').as('getHistory');
  cy.route('/signals/v1/private/signals/*/attachments').as('getAttachments');
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

Cypress.Commands.add('postNoteRoutes', () => {
  cy.route('PATCH', '/signals/v1/private/signals/*').as('patchNote');
  cy.route('/signals/v1/private/signals/?page=*').as('getSignal');
  cy.route('**/history').as('getHistory');
});

Cypress.Commands.add('waitForPostNoteRoutes', () => {
  cy.wait('@patchNote');
  cy.wait('@getSignal');
  cy.wait('@getHistory');
});

Cypress.Commands.add('postDeelmeldingen', () => {
  const deelMeldingId01 = Cypress.env('signalId') + 1;
  const deelMeldingId02 = Cypress.env('signalId') + 2;
  const deelMeldingId03 = Cypress.env('signalId') + 3;
  cy.route('POST', '/signals/v1/private/signals/*/split').as('postDeelmelding');
  cy.route('PATCH', `/signals/v1/private/signals/${deelMeldingId01}`).as('patchDeelmelding01');
  cy.route('PATCH', `/signals/v1/private/signals/${deelMeldingId02}`).as('patchDeelmelding02');
  cy.route('PATCH', `/signals/v1/private/signals/${deelMeldingId03}`).as('patchDeelmelding03');
});

Cypress.Commands.add('waitForPostDeelmeldingen', () => {
  cy.wait('@postDeelmelding');
  cy.wait('@patchDeelmelding01');
  cy.wait('@patchDeelmelding02');
  cy.wait('@patchDeelmelding03');
});
