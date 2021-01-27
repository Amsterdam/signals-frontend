/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.defineDepartmentRoutes();
    */
    defineDepartmentRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.defineMapRoutes();
    */
    defineMapRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.defineNoteRoutes();
    */
    defineNoteRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.deleteFilterRoute();
    */
    deleteFilterRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.defineStandaardtekstenRoutes();
    */
    defineStandaardtekstenRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getCategoriesRoutes();
    */
    getCategoriesRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getDeelmeldingenRoute();
    */
    getDeelmeldingenRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getFilterByAddressRoute();
    */
    getFilterByAddressRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getFilterByNoteRoute();
    */
    getFilterByNoteRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getFilterBySourceRoute();
    */
    getFilterBySourceRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getFilterByTypeRoute();
    */
    getFilterByTypeRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getFilterByUrgencyRoute();
    */
    getFilterByUrgencyRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getFilteredSignalsRoute();
    */
    getFilteredSignalsRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getHistoryRoute();
    */
    getHistoryRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getManageSignalsRoutes();
    */
    getManageSignalsRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getOpenbareVerlichtingRoute();
    */
    getOpenbareVerlichtingRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getSearchResultsRoute();
    */
    getSearchResultsRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getSignalDetailsRoutes();
    */
    getSignalDetailsRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getSignalDetailsRoutesById();
    */
    getSignalDetailsRoutesById(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getSortedByAddressRoutes();
    */
    getSortedByAddressRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getSortedByCityAreaRoutes();
    */
    getSortedByCityAreaRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getSortedByIdRoutes();
    */
    getSortedByIdRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getSortedByStatusRoutes();
    */
    getSortedByStatusRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getSortedBySubcategoryRoutes();
    */
    getSortedBySubcategoryRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getSortedByTimeRoutes();
    */
    getSortedByTimeRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getSortedByUrgencyRoutes();
    */
    getSortedByUrgencyRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getSortedRoutes();
    */
    getSortedRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getTermsRoute();
    */
    getTermsRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.getUserRoute();
    */
    getUserRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.patchSignalRoute();
    */
    patchSignalRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.patchUserRoute();
    */
    patchUserRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.postDeelmeldingenRoute();
    */
    postDeelmeldingenRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.postFilterRoute();
    */
    postFilterRoute(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.postSignalRoutePrivate();
    */
    postSignalRoutePrivate(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.postSignalRoutePublic();
    */
    postSignalRoutePublic(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.stubAddress('changeAddressPencil');
    */
    stubAddress(fixture: string): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.stubMap();
    */
    stubMap(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.stubPrediction('container.json');
    */
    stubPrediction(fixture: string): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.stubPreviewMap();
    */
    stubPreviewMap(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.waitForCategoriesRoutes();
    */
    waitForCategoriesRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.waitForManageSignalsRoutes();
    */
    waitForManageSignalsRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.waitForNoteRoutes();
    */
    waitForNoteRoutes(): Chainable<Element>;

    /**
     * Custom command to check if all elements are visible on the homepage.
     * @example cy.waitForSignalDetailsRoutes();
    */
    waitForSignalDetailsRoutes(): Chainable<Element>;
  }
}
