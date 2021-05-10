// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import departmentsJson from 'utils/__tests__/fixtures/departments.json'

import * as actions from '../actions'
import * as constants from '../constants'

describe('models/departments/actions', () => {
  test('fetchDepartments', () => {
    expect(actions.fetchDepartments()).toEqual({
      type: constants.FETCH_DEPARTMENTS,
    })
  })

  test('fetchDepartmentsSuccess', () => {
    const payload = departmentsJson
    expect(actions.fetchDepartmentsSuccess(payload)).toEqual({
      type: constants.FETCH_DEPARTMENTS_SUCCESS,
      payload,
    })
  })

  test('fetchDepartmentsError', () => {
    const payload = new Error('Wrong!!!1!')

    expect(actions.fetchDepartmentsError(payload)).toEqual({
      type: constants.FETCH_DEPARTMENTS_ERROR,
      payload,
    })
  })
})
