import { createSelector } from 'reselect';

/**
 * Direct selector to the ktoContainer state domain
 */
const selectKtoContainerDomain = state => state.ktoContainer;

/**
 * Other specific selectors
 */

/**
 * Default selector used by KtoContainer
 */

const makeSelectKtoContainer = () =>
  createSelector(
    selectKtoContainerDomain,
    substate => substate,
  );

export default makeSelectKtoContainer;
export { selectKtoContainerDomain };
