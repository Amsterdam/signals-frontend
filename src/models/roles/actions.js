// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
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

export const fetchRoles = () => ({
  type: FETCH_ROLES,
});

export const fetchRolesSuccess = payload => ({
  type: FETCH_ROLES_SUCCESS,
  payload,
});

export const fetchRolesError = () => ({
  type: FETCH_ROLES_ERROR,
});

export const fetchPermissions = () => ({
  type: FETCH_PERMISSIONS,
});

export const fetchPermissionsSuccess = payload => ({
  type: FETCH_PERMISSIONS_SUCCESS,
  payload,
});

export const fetchPermissionsError = () => ({
  type: FETCH_PERMISSIONS_ERROR,
});

export const saveRole = payload => ({
  type: SAVE_ROLE,
  payload,
});

export const saveRoleSuccess = payload => ({
  type: SAVE_ROLE_SUCCESS,
  payload,
});

export const saveRoleError = () => ({
  type: SAVE_ROLE_ERROR,
});

export const patchRole = payload => ({
  type: PATCH_ROLE,
  payload,
});

export const patchRoleSuccess = payload => ({
  type: PATCH_ROLE_SUCCESS,
  payload,
});

export const patchRoleError = () => ({
  type: PATCH_ROLE_ERROR,
});

export const resetResponse = () => ({
  type: RESET_RESPONSE,
});
