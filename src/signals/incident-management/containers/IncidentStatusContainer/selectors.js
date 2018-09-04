import { createSelector } from 'reselect';

/**
 * Direct selector to the incidentStatusContainer state domain
 */
const selectIncidentStatusContainerDomain = (state) => state.get('incidentStatusContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by IncidentStatusContainer
 */

const makeSelectIncidentStatusContainer = () => createSelector(
  selectIncidentStatusContainerDomain,
  (substate) => substate.toJS()
);

export default makeSelectIncidentStatusContainer;
