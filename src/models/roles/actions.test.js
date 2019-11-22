import { testActionCreator } from 'test/utils';

import {
  FETCH_ROLES,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_ERROR,
  SAVE_ROLE,
  SAVE_ROLE_SUCCESS,
  SAVE_ROLE_ERROR,
  PATCH_ROLE,
  PATCH_ROLE_SUCCESS,
  PATCH_ROLE_ERROR,
}
  from './constants';

import {
  fetchRoles,
  fetchRolesSuccess,
  fetchRolesError,
  saveRole,
  saveRoleSuccess,
  saveRoleError,
  patchRole,
  patchRoleSuccess,
  patchRoleError,
} from './actions';


describe('Incident roles model actions', () => {
  it('should be fetched', () => {
    const payload = { results: [{ id: 42 }] };
    testActionCreator(fetchRoles, FETCH_ROLES);
    testActionCreator(fetchRolesSuccess, FETCH_ROLES_SUCCESS, payload);
    testActionCreator(fetchRolesError, FETCH_ROLES_ERROR, true);
  });

  it('should be created', () => {
    const payload = { id: 42 };
    testActionCreator(saveRole, SAVE_ROLE, payload);
    testActionCreator(saveRoleSuccess, SAVE_ROLE_SUCCESS, payload);
    testActionCreator(saveRoleError, SAVE_ROLE_ERROR);
  });

  it('should be patched', () => {
    const payload = { id: 42, patch: { foo: 'bar' } };
    testActionCreator(patchRole, PATCH_ROLE);
    testActionCreator(patchRoleSuccess, PATCH_ROLE_SUCCESS, payload);
    testActionCreator(patchRoleError, PATCH_ROLE_ERROR);
  });
});
