import { createSelector } from 'reselect';

/**
 * Direct selector to the incidentSplitContainer state domain
 */
const selectNotesModelDomain = (state) => state.get('notesModel');

/**
 * Other specific selectors
 */


/**
 * Default selector used by IncidentSplitContainer
 */

const makeSelectNotesModel = () => createSelector(
  selectNotesModelDomain,
  (substate) => substate.toJS()
);

export default makeSelectNotesModel;
export {
  selectNotesModelDomain,
};
