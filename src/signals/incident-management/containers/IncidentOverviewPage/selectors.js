import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the overviewPage state domain
 */
const selectOverviewPageDomain = state => state.incidentOverviewPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OverviewPage
 */

const makeSelectOverviewPage = () =>
  createSelector(
    selectOverviewPageDomain,
    state => state,
  );

const makeSelectIncidentsCount = createSelector(
  selectOverviewPageDomain,
  state => {
    if (!state) return state;

    return state.incidentsCount;
  },
);

const makeSelectFilterParams = () =>
  createSelector(
    selectOverviewPageDomain,
    state => {
      const filter = state.filter || { options: {} };
      const { options } = filter;
      if (options && options.id) {
        delete options.id;
      }

      if (filter.searchQuery) {
        return {
          id: filter.searchQuery,
          page: state.page,
          ordering: state.sort,
        };
      }

      return { ...options, page: state.page, ordering: state.sort };
    },
  );

export default makeSelectOverviewPage;

export const makeSelectAllFilters = createSelector(
  selectOverviewPageDomain,
  stateMap => {
    const state = stateMap.toJS();

    return state.allFilters;
  },
);

export const makeSelectFilter = createSelector(
  selectOverviewPageDomain,
  stateMap => {
    const state = stateMap.toJS();

    return state.filter;
  },
);

export { selectOverviewPageDomain, makeSelectFilterParams, makeSelectIncidentsCount };
