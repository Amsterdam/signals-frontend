import { createSelector } from 'reselect';

/**
 * Direct selector to the incidentSplitContainer state domain
 */
const selectIncidentDomain = (state) => state.get('incident');

/**
 * Other specific selectors
 */


/**
 * Default selector used by IncidentSplitContainer
 */

const makeSelectIncidentModel = () => createSelector(
  selectIncidentDomain,
  (substate) => substate.toJS()
);

export default makeSelectIncidentModel;
export {
  selectIncidentDomain,
};
