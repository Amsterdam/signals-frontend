// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'

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
} from './constants'

export const initialState = fromJS({
  list: [],
  permissions: [],
  loading: false,
  loadingPermissions: false,
  saving: false,
  patching: false,
  error: false,
  responseSuccess: false,
  responseError: false,
})

function rolesReducer(state = initialState, action) {
  let roles = []
  let index = null
  switch (action.type) {
    case FETCH_ROLES:
      return state
        .set('error', false)
        .set('list', fromJS([]))
        .set('loading', true)
        .set('responseError', false)
        .set('responseSuccess', false)

    case FETCH_ROLES_SUCCESS:
      return state
        .set('list', fromJS(action.payload))
        .set('loading', false)
        .set('error', false)

    case FETCH_ROLES_ERROR:
      return state.set('error', true).set('loading', false)

    case FETCH_PERMISSIONS:
      return state
        .set('permissions', fromJS([]))
        .set('loadingPermissions', true)
        .set('error', false)

    case FETCH_PERMISSIONS_SUCCESS:
      return state
        .set('permissions', fromJS(action.payload))
        .set('loadingPermissions', false)
        .set('error', false)

    case FETCH_PERMISSIONS_ERROR:
      return state.set('error', true).set('loadingPermissions', false)

    case SAVE_ROLE:
      return state
        .set('saving', true)
        .set('responseSuccess', false)
        .set('responseError', false)

    case SAVE_ROLE_SUCCESS:
      roles = state.get('list').toJS()
      return state
        .set('list', fromJS([...roles, action.payload]))
        .set('saving', false)
        .set('responseSuccess', true)
        .set('responseError', false)

    case SAVE_ROLE_ERROR:
      return state
        .set('saving', false)
        .set('responseSuccess', false)
        .set('responseError', true)

    case PATCH_ROLE:
      return state
        .set('patching', true)
        .set('responseSuccess', false)
        .set('responseError', false)

    case PATCH_ROLE_SUCCESS:
      roles = state.get('list').toJS()
      index = roles.findIndex((role) => role.id === action.payload.id)
      if (index !== -1) {
        roles[index] = { ...action.payload }
      }

      return state
        .set('list', fromJS(roles))
        .set('patching', false)
        .set('responseSuccess', true)
        .set('responseError', false)

    case PATCH_ROLE_ERROR:
      return state
        .set('patching', false)
        .set('responseSuccess', false)
        .set('responseError', true)

    case RESET_RESPONSE:
      return state.set('responseSuccess', false).set('responseError', false)

    default:
      return state
  }
}

export default rolesReducer
