// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable';
import rolesReducer, { initialState } from './reducer';

import {
  FETCH_ROLES,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_ERROR,
  FETCH_PERMISSIONS,
  FETCH_PERMISSIONS_SUCCESS,
  FETCH_PERMISSIONS_ERROR,
  SAVE_ROLE,
  SAVE_ROLE_SUCCESS,
  SAVE_ROLE_ERROR,
  PATCH_ROLE,
  PATCH_ROLE_SUCCESS,
  PATCH_ROLE_ERROR,
  RESET_RESPONSE,
}
  from './constants';

describe('rolesReducer', () => {
  it('returns the initial state', () => {
    expect(rolesReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  it('FETCH_ROLES', () => {
    expect(
      rolesReducer(undefined, {
        type: FETCH_ROLES,
      }).toJS()
    ).toEqual({
      list: [],
      permissions: [],
      loading: true,
      loadingPermissions: false,
      saving: false,
      patching: false,
      error: false,
      responseSuccess: false,
      responseError: false,
    });
  });

  it('FETCH_ROLES_SUCCESS', () => {
    const payload = [{ id: 42 }];
    expect(
      rolesReducer(undefined, {
        type: FETCH_ROLES_SUCCESS,
        payload,
      }).toJS()
    ).toEqual({
      list: payload,
      permissions: [],
      loading: false,
      loadingPermissions: false,
      saving: false,
      patching: false,
      error: false,
      responseSuccess: false,
      responseError: false,
    });
  });

  it('FETCH_ROLES_ERROR', () => {
    expect(
      rolesReducer(undefined, {
        type: FETCH_ROLES_ERROR,
      }).toJS()
    ).toEqual({
      list: [],
      permissions: [],
      loading: false,
      loadingPermissions: false,
      saving: false,
      patching: false,
      error: true,
      responseSuccess: false,
      responseError: false,
    });
  });

  it('FETCH_PERMISSIONS', () => {
    expect(
      rolesReducer(undefined, {
        type: FETCH_PERMISSIONS,
      }).toJS()
    ).toEqual({
      list: [],
      permissions: [],
      loading: false,
      loadingPermissions: true,
      saving: false,
      patching: false,
      error: false,
      responseSuccess: false,
      responseError: false,
    });
  });

  it('FETCH_PERMISSIONS_SUCCESS', () => {
    const payload = [{ id: 142 }];
    expect(
      rolesReducer(undefined, {
        type: FETCH_PERMISSIONS_SUCCESS,
        payload,
      }).toJS()
    ).toEqual({
      list: [],
      permissions: payload,
      loading: false,
      loadingPermissions: false,
      saving: false,
      patching: false,
      error: false,
      responseSuccess: false,
      responseError: false,
    });
  });

  it('FETCH_PERMISSIONS_ERROR', () => {
    expect(
      rolesReducer(undefined, {
        type: FETCH_PERMISSIONS_ERROR,
      }).toJS()
    ).toEqual({
      list: [],
      permissions: [],
      loading: false,
      loadingPermissions: false,
      saving: false,
      patching: false,
      error: true,
      responseSuccess: false,
      responseError: false,
    });
  });

  it('SAVE_ROLE', () => {
    expect(
      rolesReducer(undefined, {
        type: SAVE_ROLE,
      }).toJS()
    ).toEqual({
      list: [],
      permissions: [],
      loading: false,
      loadingPermissions: false,
      saving: true,
      patching: false,
      error: false,
      responseSuccess: false,
      responseError: false,
    });
  });

  it('SAVE_ROLE_SUCCESS', () => {
    expect(
      rolesReducer(fromJS({ list: [{ id: 42 }] }), {
        type: SAVE_ROLE_SUCCESS,
        payload: { id: 43 },
      }).toJS()
    ).toEqual({
      list: [{ id: 42 }, { id: 43 }],
      saving: false,
      responseSuccess: true,
      responseError: false,
    });
  });

  it('SAVE_ROLE_ERROR', () => {
    expect(
      rolesReducer(undefined, {
        type: SAVE_ROLE_ERROR,
      }).toJS()
    ).toEqual({
      list: [],
      permissions: [],
      loading: false,
      loadingPermissions: false,
      saving: false,
      patching: false,
      error: false,
      responseSuccess: false,
      responseError: true,
    });
  });

  it('PATCH_ROLE', () => {
    expect(
      rolesReducer(undefined, {
        type: PATCH_ROLE,
      }).toJS()
    ).toEqual({
      list: [],
      permissions: [],
      loading: false,
      loadingPermissions: false,
      saving: false,
      patching: true,
      error: false,
      responseSuccess: false,
      responseError: false,
    });
  });

  it('PATCH_ROLE_SUCCESS with matching id', () => {
    expect(
      rolesReducer(fromJS({ list: [{ id: 41 }, { id: 42, name: 'foo' }, { id: 43 }] }), {
        type: PATCH_ROLE_SUCCESS,
        payload: { id: 42, name: 'bar' },
      }).toJS()
    ).toEqual({
      list: [{ id: 41 }, { id: 42, name: 'bar' }, { id: 43 }],
      patching: false,
      responseSuccess: true,
      responseError: false,
    });
  });

  it('PATCH_ROLE_SUCCESS with non matching id', () => {
    expect(
      rolesReducer(fromJS({ list: [{ id: 41 }, { id: 42 }, { id: 43 }] }), {
        type: PATCH_ROLE_SUCCESS,
        payload: { id: 666, name: 'bar' },
      }).toJS()
    ).toEqual({
      list: [{ id: 41 }, { id: 42 }, { id: 43 }],
      patching: false,
      responseSuccess: true,
      responseError: false,
    });
  });

  it('PATCH_ROLE_ERROR', () => {
    expect(
      rolesReducer(undefined, {
        type: PATCH_ROLE_ERROR,
      }).toJS()
    ).toEqual({
      list: [],
      permissions: [],
      loading: false,
      loadingPermissions: false,
      saving: false,
      patching: false,
      error: false,
      responseSuccess: false,
      responseError: true,
    });
  });

  it('RESET_RESPONSE', () => {
    expect(
      rolesReducer(undefined, {
        type: RESET_RESPONSE,
      }).toJS()
    ).toEqual({
      list: [],
      permissions: [],
      loading: false,
      loadingPermissions: false,
      saving: false,
      patching: false,
      error: false,
      responseSuccess: false,
      responseError: false,
    });
  });
});
