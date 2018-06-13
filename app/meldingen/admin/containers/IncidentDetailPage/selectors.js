import { createSelector } from 'reselect';

/**
 * Direct selector to the incidentDetailPage state domain
 */
const selectIncidentDetailPageDomain = (state) => state.get('incidentDetailPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by IncidentDetailPage
 */

const makeSelectIncidentDetailPage = () => createSelector(
  selectIncidentDetailPageDomain,
  (substate) => substate.toJS()
);

export default makeSelectIncidentDetailPage;
export {
  selectIncidentDetailPageDomain,
};
