import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the overviewPage state domain
 */
export const selectOverviewPageDomain = state =>
  state.get('incidentOverviewPage') || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OverviewPage
 */

export const makeSelectOverviewPage = createSelector(
  selectOverviewPageDomain,
  substate => substate.toJS()
);

export const makeSelectIncidentsCount = createSelector(
  selectOverviewPageDomain,
  state => {
    const obj = state.toJS();

    return obj.incidentsCount;
  }
);

export const makeSelectSearchQuery = createSelector(
  selectOverviewPageDomain,
  state => {
    const obj = state.toJS();

    return obj.searchQuery;
  }
);
