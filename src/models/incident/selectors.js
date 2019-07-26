import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the incidentSplitContainer state domain
 */
const selectIncidentDomain = state => state.incidentModel || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by IncidentSplitContainer
 */

const makeSelectIncidentModel = () =>
  createSelector(
    selectIncidentDomain,
    substate => substate
  );

export default makeSelectIncidentModel;
export { selectIncidentDomain };
