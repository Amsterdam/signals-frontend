import { createSelector } from 'reselect';

/**
 * Direct selector to the dashboard state domain
 */
const selectDashboardContainerDomain = state => state.incidentDashboardContainer;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Dashboard
 */

const makeSelectDashboardContainer = () =>
  createSelector(
    selectDashboardContainerDomain,
    substate => substate,
  );

export default makeSelectDashboardContainer;
export { selectDashboardContainerDomain };
