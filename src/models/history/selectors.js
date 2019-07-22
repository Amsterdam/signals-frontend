import { createSelector } from 'reselect';

/**
 * Direct selector to the history state domain
 */
const selectHistoryDomain = state => state.history;

/**
 * Other specific selectors
 */

/**
 * Default selector used by history
 */

const makeSelectHistoryModel = () =>
  createSelector(
    selectHistoryDomain,
    substate => substate,
  );

export default makeSelectHistoryModel;
export { selectHistoryDomain };
