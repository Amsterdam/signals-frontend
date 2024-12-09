// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { testSaga } from 'redux-saga-test-plan'

import * as actions from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { authCall, getErrorMessage } from 'shared/services/api/api'
import CONFIGURATION from 'shared/services/configuration/configuration'
import departmentsJson from 'utils/__tests__/fixtures/departments.json'

import { fetchDepartmentsSuccess, fetchDepartmentsError } from '../actions'
import { FETCH_DEPARTMENTS } from '../constants'
import watchDepartmentsSaga, { fetchDepartments } from '../saga'

describe('models/departments/saga', () => {
  it('should watchDepartmentsSaga', () => {
    testSaga(watchDepartmentsSaga)
      .next()
      .takeLatest(FETCH_DEPARTMENTS, fetchDepartments)
      .next()
      .isDone()
  })

  describe('fetchDepartments', () => {
    it('should call endpoint and dispatch success', () => {
      testSaga(fetchDepartments)
        .next()
        .call(authCall, CONFIGURATION.DEPARTMENTS_ENDPOINT)
        .next(departmentsJson)
        .put(fetchDepartmentsSuccess(departmentsJson))
        .next()
        .isDone()
    })

    it('should dispatch error', () => {
      const message = '404 not found'
      const error = new Error(message)

      testSaga(fetchDepartments)
        .next()
        .call(authCall, CONFIGURATION.DEPARTMENTS_ENDPOINT)
        .throw(error)
        .put(fetchDepartmentsError(message))
        .next()
        .put(
          actions.showGlobalNotification({
            title: getErrorMessage(error),
            message: 'De lijst van afdelingen kon niet opgehaald worden',
            variant: VARIANT_ERROR,
            type: TYPE_LOCAL,
          })
        )
        .next()
        .isDone()
    })
  })
})
