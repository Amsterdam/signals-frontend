import { createSelector } from 'reselect';

/**
 * Direct selector to the mapContainer state domain
 */
const selectMapContainerDomain = (state) => state.get('mapContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by MapContainer
 */

const makeSelectMapContainer = () => createSelector(
  selectMapContainerDomain,
  (substate) => substate.toJS()
);

export default makeSelectMapContainer;
export {
  selectMapContainerDomain,
};
