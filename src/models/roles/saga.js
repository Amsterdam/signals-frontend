import { all, call, put, takeLatest } from 'redux-saga/effects';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, authPostCall, authPatchCall } from 'shared/services/api/api';

import {
  FETCH_ROLES,
  SAVE_ROLE,
  PATCH_ROLE,
} from './constants';

import {
  fetchRolesSuccess,
  fetchRolesError,
  saveRoleSuccess,
  saveRoleError,
  patchRoleSuccess,
  patchRoleError,
} from './actions';

export function* fetchRoles() {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/roles/`;

  try {
    const roles = yield call(authCall, requestURL);
    yield put(fetchRolesSuccess(roles.results));
  } catch (error) {
    yield put(fetchRolesError());
  }
}

export function* saveRole(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/roles/`;
  const payload = action.payload;
  try {
    const role = yield call(authPostCall, requestURL, payload);
    yield put(saveRoleSuccess(role));
  } catch (error) {
    yield put(saveRoleError());
  }
}

export function* patchRole(action) {
  const payload = action.payload;
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/roles/${payload.id}`;

  try {
    const role = yield call(authPatchCall, requestURL, payload.patch);
    yield put(patchRoleSuccess(role));
  } catch (error) {
    yield put(patchRoleError());
  }
}

export default function* watchRolesSaga() {
  yield all([
    takeLatest(FETCH_ROLES, fetchRoles),
    takeLatest(SAVE_ROLE, saveRole),
    takeLatest(PATCH_ROLE, patchRole),
  ])
}
