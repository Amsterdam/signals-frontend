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
    substate => substate,
  );

const makeSelectFilterParams = () =>
  createSelector(
    selectOverviewPageDomain,
    substate => {
      const state = substate;
      return { ...state.filter, page: state.page, ordering: state.sort };
    },
  );

export default makeSelectOverviewPage;
export { selectOverviewPageDomain, makeSelectFilterParams };
