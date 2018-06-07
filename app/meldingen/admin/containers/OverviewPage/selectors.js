import { createSelector } from 'reselect';

/**
 * Direct selector to the overviewPage state domain
 */
const selectOverviewPageDomain = (state) => state.get('overviewPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by OverviewPage
 */

const makeSelectOverviewPage = () => createSelector(
  selectOverviewPageDomain,
  (substate) => substate.toJS()
);

export default makeSelectOverviewPage;
export {
  selectOverviewPageDomain,
};
