import { fromJS } from 'immutable';
import rolesReducer, { initialState } from './reducer';

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
      loading: true,
      saving: false,
      patching: false,
      error: false,
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
      loading: false,
      saving: false,
      patching: false,
      error: false,
    });
  });

  it('FETCH_ROLES_ERROR', () => {
    expect(
      rolesReducer(undefined, {
        type: FETCH_ROLES_ERROR,
      }).toJS()
    ).toEqual({
      list: [],
      loading: false,
      saving: false,
      patching: false,
      error: true,
    });
  });

  it('SAVE_ROLE', () => {
    expect(
      rolesReducer(undefined, {
        type: SAVE_ROLE,
      }).toJS()
    ).toEqual({
      list: [],
      loading: false,
      saving: true,
      patching: false,
      error: false,
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
      error: false,
    });
  });

  it('SAVE_ROLE_ERROR', () => {
    expect(
      rolesReducer(undefined, {
        type: SAVE_ROLE_ERROR,
      }).toJS()
    ).toEqual({
      list: [],
      loading: false,
      saving: false,
      patching: false,
      error: true,
    });
  });

  it('PATCH_ROLE', () => {
    expect(
      rolesReducer(undefined, {
        type: PATCH_ROLE,
      }).toJS()
    ).toEqual({
      list: [],
      loading: false,
      saving: false,
      patching: true,
      error: false,
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
      error: false,
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
      error: false,
    });
  });

  it('PATCH_ROLE_ERROR', () => {
    expect(
      rolesReducer(undefined, {
        type: PATCH_ROLE_ERROR,
      }).toJS()
    ).toEqual({
      list: [],
      loading: false,
      saving: false,
      patching: false,
      error: true,
    });
  });
});
