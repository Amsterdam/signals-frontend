import { createSelector } from 'reselect';

/**
 * Direct selector to the incidentDetailPage state domain
 */
const selectIncidentDetailPageDomain = (state) => state.get('incidentDetailPage');

/**
 * Other specific selectors
 */
const selectRefresh = (id) =>
  createSelector(
    selectIncidentDetailPageDomain,
    (page) => page.get('id') !== id
  );


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
  selectRefresh
};
