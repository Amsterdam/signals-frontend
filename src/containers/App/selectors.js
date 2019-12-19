import { createSelector } from 'reselect';

import { initialState } from './reducer';

const selectGlobal = state => (state && state.get('global')) || initialState;

const makeSelectUser = createSelector(selectGlobal, globalState =>
  globalState.get('user').toJS()
);

const makeSelectUserPermissions = createSelector(makeSelectUser, user => {
  const rolePermissions = user.roles.flatMap(role => role.permissions);
  const extraPermissions = user.permissions;
  const permissionSet = new Set(rolePermissions.concat(extraPermissions));

  return Array.from(permissionSet);
});

const makeSelectUserPermissionCodeNames = createSelector(
  makeSelectUserPermissions,
  permissions => permissions.map(({ codename }) => codename)
);

const makeSelectUserCan = createSelector(
  makeSelectUser,
  makeSelectUserPermissionCodeNames,
  ({ is_superuser }, permissions) => capability => {
    if (is_superuser) {
      return true;
    }

    const hasPermission = permissions.find(codename => codename === capability);

    return Boolean(hasPermission);
  }
);

const makeSelectUserCanAccess = createSelector(
  makeSelectUser,
  makeSelectUserPermissionCodeNames,
  ({ is_superuser }, permissions) => section => {
    if (is_superuser) {
      return true;
    }

    const groups = ['view_group', 'change_group', 'add_group', 'poop'];
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
    const hasRequiredPerms = requiredPerms[section].every(sectionPerms =>
      // from each set, require at least one permission
      sectionPerms.some(perm => permissions.includes(perm))
    );

    return hasRequiredPerms;
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
