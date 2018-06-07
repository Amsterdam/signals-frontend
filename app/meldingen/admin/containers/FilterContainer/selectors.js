import { createSelector } from 'reselect';

/**
 * Direct selector to the filterContainer state domain
 */
const selectFilterContainerDomain = (state) => state.get('filterContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by FilterContainer
 */

const makeSelectFilterContainer = () => createSelector(
  selectFilterContainerDomain,
  (substate) => substate.toJS()
);

export default makeSelectFilterContainer;
export {
  selectFilterContainerDomain,
};
