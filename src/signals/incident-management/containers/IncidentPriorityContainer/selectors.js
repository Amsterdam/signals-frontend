import { createSelector } from 'reselect';

/**
 * Direct selector to the IncidentPriorityContainer state domain
 */
const selectIncidentPriorityContainerDomain = (state) => state.get('incidentPriorityContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by IncidentPriorityContainer
 */

const makeSelectIncidentPriorityContainer = () => createSelector(
  selectIncidentPriorityContainerDomain,
  (substate) => substate.toJS()
);

export default makeSelectIncidentPriorityContainer;

export {
  selectIncidentPriorityContainerDomain,
};
