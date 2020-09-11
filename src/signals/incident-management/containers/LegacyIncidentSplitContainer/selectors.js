import { createSelector } from 'reselect';

/**
 * Direct selector to the incidentSplitContainer state domain
 */
const selectIncidentSplitContainerDomain = state => state.get('incidentSplitContainer');

/**
 * Other specific selectors
 */

/**
 * Default selector used by LegacyIncidentSplitContainer
 */

const makeSelectIncidentSplitContainer = () => createSelector(
  selectIncidentSplitContainerDomain,
  substate => substate.toJS()
);

export default makeSelectIncidentSplitContainer;
export {
  selectIncidentSplitContainerDomain,
};
