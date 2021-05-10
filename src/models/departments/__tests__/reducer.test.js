// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'
import departmentsJson from 'utils/__tests__/fixtures/departments.json'

import reducer, { initialState } from '../reducer'
import * as constants from '../constants'

const depCount = 9

const intermediateState = fromJS({
  count: depCount,
  error: false,
  list: departmentsJson.results.slice(0, depCount),
  loading: false,
})

describe('models/departments/reducer', () => {
  test('default', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  test('FETCH_DEPARTMENTS', () => {
    const action = { type: constants.FETCH_DEPARTMENTS }

    const result = initialState.set('loading', true)

    expect(reducer(initialState, action)).toEqual(result)
    expect(reducer(intermediateState, action)).toEqual(result)
  })

  test('FETCH_DEPARTMENTS_SUCCESS', () => {
    const type = constants.FETCH_DEPARTMENTS_SUCCESS
    const action = { type, payload: departmentsJson }

    const result = fromJS({
      count: departmentsJson.count,
      error: false,
      errorMessage: '',
      list: departmentsJson.results,
      loading: false,
    })

    expect(reducer(initialState, action)).toEqual(result)
    expect(reducer(intermediateState, action)).toEqual(result)
  })

  test('FETCH_DEPARTMENTS_ERROR', () => {
    const type = constants.FETCH_DEPARTMENTS_ERROR
    const errorMessage = 'Wrong!!!1!'
    const payload = errorMessage
    const action = { type, payload }

    expect(reducer(initialState, action)).toEqual(
      initialState
        .set('error', true)
        .set('errorMessage', errorMessage)
        .set('loading', false)
    )

    expect(reducer(intermediateState, action)).toEqual(
      intermediateState
        .set('error', true)
        .set('errorMessage', errorMessage)
        .set('loading', false)
    )
  })
})
