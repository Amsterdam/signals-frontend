import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the roles state domain
 */
const selectRolesDomain = state => state.get('roles') || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by roles
 */

const makeSelectRolesModel = createSelector(
  selectRolesDomain,
  substate => substate.toJS(),
);

export default makeSelectRolesModel;
