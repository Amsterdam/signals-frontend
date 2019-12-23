import { createSelector } from 'reselect';

import { initialState } from './reducer';

const selectGlobal = state => (state && state.get('global')) || initialState;

const makeSelectUser = createSelector(selectGlobal, globalState =>
  globalState.get('user').toJS()
);

/**
 * Selector that returns the list of permissions for the current user
 *
 * @returns {Object[]} - All permissions from assigned roles combined with extra permissions
 */
const makeSelectUserPermissions = createSelector(makeSelectUser, user => {
  const permissionMap = new Map();

  user.roles
    .flatMap(role => role.permissions)
    .concat(user.permissions)
    .forEach(perm => {
      permissionMap.set(perm.id, perm);
    });

  return Array.from(permissionMap.values());
});

/**
 * Selector that returns the list of permission codes for the current user
 *
 * @returns {String[]} - All permissions from assigned roles combined with extra permissions
 */
const makeSelectUserPermissionCodeNames = createSelector(
  makeSelectUserPermissions,
  permissions => permissions.map(({ codename }) => codename)
);

/**
 * Selector that queries the user's permissions and returna a boolean
 * when that permission is present.
 */
const makeSelectUserCan = createSelector(
  [makeSelectUser, makeSelectUserPermissionCodeNames],
  ({ is_superuser }, permissions) =>
    /**
     * @param {String} capability - The permission to check for
     */
    capability => {
      if (is_superuser !== false) {
        return is_superuser;
      }

      return Boolean(permissions.find(codename => codename === capability));
    }
);

/**
 * Selector that queries a subset of the user's permissions. Useful for determining
 * if a user should have access to a specific section of the application.
 */
const makeSelectUserCanAccess = createSelector(
  [makeSelectUser, makeSelectUserPermissionCodeNames],
  ({ is_superuser }, permissions) =>
    /**
     * @param {String} section - The set of permissions to check for
     */
    section => {
      if (is_superuser !== false) {
        return is_superuser;
      }

      const groups = ['view_group', 'change_group', 'add_group'];
      const users = ['view_user', 'add_user', 'change_user'];

      const requiredPerms = {
        settings: [groups, users],
        groups: [groups],
        users: [users],
      };

      if (!Object.keys(requiredPerms).includes(section)) {
        return false;
      }

      // require all sets of permissions
      return requiredPerms[section].every(sectionPerms =>
        // from each set, require at least one permission
        sectionPerms.some(perm => permissions.includes(perm))
      );
    }
);

const makeSelectLoading = () =>
  createSelector(selectGlobal, globalState => globalState.get('loading'));

const makeSelectError = () =>
  createSelector(selectGlobal, globalState => globalState.get('error'));

const makeSelectNotification = () =>
  createSelector(selectGlobal, globalState =>
    globalState.get('notification').toJS()
  );

const makeSelectCategories = () =>
  createSelector(selectGlobal, globalState =>
    globalState.get('categories').toJS()
  );

export {
  makeSelectCategories,
  makeSelectError,
  makeSelectLoading,
  makeSelectNotification,
  makeSelectUser,
  makeSelectUserCan,
  makeSelectUserCanAccess,
  makeSelectUserPermissionCodeNames,
  makeSelectUserPermissions,
  selectGlobal,
};
