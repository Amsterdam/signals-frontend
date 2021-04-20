// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { all, call, put, takeLatest } from 'redux-saga/effects'
import * as Sentry from '@sentry/browser'

import CONFIGURATION from 'shared/services/configuration/configuration'
import {
  authCall,
  authPostCall,
  authPatchCall,
  getErrorMessage,
} from 'shared/services/api/api'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'

import {
  FETCH_ROLES,
  FETCH_PERMISSIONS,
  SAVE_ROLE,
  PATCH_ROLE,
} from './constants'

import {
  fetchRolesSuccess,
  fetchRolesError,
  fetchPermissionsSuccess,
  fetchPermissionsError,
  saveRoleSuccess,
  saveRoleError,
  patchRoleSuccess,
  patchRoleError,
} from './actions'

export function* fetchRoles() {
  const requestURL = CONFIGURATION.ROLES_ENDPOINT

  try {
    const roles = yield call(authCall, requestURL)
    yield put(fetchRolesSuccess(roles.results))
  } catch (error) {
    yield put(fetchRolesError())

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'Het rollen overzicht kon niet opgehaald worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    )

    yield call([Sentry, 'captureException'], error)
  }
}

export function* fetchPermissions() {
  const requestURL = CONFIGURATION.PERMISSIONS_ENDPOINT

  try {
    const permissions = yield call(authCall, requestURL)
    yield put(fetchPermissionsSuccess(permissions.results))
  } catch (error) {
    yield put(fetchPermissionsError())

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'Het permissie overzicht kon niet opgehaald worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    )

    yield call([Sentry, 'captureException'], error)
  }
}

export function* saveRole(action) {
  const requestURL = CONFIGURATION.ROLES_ENDPOINT
  const payload = action.payload
  try {
    const role = yield call(authPostCall, requestURL, payload)
    yield put(saveRoleSuccess(role))
  } catch (error) {
    yield put(saveRoleError())

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'De rol kon niet opgeslagen worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    )

    yield call([Sentry, 'captureException'], error)
  }
}

export function* patchRole(action) {
  const payload = action.payload
  const requestURL = `${CONFIGURATION.ROLES_ENDPOINT}${payload.id}`

  try {
    const role = yield call(authPatchCall, requestURL, payload)
    yield put(patchRoleSuccess(role))
  } catch (error) {
    yield put(patchRoleError())

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'De rol kon niet bijgewerkt worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    )

    yield call([Sentry, 'captureException'], error)
  }
}

export default function* watchRolesSaga() {
  yield all([
    takeLatest(FETCH_ROLES, fetchRoles),
    takeLatest(FETCH_PERMISSIONS, fetchPermissions),
    takeLatest(SAVE_ROLE, saveRole),
    takeLatest(PATCH_ROLE, patchRole),
  ])
}
