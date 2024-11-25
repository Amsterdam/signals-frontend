// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { takeLatest } from 'redux-saga/effects'
import { testSaga } from 'redux-saga-test-plan'

import * as actions from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import {
  authCall,
  authPostCall,
  authPatchCall,
  getErrorMessage,
} from 'shared/services/api/api'
import CONFIGURATION from 'shared/services/configuration/configuration'

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
import {
  FETCH_ROLES,
  SAVE_ROLE,
  PATCH_ROLE,
  FETCH_PERMISSIONS,
} from './constants'
import watchRolesSaga, {
  fetchRoles,
  fetchPermissions,
  saveRole,
  patchRole,
} from './saga'

describe('models/roles/saga', () => {
  const result = { id: 42 }
  const action = { payload: result }

  it('should watch rolesSaga', () => {
    testSaga(watchRolesSaga)
      .next()
      .all([
        takeLatest(FETCH_ROLES, fetchRoles),
        takeLatest(FETCH_PERMISSIONS, fetchPermissions),
        takeLatest(SAVE_ROLE, saveRole),
        takeLatest(PATCH_ROLE, patchRole),
      ])
      .next()
      .isDone()
  })

  describe('fetchRoles', () => {
    it('should dispatch success', () => {
      const listResult = { results: [{ id: 42 }, { id: 43 }] }

      testSaga(fetchRoles)
        .next()
        .call(authCall, CONFIGURATION.ROLES_ENDPOINT)
        .next(listResult)
        .put(fetchRolesSuccess(listResult.results))
        .next()
        .isDone()
    })

    it('should dispatch error', () => {
      const error = new Error('Something bad happened')

      testSaga(fetchRoles)
        .next()
        .throw(error)
        .put(fetchRolesError())
        .next()
        .put(
          actions.showGlobalNotification({
            title: getErrorMessage(error),
            message: 'Het rollen overzicht kon niet opgehaald worden',
            variant: VARIANT_ERROR,
            type: TYPE_LOCAL,
          })
        )
        .next()
        .next()
        .isDone()
    })
  })

  describe('fetchPermissions', () => {
    it('should dispatch success', () => {
      const listResult = { results: [{ id: 42 }, { id: 43 }] }

      testSaga(fetchPermissions)
        .next()
        .call(authCall, CONFIGURATION.PERMISSIONS_ENDPOINT)
        .next(listResult)
        .put(fetchPermissionsSuccess(listResult.results))
        .next()
        .isDone()
    })

    it('should dispatch error', () => {
      const error = new Error('Something bad happened')

      testSaga(fetchPermissions)
        .next()
        .throw(error)
        .put(fetchPermissionsError())
        .next()
        .put(
          actions.showGlobalNotification({
            title: getErrorMessage(error),
            message: 'Het permissie overzicht kon niet opgehaald worden',
            variant: VARIANT_ERROR,
            type: TYPE_LOCAL,
          })
        )
        .next()
        .next()
        .isDone()
    })
  })

  describe('saveRole', () => {
    it('should dispatch success', () => {
      testSaga(saveRole, action)
        .next()
        .call(authPostCall, CONFIGURATION.ROLES_ENDPOINT, result)
        .next(result)
        .put(saveRoleSuccess(result))
        .next()
        .isDone()
    })

    it('should dispatch error', () => {
      const error = new Error('Something bad happened')

      testSaga(saveRole, action)
        .next()
        .throw(error)
        .put(saveRoleError())
        .next()
        .put(
          actions.showGlobalNotification({
            title: getErrorMessage(error),
            message: 'De rol kon niet opgeslagen worden',
            variant: VARIANT_ERROR,
            type: TYPE_LOCAL,
          })
        )
        .next()
        .next()
        .isDone()
    })
  })

  describe('patchRole', () => {
    const requestPatchURL = `${CONFIGURATION.ROLES_ENDPOINT}42`
    const patchAction = {
      payload: {
        id: 42,
        ...result,
      },
    }

    it('should dispatch success', () => {
      testSaga(patchRole, patchAction)
        .next()
        .call(authPatchCall, requestPatchURL, result)
        .next(result)
        .put(patchRoleSuccess(result))
        .next()
        .isDone()
    })

    it('should dispatch error', () => {
      const error = new Error('Something bad happened')

      testSaga(patchRole, patchAction)
        .next()
        .throw(error)
        .put(patchRoleError())
        .next()
        .put(
          actions.showGlobalNotification({
            title: getErrorMessage(error),
            message: 'De rol kon niet bijgewerkt worden',
            variant: VARIANT_ERROR,
            type: TYPE_LOCAL,
          })
        )
        .next()
        .next()
        .isDone()
    })
  })
})
