import { createSelector } from 'reselect';

/**
 * Direct selector to the incidentNotesContainer state domain
 */
const selectIncidentNotesContainerDomain = (state) => state.get('incidentNotesContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by IncidentNotesContainer
 */

const makeSelectIncidentNotesContainer = () => createSelector(
  selectIncidentNotesContainerDomain,
  (substate) => substate.toJS()
);

export default makeSelectIncidentNotesContainer;

export {
  selectIncidentNotesContainerDomain,
};
