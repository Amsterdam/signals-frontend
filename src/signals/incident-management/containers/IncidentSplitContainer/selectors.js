import { createSelector } from 'reselect';

/**
 * Direct selector to the incidentSplitContainer state domain
 */
const selectIncidentSplitContainerDomain = state => state.incidentSplitContainer;

/**
 * Other specific selectors
 */

/**
 * Default selector used by IncidentSplitContainer
 */

const makeSelectIncidentSplitContainer = () =>
  createSelector(
    selectIncidentSplitContainerDomain,
    substate => substate,
  );

export default makeSelectIncidentSplitContainer;
export { selectIncidentSplitContainerDomain };
