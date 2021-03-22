import cloneDeep from 'lodash.clonedeep';
import type { ApplicationRootState } from 'types';

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
import type { AppState, Role, User } from './types';

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
    key: 'Source1',
    value: 'Source1',
  },
  {
    key: 'Source2',
    value: 'Source2',
  },
];

describe('containers/App/selectors', () => {
  const globalState: AppState = initialState;
  let state: Partial<ApplicationRootState>;

  beforeEach(() => {
    state = {
      global: globalState,
    };
  });

  describe('selectGlobal', () => {
    it('should return the initialState', () => {
      expect(selectGlobal()).toEqual(initialState);
    });

    it('should select the global state', () => {
      expect(selectGlobal(state)).toEqual(globalState);
    });
  });

  describe('makeSelectLoading', () => {
    const loadingSelector = makeSelectLoading();
    it('should select the loading', () => {
      const loading = false;
      const mockedState = {
        ...state,
        global: {
          ...globalState,
          loading,
        },
      };
      expect(loadingSelector(mockedState)).toEqual(loading);
    });
  });

  describe('makeSelectError', () => {
    const errorSelector = makeSelectError();
    it('should select the error', () => {
      const error = true;
      const mockedState = {
        ...state,
        global: {
          ...globalState,
          error,
        },
      };
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

      const mockedState = {
        ...state,
        global: {
          ...globalState,
          notification,
        },
      };

      expect(notificationSelector(mockedState)).toEqual(notification);
    });
  });

  describe('permissions', () => {
    const mockedState = {
      ...state,
      global: {
        ...globalState,
        user: userJson,
      },
    };

    const regularUserState = {
      ...state,
      global: {
        ...globalState,
        user: {
          ...userJson,
          is_superuser: false,
        },
      },
    };

    describe('makeSelectUserPermissions', () => {
      it('should return an empty list', () => {
        expect(makeSelectUserPermissions(state)).toEqual([]);
      });

      it("should return a list of a user's permissions", () => {
        expect(makeSelectUserPermissions(mockedState)).toHaveLength(16);
      });
    });

    describe('makeSelectUserPermissionCodeNames', () => {
      it('should return a list of strings', () => {
        const codenames = makeSelectUserPermissionCodeNames(mockedState);

        userJson.roles
          .flatMap<Role>(role => role.permissions)
          .concat(userJson.permissions ?? [])
          .forEach(({ codename }: Role) => {
            expect(codenames.includes(codename)).toEqual(true);
          });
      });
    });

    describe('makeSelectUserCan', () => {
      const doSomething = userJson.permissions[0].codename;
      const cannotDoSomething = `${userJson.permissions[0].codename}97ysadfysd87f`;

      it('should always allow for superuser', () => {
        const superUserCan = makeSelectUserCan(mockedState);

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

      const superUserCanAccess = makeSelectUserCanAccess(mockedState);
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const userWithLimitedPermissions: User = cloneDeep(userJson);
        const limitedUserState: ApplicationRootState = {
          ...state,
          global: {
            ...globalState,
            user: {
              ...userWithLimitedPermissions,
              is_superuser: false,
            },
          },
        };

        expect(makeSelectUserCanAccess(limitedUserState)(users)).toEqual(true);

        // remove one of the required permissions to have access to the user section
        userWithLimitedPermissions.permissions.splice(
          userWithLimitedPermissions.permissions.findIndex(({ codename }) => codename === userSectionPermissions[0]),
          1
        );

        const limitedUserState2 = {
          ...state,
          global: {
            ...globalState,
            user: {
              ...userWithLimitedPermissions,
              is_superuser: false,
            },
          },
        };

        expect(makeSelectUserCanAccess(limitedUserState2)(users)).toEqual(true);

        // remove another one
        userWithLimitedPermissions.permissions.splice(
          userWithLimitedPermissions.permissions.findIndex(({ codename }) => codename === userSectionPermissions[1]),
          1
        );

        const limitedUserState3 = {
          ...state,
          global: {
            ...globalState,
            user: {
              ...userWithLimitedPermissions,
              is_superuser: false,
            },
          },
        };

        expect(makeSelectUserCanAccess(limitedUserState3)(users)).toEqual(true);

        // remove the last one
        userWithLimitedPermissions.permissions.splice(
          userWithLimitedPermissions.permissions.findIndex(({ codename }) => codename === userSectionPermissions[1]),
          1
        );

        const limitedUserState4 = {
          ...state,
          global: {
            ...globalState,
            user: {
              ...userWithLimitedPermissions,
              is_superuser: false,
            },
          },
        };

        expect(makeSelectUserCanAccess(limitedUserState4)(users)).toEqual(false);
      });
    });
  });

  describe('makeSelectSearchQuery', () => {
    const selectSearchSelector = makeSelectSearchQuery;
    it('should select the searchQuery', () => {
      const searchQuery = '12345';
      const mockedState = {
        ...state,
        global: {
          ...globalState,
          searchQuery,
        },
      };

      expect(selectSearchSelector(mockedState)).toEqual(searchQuery);
    });
  });

  it('should select sources', () => {
    const mockedState = { ...globalState, sources };
    const result = makeSelectSources.resultFunc(mockedState) ?? [];

    expect(result.length).toEqual(sources.length);
    expect(result[0]).toMatchObject(selectedSources[0]);
    expect(result[1]).toMatchObject(selectedSources[1]);
  });
});
