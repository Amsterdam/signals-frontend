import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the history state domain
 */
const selectHistoryDomain = state => state.get('history') || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by history
 */

const makeSelectHistoryModel = () => createSelector(
  selectHistoryDomain,
  substate => substate.toJS()
);

export default makeSelectHistoryModel;
export { selectHistoryDomain };
