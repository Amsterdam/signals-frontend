declare namespace Cypress {
  interface Chainable {

    /**
     * Custom command to define the routes for manage departments functionality.
     * @example cy.defineDepartmentRoutes();
    */
    defineDepartmentRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for 24 hour map functionality.
     * @example cy.defineMapRoutes();
    */
    defineMapRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for notes functionality.
     * @example cy.defineNoteRoutes();
    */
    defineNoteRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for manage standaardteksten functionality.
     * @example cy.defineStandaardtekstenRoutes();
    */
    defineStandaardtekstenRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for deleting a filter.
     * @example cy.deleteFilterRoute();
    */
    deleteFilterRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for manage categories functionality.
     * @example cy.getCategoriesRoutes();
    */
    getCategoriesRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for deelmeldingen functionality.
     * @example cy.getDeelmeldingenRoute();
    */
    getDeelmeldingenRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for filter by address.
     * @example cy.getFilterByAddressRoute();
    */
    getFilterByAddressRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for filter by note.
     * @example cy.getFilterByNoteRoute();
    */
    getFilterByNoteRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for filter by signal source.
     * @example cy.getFilterBySourceRoute();
    */
    getFilterBySourceRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for filter by signal type.
     * @example cy.getFilterByTypeRoute();
    */
    getFilterByTypeRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for filter by signal urgency.
     * @example cy.getFilterByUrgencyRoute();
    */
    getFilterByUrgencyRoute: () => Chainable<Element>;

    /**
     * Custom command to to define routes for filtered signals.
     * @example cy.getFilteredSignalsRoute();
    */
    getFilteredSignalsRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting the history of a signal.
     * @example cy.getHistoryRoute();
    */
    getHistoryRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for the manage signals page.
     * @example cy.getManageSignalsRoutes();
    */
    getManageSignalsRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting the lampposts.
     * @example cy.getOpenbareVerlichtingRoute();
    */
    getOpenbareVerlichtingRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting search results.
     * @example cy.getSearchResultsRoute();
    */
    getSearchResultsRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting the signal details without id.
     * @example cy.getSignalDetailsRoutes();
    */
    getSignalDetailsRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting signal details with id.
     * @example cy.getSignalDetailsRoutesById();
    */
    getSignalDetailsRoutesById: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting signals sorted by address.
     * @example cy.getSortedByAddressRoutes();
    */
    getSortedByAddressRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting signals sorted by city area.
     * @example cy.getSortedByCityAreaRoutes();
    */
    getSortedByCityAreaRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting signals sorted by id.
     * @example cy.getSortedByIdRoutes();
    */
    getSortedByIdRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting signals sorted by status.
     * @example cy.getSortedByStatusRoutes();
    */
    getSortedByStatusRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting signals sorted by subategory.
     * @example cy.getSortedBySubcategoryRoutes();
    */
    getSortedBySubcategoryRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting signals sorted by datetime.
     * @example cy.getSortedByTimeRoutes();
    */
    getSortedByTimeRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting signals sorted by urgency.
     * @example cy.getSortedByUrgencyRoutes();
    */
    getSortedByUrgencyRoutes: () => Chainable<Element>;

    /**
     * Custom command to define routes for getting signals sorted by id, ascending and descending.
     * @example cy.getSortedRoutes();
    */
    getSortedRoutes: () => Chainable<Element>;

    /**
     * Custom command to define route for getting terms of categories.
     * @example cy.getTermsRoute();
    */
    getTermsRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for managing users functionality.
     * @example cy.getUserRoute();
    */
    getUserRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for patching a signal.
     * @example cy.patchSignalRoute();
    */
    patchSignalRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for patching a user.
     * @example cy.patchUserRoute();
    */
    patchUserRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for creating deelmeldingen.
     * @example cy.postDeelmeldingenRoute();
    */
    postDeelmeldingenRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for saving a signal filter.
     * @example cy.postFilterRoute();
    */
    postFilterRoute: () => Chainable<Element>;

    /**
     * Custom command to define routes for creating a signal as a logged in user.
     * @example cy.postSignalRoutePrivate();
    */
    postSignalRoutePrivate: () => Chainable<Element>;

    /**
     * Custom command to define routes for creating a signal as a not logged in user.
     * @example cy.postSignalRoutePublic();
    */
    postSignalRoutePublic: () => Chainable<Element>;

    /**
     * Custom command to stub the address response data from PDOK.
     * @example cy.stubAddress('changeAddressPencil');
    */
    stubAddress: (fixture: string) => Chainable<Element>;

    /**
     * Custom command to stub the reponse data for the map from the mapserver.
     * @example cy.stubMap();
    */
    stubMap: () => Chainable<Element>;

    /**
     * Custom command to stub the reponse data from the prediction service.
     * @example cy.stubPrediction('container.json');
    */
    stubPrediction: (fixture: string) => Chainable<Element>;

    /**
     * Custom command to stub the response data for the previewmap from the mapserver.
     * @example cy.stubPreviewMap();
    */
    stubPreviewMap: () => Chainable<Element>;

    /**
     * Custom command to define waits for categories functionality.
     * @example cy.waitForCategoriesRoutes();
    */
    waitForCategoriesRoutes: () => Chainable<Element>;

    /**
     * Custom command to define waits for manage signals functionality.
     * @example cy.waitForManageSignalsRoutes();
    */
    waitForManageSignalsRoutes: () => Chainable<Element>;

    /**
     * Custom command to define waits for notes functionality.
     * @example cy.waitForNoteRoutes();
    */
    waitForNoteRoutes: () => Chainable<Element>;

    /**
     * Custom command to define waits for getting the signal details.
     * @example cy.waitForSignalDetailsRoutes();
    */
    waitForSignalDetailsRoutes: () => Chainable<Element>;
  }
}
