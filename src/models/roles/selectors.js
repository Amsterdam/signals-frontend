import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the roles state domain
 */
const selectRolesDomain = state => state.get('roles') || initialState;

/**
 * Other specific selectors
 */
export const inputRolesSelector = createSelector(
  selectRolesDomain,
  state => [
    { key: 'all', name: 'Alles', value: '*' },
    ...state.get('list').toJS().map(role => ({
      key: role.name,
      name: role.name,
      value: role.name,
    })),
  ]
);

/**
 * Default selector used by roles
 */

const rolesModelSelector = createSelector(
  selectRolesDomain,
  state => state.toJS(),
);

export default rolesModelSelector;
