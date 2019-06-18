import { createSelector } from 'reselect';

/**
 * Direct selector to the history state domain
 */
const selectHistoryDomain = (state) => state.get('history');

/**
 * Other specific selectors
 */


/**
 * Default selector used by history
 */

const makeSelectHistoryModel = () => createSelector(
  selectHistoryDomain,
  (substate) => substate.toJS()
);

export default makeSelectHistoryModel;
export {
  selectHistoryDomain
};
