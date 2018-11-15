import { createSelector } from 'reselect';

/**
 * Direct selector to the incidentHistoryContainer state domain
 */
const selectIncidentHistoryContainerDomain = (state) => state.get('incidentHistoryContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by IncidentHistoryContainer
 */

const makeSelectIncidentHistoryContainer = () => createSelector(
  selectIncidentHistoryContainerDomain,
  (substate) => substate.toJS()
);

export default makeSelectIncidentHistoryContainer;

export {
  selectIncidentHistoryContainerDomain,
};
