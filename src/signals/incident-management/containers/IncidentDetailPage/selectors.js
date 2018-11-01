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

export const makeSelectIncidentNotesList = () => createSelector(
  selectIncidentDetailPageDomain,
  (substate) => substate.get('incidentNotesList').toJS()
);

export default makeSelectIncidentDetailPage;

export {
  selectIncidentDetailPageDomain,
  selectRefresh
};
