# Fetching incidents

date: 2020-01-15
update: 2022-12-22

## Context

In the Signals frontend application, a number of different endpoints provide data that can be used to render an overview of incidents.

The first one is the [private signals endpoint](https://api.data.amsterdam.nl/api/swagger/?url=/signals/swagger/openapi.yaml#/default/get_signals_v1_private_signals_), the second is the private search endpoint. Both return the same data structure, but expect/require different parameters.

Another way of retrieving the incidents is with the GEOGRAPHY_ENDPOINT and GEOGRAPHY_PUBLIC_ENDPOINT endpoints that accept geo locations and return the incidents that lie within.

In a number of occasions, a request is made to one of the private endpoints to retrieve the most recent set of data from the API. Those occasions are:

1. **On mount of the `IncidentModule`**

   If there is no search query entered in the search form, the private `signals` endpoint is queried. When there is a search query entered, the private `search` endpoint is queried.

   Component: `signals/IncidentManagement`
   Action: `requestIncidents`

2. **When a set of filter options is applied**

   The options that are selected in the `FilterForm` component are picked up by the `Filter` container component and dispatched to the store.

   Component: `signals/IncidentManagement/containers/Filter`
   Action: `applyFilter`

3. **When the `SearchBar` container receives a `submit` event**

   Every time the input for the `SearchBar` is submitted, the `SearchBar` container dispatches an action that trigger another fetch. The `submit` event triggers a redirect to the `IncidentManagement` module. See 1. for details.

   Component: `signals/containers/SearchBar`

   Action: `setSearchQuery`

4. **When a pagination item is clicked**

   If the incidents overview page renders a `Pagination` component, every click on a pagination item results in an action being dispatched. This action, in turn, triggers a fetch of results from either the `search` endpoint or the `signals` endpoint, depending on the presence of a search query.

   Component: `signals/IncidentManagement/containers/IncidentOverviewPage`

   Action: `pageChanged`

5. **When a column's order is changed**

   The incidents overview page shows a table with sortable columns. Clicking on a column header will dispatch an action. This action, similar to `pageChanged` will trigger a fetch of results from either the `search` endpoint or the `signals` endpoint.

   Component: `signals/IncidentManagement/containers/IncidentOverviewPage`

   Action: `orderingChanged`

6. **When an incident has been successfully patched**

   Individual incidents can be patched in the `IncidentDetail` container. Navigating back from the detail page to the overview page should show the changes that have been applied to the incident. Therefore, after the `patchIncidentSuccess` action has been dispatched, a new set of (updated) incidents is retrieved.

   Component: `signals/IncidentManagement/containers/IncidentDetail`

   Action: `patchIncident`
