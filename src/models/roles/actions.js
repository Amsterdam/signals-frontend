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

export function fetchRoles() {
  return {
    type: FETCH_ROLES,
  };
}

export function fetchRolesSuccess(payload) {
  return {
    type: FETCH_ROLES_SUCCESS,
    payload,
  };
}

export function fetchRolesError(payload) {
  return {
    type: FETCH_ROLES_ERROR,
    payload,
  };
}

export function saveRole(payload) {
  return {
    type: SAVE_ROLE,
    payload,
  };
}

export function saveRoleSuccess(payload) {
  return {
    type: SAVE_ROLE_SUCCESS,
    payload,
  };
}

export function saveRoleError() {
  return {
    type: SAVE_ROLE_ERROR,
  };
}

export function patchRole(payload) {
  return {
    type: PATCH_ROLE,
    payload,
  };
}

export function patchRoleSuccess(payload) {
  return {
    type: PATCH_ROLE_SUCCESS,
    payload,
  };
}

export function patchRoleError() {
  return {
    type: PATCH_ROLE_ERROR,
  };
}
