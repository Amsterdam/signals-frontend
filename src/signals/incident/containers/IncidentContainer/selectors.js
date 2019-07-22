import { createSelector } from 'reselect';

/**
 * Direct selector to the incidentContainer state domain
 */
const selectIncidentContainerDomain = state => state.incidentContainer;

/**
 * Other specific selectors
 */

/**
 * Default selector used by IncidentContainer
 */

const makeSelectIncidentContainer = () =>
  createSelector(
    selectIncidentContainerDomain,
    substate => substate,
  );

export default makeSelectIncidentContainer;
export { selectIncidentContainerDomain };
