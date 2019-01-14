import { createSelector } from 'reselect';

/**
 * Direct selector to the dashboard state domain
 */
const selectDashboardContainerDomain = (state) => state.get('incidentDashboardContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Dashboard
 */

const makeSelectDashboardContainer = () => createSelector(
  selectDashboardContainerDomain,
  (substate) => substate.toJS()
);

export default makeSelectDashboardContainer;
export {
  selectDashboardContainerDomain,
};
