import { createSelector } from 'reselect';

/**
 * Direct selector to the IncidentCategoryContainer state domain
 */
const selectIncidentCategoryContainerDomain = (state) => state.get('incidentCategoryContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by IncidentCategoryContainer
 */

const makeSelectIncidentCategoryContainer = () => createSelector(
  selectIncidentCategoryContainerDomain,
  (substate) => substate.toJS()
);

export default makeSelectIncidentCategoryContainer;

export {
  selectIncidentCategoryContainerDomain,
};
