import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the overviewPage state domain
 */
const selectOverviewPageDomain = (state) =>
  state.get('incidentOverviewPage') || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OverviewPage
 */

const makeSelectOverviewPage = () =>
  createSelector(
    selectOverviewPageDomain,
    (substate) => substate.toJS(),
  );

const makeSelectIncidentsCount = createSelector(
  selectOverviewPageDomain,
  (state) => {
    if (!state) return state;

    const obj = state.toJS();

    return obj.incidentsCount;
  },
);

const makeSelectFilterParams = () =>
  createSelector(
    selectOverviewPageDomain,
    (substate) => {
      const state = substate.toJS();
      const filter = state.filter || {};
      return { name: filter.name, ...filter.options, page: state.page, ordering: state.sort };
    },
  );

export default makeSelectOverviewPage;
export {
  selectOverviewPageDomain,
  makeSelectFilterParams,
  makeSelectIncidentsCount,
};

export const makeSelectAllFilters = createSelector(
  selectOverviewPageDomain,
  (stateMap) => {
    const state = stateMap.toJS();

    return state.allFilters;
  },
);

export const makeSelectFilter = createSelector(
  selectOverviewPageDomain,
  (stateMap) => {
    const state = stateMap.toJS();

    return state.filter;
  },
);

export const makeSelectRemovedFilter = createSelector(
  selectOverviewPageDomain,
  (stateMap) => {
    const state = stateMap.toJS();

    return state.removedFilter;
  },
);
