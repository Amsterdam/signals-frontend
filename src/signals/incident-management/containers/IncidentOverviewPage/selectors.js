import { createSelector } from 'reselect';

/**
 * Direct selector to the overviewPage state domain
 */
const selectOverviewPageDomain = state => state.incidentOverviewPage;

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
      return { ...state.filter, page: state.page, ordering: state.sort };
    },
  );

export default makeSelectOverviewPage;
export { selectOverviewPageDomain, makeSelectFilterParams, makeSelectIncidentsCount };
