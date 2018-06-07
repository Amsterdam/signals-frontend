import { createSelector } from 'reselect';

/**
 * Direct selector to the listContainer state domain
 */
const selectListContainerDomain = (state) => state.get('listContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ListContainer
 */

const makeSelectListContainer = () => createSelector(
  selectListContainerDomain,
  (substate) => substate.toJS()
);

export default makeSelectListContainer;
export {
  selectListContainerDomain,
};
