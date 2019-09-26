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

export default makeSelectOverviewPage;
export { selectOverviewPageDomain, makeSelectIncidentsCount };
