// Select an adress from autosuggest
Cypress.Commands.add('defineGeoSearchRoutes', () => {
  cy.route('https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup?*').as('lookup');
  cy.route('**/bag/v1.1/nummeraanduiding/?format=json&locatie=**').as('location');
  cy.route('**/geosearch/bag/?lat=*').as('geoSearchLocation');
});

// Search for an adress
Cypress.Commands.add('getAdressRoute', adress => {
  cy.route(`https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?fq=gemeentenaam:amsterdam&fq=type:adres&q=${  adress}`).as('getAdress');
});

// Loading the Manage Signals page
Cypress.Commands.add('getManageSignalsRoutes', () => {
  cy.route('**/signals/v1/private/me/filters/').as('getFilters');
  cy.route('**/signals/v1/private/categories/*').as('getCategories');
  cy.route('**/signals/v1/private/signals/?&page=1&ordering=-created_at&page_size=50').as('getSignals');
  cy.route('**/signals/v1/private/me/').as('getUserInfo');
});

// Loading the Categories page
Cypress.Commands.add('getCategoriesRoutes', () => {
  cy.route('/signals/v1/private/departments/').as('getDepartments');
  cy.route('/signals/v1/private/roles/').as('getRoles');
  cy.route('/signals/v1/private/permissions/').as('getPermissions');
  cy.route('PATCH', '/signals/v1/private/categories/*').as('patchCategory');
});