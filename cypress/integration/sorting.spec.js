// <reference types="Cypress" />
import { MANAGE_SIGNALS } from '../support/selectorsManageIncidents';
import * as requests from '../support/commandsRequests';

describe('Sorting', () => {
  beforeEach(() => {
    cy.server();
    cy.getManageSignalsRoutes();
    localStorage.setItem('accessToken', Cypress.env('token'));
    cy.visitFetch('/manage/incidents/');
    cy.waitForManageSignalsRoutes();
  });

  it('Should sort on column Id', () => {
    requests.createSignalOverviewMap();
    cy.route('/signals/v1/private/signals/?page=1&ordering=id&page_size=50').as('getSortedASC');
    cy.route('/signals/v1/private/signals/?page=1&ordering=-id&page_size=50').as('getSortedDESC');

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedASC');
    cy.get('th.sort.sort-up').should('have.text', 'Id').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalId).should('have.text', '1');

    cy.get('th').contains('Id').click();
    cy.wait('@getSortedDESC');
    cy.get('th.sort.sort-down').should('have.text', 'Id').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalId).should('not.have.text', '1');
  });

  it('Should sort on column Dag', () => {
    cy.route('/signals/v1/private/signals/?page=1&ordering=created_at&page_size=50').as('getSortedDESC');

    cy.get('th').contains('Dag').click();
    // getSignals is the same as the ASC request for day
    cy.wait('@getSignals');
    cy.get('th.sort.sort-up').should('have.text', 'Dag').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalDag).should('have.text', '0');

    cy.get('th').contains('Dag').click();
    cy.wait('@getSortedDESC');
    cy.get('th.sort.sort-down').should('have.text', 'Dag').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignaldag).should('not.have.text', '0');
  });

  it('Should sort on column Datum en tijd', () => {
    cy.route('/signals/v1/private/signals/?page=1&ordering=created_at&page_size=50').as('getSortedASC');
    const todaysDate = Cypress.moment().format('DD-MM-YYYY');

    cy.get('th').contains('Datum en tijd').click();
    cy.wait('@getSortedASC');
    cy.get('th.sort.sort-up').should('have.text', 'Datum en tijd').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalDatumTijd).should('not.contain', todaysDate);

    cy.get('th').contains('Datum en tijd').click();
    // getSignals is the same as the DESC request for Datum en tijd
    cy.wait('@getSignals');
    cy.get('th.sort.sort-down').should('have.text', 'Datum en tijd').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalDatumTijd).should('contain', todaysDate);
  });


  it('Should sort on column Stadsdeel', () => {
    cy.route('**/signals/v1/private/signals/?page=1&ordering=stadsdeel,-created_at&page_size=50').as('getSortedASC');
    cy.route('**/signals/v1/private/signals/?page=1&ordering=-stadsdeel,-created_at&page_size=50').as('getSortedDESC');

    cy.get('th').contains('Stadsdeel').click();
    cy.wait('@getSortedASC');
    cy.get('th.sort.sort-up').should('have.text', 'Stadsdeel').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalStadsdeelName).should('have.text', 'Centrum');

    cy.get('th').contains('Stadsdeel').click();
    cy.wait('@getSortedDESC');
    cy.get('th.sort.sort-down').should('have.text', 'Stadsdeel').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalStadsdeelName).should('have.text', 'Zuidoost');
  });

  it('Should sort on column Subcategorie', () => {
    cy.route('/signals/v1/private/signals/?page=1&ordering=sub_category,-created_at&page_size=50').as('getSortedASC');
    cy.route('/signals/v1/private/signals/?page=1&ordering=-sub_category,-created_at&page_size=50').as('getSortedDESC');

    cy.get('th').contains('Subcategorie').click();
    cy.wait('@getSortedASC');
    cy.get('th.sort.sort-up').should('have.text', 'Subcategorie').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalSubcategorie).should('have.text', 'Afwatering brug');

    cy.get('th').contains('Subcategorie').click();
    cy.wait('@getSortedDESC');
    cy.get('th.sort.sort-down').should('have.text', 'Subcategorie').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalSubcategorie).should('have.text', 'Woningkwaliteit');
  });
  it('Should sort on column Status', () => {
    cy.route('/signals/v1/private/signals/?page=1&ordering=status,-created_at&page_size=50').as('getSortedASC');
    cy.route('/signals/v1/private/signals/?page=1&ordering=-status,-created_at&page_size=50').as('getSortedDESC');

    cy.get('th').contains('Status').click();
    cy.wait('@getSortedASC');
    cy.get('th.sort.sort-up').should('have.text', 'Status').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalStatus).should('have.text', 'Afgehandeld');

    cy.get('th').contains('Status').click();
    cy.wait('@getSortedDESC');
    cy.get('th.sort.sort-down').should('have.text', 'Status').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalStatus).should('have.text', 'In behandeling');
  });
  it('Should sort on column Urgentie', () => {
    cy.route('/signals/v1/private/signals/?page=1&ordering=priority,-created_at&page_size=50').as('getSortedASC');
    cy.route('/signals/v1/private/signals/?page=1&ordering=-priority,-created_at&page_size=50').as('getSortedDESC');

    cy.get('th').contains('Urgentie').click();
    cy.wait('@getSortedASC');
    cy.get('th.sort.sort-up').should('have.text', 'Urgentie').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalUrgentie).should('have.text', 'Hoog');

    cy.get('th').contains('Urgentie').click();
    cy.wait('@getSortedDESC');
    cy.get('th.sort.sort-down').should('have.text', 'Urgentie').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalUrgentie).should('have.text', 'Normaal');
  });

  it('Should sort on column Adres', () => {
    cy.route('/signals/v1/private/signals/?page=1&ordering=address,-created_at&page_size=50').as('getSortedASC');
    cy.route('/signals/v1/private/signals/?page=1&ordering=-address,-created_at&page_size=50').as('getSortedDESC');

    cy.get('th').contains('Adres').click();
    cy.wait('@getSortedASC');
    cy.get('th.sort.sort-up').should('have.text', 'Adres').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalAdres).should('contain', 'Afroditekade');

    cy.get('th').contains('Adres').click();
    cy.wait('@getSortedDESC');
    cy.get('th.sort.sort-down').should('have.text', 'Adres').and('be.visible');
    cy.get(MANAGE_SIGNALS.firstSignalAdres).should('contain', 'Zeedijk');
  });
});
