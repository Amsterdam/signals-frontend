import { fromJS } from 'immutable';
import cloneDeep from 'lodash.clonedeep';

import userJson from 'utils/__tests__/fixtures/user.json';

import { initialState } from './reducer';
import {
  makeSelectError,
  makeSelectLoading,
  makeSelectNotification,
  makeSelectUserCan,
  makeSelectUserCanAccess,
  makeSelectUserPermissions,
  makeSelectUserPermissionCodeNames,
  selectGlobal,
  makeSelectSearchQuery,
  makeSelectSources,
} from './selectors';

const sources = [
  {
    id: 1,
    name: 'Source1',
  },
  {
    id: 2,
    name: 'Source2',
  },
];
const selectedSources = [
  {
    key: '1',
    value: 'Source1',
  },
  {
    key: '2',
    value: 'Source2',
  },
];

describe('containers/App/selectors', () => {
  describe('selectGlobal', () => {
    it('should return the initialState', () => {
      expect(selectGlobal()).toEqual(initialState);
    });

    it('should select the global state', () => {
      const globalState = fromJS({});
      const mockedState = fromJS({
        global: globalState,
      });
      expect(selectGlobal(mockedState)).toEqual(globalState);
    });
  });

  describe('makeSelectLoading', () => {
    const loadingSelector = makeSelectLoading();
    it('should select the loading', () => {
      const loading = false;
      const mockedState = fromJS({
        global: {
          loading,
        },
      });
      expect(loadingSelector(mockedState)).toEqual(loading);
    });
  });

  describe('makeSelectError', () => {
    const errorSelector = makeSelectError();
    it('should select the error', () => {
      const error = true;
      const mockedState = fromJS({
        global: {
          error,
        },
      });
      expect(errorSelector(mockedState)).toEqual(error);
    });
  });

  describe('makeSelectNotification', () => {
    const notificationSelector = makeSelectNotification();

    it('should select the notification', () => {
      const notification = {
        title: 'Foo bar',
        message: 'Qux',
        type: 'error',
        variant: 'global',
      };

      const mockedState = fromJS({
        global: {
          notification,
        },
      });

      expect(notificationSelector(mockedState)).toEqual(notification);
    });
  });

  describe('permissions', () => {
    const state = fromJS({
      global: {
        ...initialState.toJS(),
        user: userJson,
      },
    });

    const regularUserState = fromJS({
      global: {
        ...initialState.toJS(),
        user: {
          ...userJson,
          is_superuser: false,
        },
      },
    });

    describe('makeSelectUserPermissions', () => {
      it('should return an empty list', () => {
        expect(makeSelectUserPermissions(initialState)).toEqual([]);
      });

      it("should return a list of a user's permissions", () => {
        expect(makeSelectUserPermissions(state)).toHaveLength(16);
      });
    });

    describe('makeSelectUserPermissionCodeNames', () => {
      it('should return a list of strings', () => {
        const codenames = makeSelectUserPermissionCodeNames(state);

        userJson.roles
          .flatMap(role => role.permissions)
          .concat(userJson.permissions)
          .forEach(({ codename }) => {
            expect(codenames.includes(codename)).toEqual(true);
          });
      });
    });

    describe('makeSelectUserCan', () => {
      const doSomething = userJson.permissions[0].codename;
      const cannotDoSomething = `${userJson.permissions[0].codename}97ysadfysd87f`;

      it('should always allow for superuser', () => {
        const superUserCan = makeSelectUserCan(state);

        expect(superUserCan(doSomething)).toEqual(true);
        expect(superUserCan(cannotDoSomething)).toEqual(true);
      });

      it('should return a boolean', () => {
        const regularUserCan = makeSelectUserCan(regularUserState);

        expect(regularUserCan(doSomething)).toEqual(true);
        expect(regularUserCan(cannotDoSomething)).toEqual(false);
      });
    });

    describe('makeSelectUserCanAccess', () => {
      const settings = 'settings';
      const groups = 'groups';
      const users = 'users';
      const someOtherSection = 'some_other_section';
      const userSectionPermissions = ['view_user', 'add_user', 'change_user'];
      const groupSectionPermissions = ['view_group', 'change_group', 'add_group'];

      const superUserCanAccess = makeSelectUserCanAccess(state);
      const regularUserCanAccess = makeSelectUserCanAccess(regularUserState);

      it('should always allow for superuser', () => {
        expect(superUserCanAccess(settings)).toEqual(true);
        expect(superUserCanAccess(someOtherSection)).toEqual(true);
      });

      it('should disallow for invalid section', () => {
        expect(regularUserCanAccess(settings)).toEqual(true);
        expect(regularUserCanAccess(groups)).toEqual(true);
        expect(regularUserCanAccess(users)).toEqual(true);
        expect(regularUserCanAccess(someOtherSection)).toEqual(false);
      });

      it('should require at least one permission per section', () => {
        const userWithLimitedPermissions = cloneDeep(userJson);
        const limitedUserState = fromJS({
          global: {
            ...initialState.toJS(),
            user: {
              ...userWithLimitedPermissions,
              is_superuser: false,
            },
          },
        });

        expect(makeSelectUserCanAccess(limitedUserState)(users)).toEqual(true);

        // remove one of the requires permissions to have access to the user section
        userWithLimitedPermissions.permissions.splice(
          userWithLimitedPermissions.permissions.findIndex(({ codename }) => codename === userSectionPermissions[0]),
          1
        );

        const limitedUserState2 = fromJS({
          global: {
            ...initialState.toJS(),
            user: {
              ...userWithLimitedPermissions,
              is_superuser: false,
            },
          },
        });

        expect(makeSelectUserCanAccess(limitedUserState2)(users)).toEqual(true);

        // remove another one
        userWithLimitedPermissions.permissions.splice(
          userWithLimitedPermissions.permissions.findIndex(({ codename }) => codename === userSectionPermissions[1]),
          1
        );

        const limitedUserState3 = fromJS({
          global: {
            ...initialState.toJS(),
            user: {
              ...userWithLimitedPermissions,
              is_superuser: false,
            },
          },
        });

        expect(makeSelectUserCanAccess(limitedUserState3)(users)).toEqual(true);

        // remove the last one
        userWithLimitedPermissions.permissions.splice(
          userWithLimitedPermissions.permissions.findIndex(({ codename }) => codename === userSectionPermissions[1]),
          1
        );

        const limitedUserState4 = fromJS({
          global: {
            ...initialState.toJS(),
            user: {
              ...userWithLimitedPermissions,
              is_superuser: false,
            },
          },
        });

        expect(makeSelectUserCanAccess(limitedUserState4)(users)).toEqual(false);
      });

      it('should require at least one permission per section category', () => {
        // The 'settings' section contains more than one overpage and detail page and thus requires
        // permissions fromt both 'groups' and 'users'. To be able to access 'settings', a user
        // needs at least one permission in both 'groups' and 'users'.

        const userWithLimitedPermissions = cloneDeep(userJson);

        // remove all required permissions but one
        userWithLimitedPermissions.permissions = userWithLimitedPermissions.permissions.filter(
          ({ codename }) => codename === userSectionPermissions[0] || codename === groupSectionPermissions[0]
        );

        const limitedUserState = fromJS({
          global: {
            ...initialState.toJS(),
            user: {
              ...userWithLimitedPermissions,
              is_superuser: false,
            },
          },
        });

        expect(makeSelectUserCanAccess(limitedUserState)(settings)).toEqual(true);

        // remove last required permission
        userWithLimitedPermissions.permissions = userWithLimitedPermissions.permissions.filter(
          ({ codename }) => codename === groupSectionPermissions[0]
        );

        const limitedUserState2 = fromJS({
          global: {
            ...initialState.toJS(),
            user: {
              ...userWithLimitedPermissions,
              is_superuser: false,
            },
          },
        });

        expect(makeSelectUserCanAccess(limitedUserState2)(settings)).toEqual(false);
      });
    });
  });

  describe('makeSelectSearchQuery', () => {
    const selectSearchSelector = makeSelectSearchQuery;
    it('should select the searchQuery', () => {
      const searchQuery = '12345';
      const mockedState = fromJS({
        global: {
          searchQuery,
        },
      });
      expect(selectSearchSelector(mockedState)).toEqual(searchQuery);
    });
  });

  it('should select sources', () => {
    const state = fromJS({ ...initialState.toJS(), sources });
    const result = makeSelectSources.resultFunc(state);

    expect(result.length).toEqual(sources.length);
    expect(result[0]).toMatchObject(selectedSources[0]);
    expect(result[1]).toMatchObject(selectedSources[1]);
  });
});
